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
        this.addKeys(this.flattenKeys(data, entityIdx));
    }

    addKeys(flatKeys){
        
    }

    flattenKeys(){

    }

    pivotEntities(key){
        //return a list of all unique values for 'key'

    }

    drillEntities(key, value){
        //if value == null, return a list of Entities that contain key

        //if value != null, return a list of Entities that contain
    }
}

function buildEntityBlob(data){

}

function getDataAtRoot(data, keyCount, root){
    if(keyCount > Object.keys(data).length){
        return null;
    }else if(typeof(data) !== 'object'){
        return null;
    }else{
        let keys = Object.keys(data);
        for(let i in keys){
            if(keys[i] === root){
                return data[keys[i]];
            }else{
                return getDataAtRoot(data[keys[i]], keyCount++, root);
            }
        }
    }
}