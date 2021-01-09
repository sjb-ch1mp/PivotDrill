let server = null;
let panelNames = ['fields','pivot','drill','detail','settings'];
let drillQuery = null;

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