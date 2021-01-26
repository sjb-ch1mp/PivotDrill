class Entity{
    constructor(data){
        this.data = data;
    }
}

class EntityBlob{

    constructor(data) {
        this._raw = data;
        this.keys = {}; //{key_1:{entities:[entity_indexes], values:[values]}}
        this.entities = [];
    }

    addEntity(data){
        let entityIdx = this.entities.length;
        this.entities.push(new Entity(data));
        this.flattenKeys('', data, entityIdx);
    }

    flattenKeys(currentKey, data, entityIdx){
        if(Array.isArray(data)){
            for(let i in data){
                this.flattenKeys(
                    currentKey,
                    data[i],
                    entityIdx
                );
            }
        }else if(data !== null && typeof(data) === 'object'){
            let keys = Object.keys(data);
            for(let i in keys){
                this.flattenKeys(
                    (currentKey === '') ? keys[i] : currentKey + ":" + keys[i],
                    data[keys[i]],
                    entityIdx
                    );
            }
        }else{
            if(data !== undefined && data !== null && ('' + data).trim().length > 0){
                if(!(currentKey in this.keys)){
                    this.keys[currentKey] = {
                        'entities':[],
                        'values':[]
                    };
                }
                if(!(this.keys[currentKey]['entities'].includes(entityIdx))){
                    this.keys[currentKey]['entities'].push(entityIdx);
                }
                if(!(this.keys[currentKey]['values'].includes(data))){
                    this.keys[currentKey]['values'].push(data);
                }
            }
        }
    }
}

function buildEntityBlob(data, dataType, root){
    try {
        switch (dataType) {
            case "JSON":
                return buildEntityBlobFromJSON(data, root);
            case "CSV":
                return buildEntityBlobFromCSV(data);
        }
    }catch(e){
        summonChatterBox(e.message, 'error');
        if(e.stack){
            console.log(e.stack);
        }
    }
}

function buildEntityBlobFromJSON(data, root){
    getDataAtKey(data, root);
    let entityBlob = new EntityBlob(dataBuffer);
    for(let i in dataBuffer){
        entityBlob.addEntity(dataBuffer[i]);
    }
    dataBuffer = [];
    return entityBlob;
}

function buildEntityBlobFromCSV(data){
    return null; //FIXME
}

function getDataAtKey(data, key){
    let parent = (key !== null && key.includes(':')) ? key.split(':')[0] : key;
    let children = (key !== null && key.includes(':')) ? key.substring(key.indexOf(':') + 1, key.length) : null;
    if(parent === null){ //this is the terminus - either an array or a datum
        if(Array.isArray(data)){
            for(let i in data){
                dataBuffer.push(data[i]);
            }
        }else{
            dataBuffer.push(data);
        }
    }else{
        if(Array.isArray(data)){
            for(let i in data){
                getDataAtKey(data[i][parent], children);
            }
        }else{
            getDataAtKey(data[parent], children);
        }
    }
}

function setNewRootKey(root){
    let name = 'ROOT_' + root.toUpperCase();
    //check if root key already exists, if so - open that dataset
    if(Object.keys(entityBlobs).includes(name)){
        loadEntityBlob(name);
    }else{
        //if root key does not exist - create new root key dataset
        let entityBlob = buildEntityBlob(entityBlobs[settings.getCurrentSetting('current-dataset')]._raw, DataType.JSON, root);
        addNewEntityBlob(name, entityBlob);
    }
}

function loadEntityBlob(name){
    resetWorkspace(null);
    activateDatasetButton(name);
    clearFieldButtons();
    addFields(entityBlobs[name]);
    settings.saveNewSetting('current-dataset', name);
}

function addNewEntityBlob(name, entityBlob){
    name = name.toUpperCase().replace(/\s+/g, '_');
    entityBlobs[name] = entityBlob;
    addDatasetButton(name);
    loadEntityBlob(name);
}

function clearDatasets(){
    entityBlobs = {};
    clearDatasetButtons();
}

function saveDrillTableAsDataset(){

}

function buildEntityBlobFromSiblings(key){
    let mergeKey = key;
    let data = entityBlobs[settings.getCurrentSetting('current-dataset')]._raw;
    let depth = 0;
    if(mergeKey.includes(':')){
        let splitKey = mergeKey.split(':');
        depth = splitKey.length - 1;
        mergeKey = splitKey[depth];
    }
    let datasetName = 'MERGE_' + mergeKey.toUpperCase().replace(/\s+/g, '_');
    if(datasetName in entityBlobs){//dataset already exists FIXME : This is potentially dangerous if a key has the same name at two different levels
        loadEntityBlob(datasetName);
    }else{
        //make new merge dataset
        mergeDataOnKey(data, depth, mergeKey, 0);
        let entityBlob = new EntityBlob(dataBuffer);
        for(let i in dataBuffer){
            entityBlob.addEntity(dataBuffer[i]);
        }
        if(dataBuffer.length <= 1){
            summonChatterBox('No siblings for merge key "' + key + '"', 'error');
        }else{
            addNewEntityBlob('MERGE_' + mergeKey.toUpperCase().replace(/\s+/g, '_'), entityBlob);
        }
        dataBuffer = [];
    }
}

function mergeDataOnKey(data, depth, key, depthCount){
    if(Array.isArray(data)){
        for(let i in data){
            mergeDataOnKey(data[i], depth, key, depthCount);
        }
    }else if(data !== null && typeof(data) === 'object'){
        for(let subKey in data){
            if(depthCount === (depth - 1)){
                if(Object.keys(data[subKey]).includes(key)){
                    let siblingData = data[subKey];
                    siblingData['pivotdrill_metafield_parent'] = subKey;
                    dataBuffer.push(siblingData);
                }
            }else{
                mergeDataOnKey(data[subKey], depth, key, depthCount + 1);
            }
        }
    }
}