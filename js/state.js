let panelNames = ['fields','pivot','drill'/*,'settings'*/];
let drillQuery = null;
let settings = null;
let data = null;
let entityBlobs = {};

class Panel{
    constructor(name){
        this.name = name;
        this.state = PanelState.CLOSED;
    }
}

const PanelState = {
    'OPEN':'OPEN',
    'CLOSED':'CLOSED'
}

let fieldsPanel = new Panel('fields');
let pivotPanel = new Panel('pivot');
let drillPanel = new Panel('drill');
/*let settingsPanel = new Panel('settings');*/

function getPanel(panelName){
    switch(panelName){
        case 'fields':
            return fieldsPanel;
        case 'pivot':
            return pivotPanel;
        case 'drill':
            return drillPanel;/*
        case 'settings':
            return settingsPanel;*/
    }
}

function getOpenPanel(){
    for(let i in panelNames){
        if(getPanel(panelNames[i]).state === PanelState.OPEN){
            return getPanel(panelNames[i]);
        }
    }
    return null;
}

class Settings{
    constructor(){
        this.settings = {/*
            'rest-uri':null,
            'rest-headers':null,*/
            'current-dataset':null
        };
    }

    saveNewSetting(key, value){
        this.settings[key.trim()] = value.trim();
    }

    getCurrentSetting(key){
        return this.settings[key];
    }
}

const DataType = {
    "JSON":"JSON",
    "CSV":"CSV"
}

function loadData(event){
    try{
        if(event.target.files.length > 1){
            summonChatterBox('Can only load one file at a time. Loading the first file...');
        }
        let fileName = event.target.files[0].name;
        const reader = new FileReader();
        reader.addEventListener('load', function(event){
            data = JSON.parse(event.target.result.toString());
            addNewEntityBlob(fileName.replace(/\s+/g, '_').toUpperCase(), buildEntityBlob(data, DataType.JSON, null));
        });
        reader.readAsText(event.target.files[0]);
    }catch(e){
        summonChatterBox(e.message, 'error');
        if(e.stack){
            console.log(e.stack);
        }
    }
}