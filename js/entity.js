class Entity{
    constructor(data){
        this.data = data;
    }
}

class EntityBlob{

    constructor(_raw) {
        this._raw = _raw;
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
        }else if(typeof(data) === 'object'){
            let keys = Object.keys(data);
            for(let i in keys){
                this.flattenKeys(
                    (currentKey === '') ? keys[i] : currentKey + ":" + keys[i],
                    data[keys[i]],
                    entityIdx
                    );
            }
        }else{
            if(data === undefined || data === null || ('' + data).trim().length > 0){
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
    let entityBlob = new EntityBlob(data);
    if(Array.isArray(data)){
        for(let i in data){
            let rootData = (root !== null) ?  getDataAtRoot(data[i], root) : data[i];
            if(rootData !== null){
                entityBlob.addEntity(rootData);
            }
        }
        return entityBlob;
    }else if(typeof(data) === 'object'){
        if(root !== null){
            data = getDataAtRoot(data, root);
            if(data === null){
                throw new Error('Root key "' + root + '" not found in data');
            }
        }
        if(Array.isArray(data)){
            for(let i in data){
                entityBlob.addEntity(data[i]);
            }
            return entityBlob;
        }else if(typeof(data) === 'object'){
            entityBlob.addEntity(data);
            return entityBlob;
        }else{
            throw new Error('Unexpected data format');
        }
    }
}

function buildEntityBlobFromCSV(data){
    return null; //FIXME
}

function getDataAtRoot(data, root){
    if(Array.isArray(data)){
        for(let i in data){
            if(typeof(data[i]) === 'object'){
                return getDataAtRoot(data[i], root);
            }
        }
    }else if(typeof(data) === 'object'){
        let keys = Object.keys(data);
        for(let i in keys){
            if(keys[i] === root){
                return data[keys[i]];
            }else{
                let rootData = getDataAtRoot(data[keys[i]], root);
                if(rootData !== null){
                    return rootData;
                }
            }
        }
    }
    return null;
}

function setNewRootKey(root){
    let newDataset = 'ROOT_' + root.toUpperCase();
    //check if root key already exists, if so - open that dataset
    if(Object.keys(entityBlobs).includes(newDataset)){
        loadEntityBlob(newDataset);
    }else{
        //if root key does not exist - create new root key dataset
        let currentDataset = settings.getCurrentSetting('current-dataset');
        let entityBlob = buildEntityBlob(entityBlobs[currentDataset]._raw, DataType.JSON, root);
        addNewEntityBlob(newDataset, entityBlob);
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