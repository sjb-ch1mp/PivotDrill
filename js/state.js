let server = null;
let panelNames = ['fields','pivot','drill','detail','settings'];
let drillQuery = null;
let settings = null;

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
let detailPanel = new Panel('detail');
let settingsPanel = new Panel('settings');

function getPanel(panelName){
    switch(panelName){
        case 'fields':
            return fieldsPanel;
        case 'pivot':
            return pivotPanel;
        case 'drill':
            return drillPanel;
        case 'detail':
            return detailPanel;
        case 'settings':
            return settingsPanel;
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
        this.settings = {
            'rest-uri':'',
            'rest-username':'',
            'rest-key':'',
            'data-root':''
        };
    }

    saveNewSetting(key, value){
        this.settings[key] = value;
    }

    getCurrentSetting(key){
        return this.settings[key];
    }
}