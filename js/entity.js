class Entity{
    constructor(data){
        this.data = data;
    }
}

class EntityBlob{

    constructor() {
        this.keys = {}; //{key_1:{entity_idx:[values], ..., entity_idx:[values]}}
        this.entities = [];
    }

    addEntity(data){
        let entityIdx = this.entities.length;
        this.entities.push(new Entity(data));
        this.flattenKeys('', data, entityIdx);
    }

    flattenKeys(currentKey, data, entityIdx){
        console.log('flattening keys');
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
        }else if(!(currentKey in this.keys)){
            this.keys[currentKey] = {};
            this.keys[currentKey][entityIdx] = [data];
        }else{
            this.keys[currentKey][entityIdx] = [data];
        }
    }

    pivotEntities(key){
        //return a list of all unique values for 'key'

    }

    drillEntities(key, value){
        //if value == null, return a list of Entities that contain key

        //if value != null, return a list of Entities that contain
    }
}

function buildEntityBlob(data, dataType){
    console.log('building entity blob');
    try {
        switch (dataType) {
            case "JSON":
                return buildEntityBlobFromJSON(data);
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

function buildEntityBlobFromJSON(data){
    console.log('building entity blob from JSON');
    let root = settings.getCurrentSetting('data-root');console.log('root = ' + root);
    let entityBlob = new EntityBlob();console.log('typeof(data) == ' + typeof(data));
    if(Array.isArray(data)){console.log('data is a list, getting root data');
        for(let i in data){
            let rootData = (root !== null) ?  getDataAtRoot(data[i], root) : data[i];
            if(rootData !== null){
                entityBlob.addEntity(rootData);
            }
        }console.log(entityBlob);
        return entityBlob;
    }else if(typeof(data) === 'object'){
        console.log('data is an object, getting root data');
        if(root !== null){
            data = getDataAtRoot(data, root);
            if(data === null){
                throw new Error('Root not found');
            }
        }
        if(typeof(data) === 'object'){console.log('root data is an object, adding entity');
            entityBlob.addEntity(data); console.log(entityBlob);
            return entityBlob;
        }else if(Array.isArray(data)){console.log('root data is a list, adding entities');
            for(let i in data){
                entityBlob.addEntity(data);
            }console.log(entityBlob);
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
        for(let i in data){console.log('@' + data[i]);
            if(typeof(data[i]) === 'object'){
                return getDataAtRoot(data[i], root);
            }
        }
    }else if(typeof(data) === 'object'){
        let keys = Object.keys(data);
        for(let i in keys){console.log('@' + keys[i]);
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