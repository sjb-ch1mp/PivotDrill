function summonChatterBox(message, type){
    let chatterBox = document.getElementById('chatter-box');
    chatterBox.innerText = message;
    switch(type){
        case "error":
            chatterBox.classList.add('text-red');
            chatterBox.classList.remove('text-orange');
            break;
        default:
            chatterBox.classList.add('text-orange');
            chatterBox.classList.remove('text-red');
    }
}

function setUpWorkspace(){
    let workspace = document.getElementById('workspace');
    let dim = getCurrentDimensions();

    let panelOpen = getOpenPanel();
    if(panelOpen !== null){
        setUpWorkspaceContainer(workspace, dim);
        openPanel(panelOpen.name);
        return;
    }

    //Set up workspace container
    setUpWorkspaceContainer(workspace, dim);

    //Set up sidebar
    let sidebar = document.getElementById('fields');
    sidebar.classList.remove('hidden');
    sidebar.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    sidebar.style.width = dim['SIDEBAR_WIDTH'] + "px";
    let panelHeader = document.getElementById('fields-heading');
    panelHeader.style.top = (dim['WORKSPACE_HEIGHT'] - panelHeader.clientHeight) + "px";
    let panelContainer = document.getElementById('fields-container');
    panelContainer.style.height = (dim['WORKSPACE_HEIGHT'] - 20) + "px";
    panelContainer.style.width = (dim['SIDEBAR_WIDTH'] - 20) + "px";

    //Set up panels
    let allPanels = document.getElementsByClassName('panel');
    for(let i in allPanels){
        if(allPanels[i].id && ['pivot','drill','detail'].includes(allPanels[i].id)){
            let panel = allPanels[i];
            panel.classList.remove('hidden');
            panel.style.height = dim['PANEL_HEIGHT'] + "px";
            panel.style.width = dim['PANEL_WIDTH'] + "px";
            panel.style.left = dim['SIDEBAR_WIDTH'] + "px";
            panelHeader = document.getElementById(panel.id + '-heading');
            panelHeader.style.top = (dim['PANEL_HEIGHT'] - panelHeader.clientHeight) + "px";
            panelContainer = document.getElementById(panel.id + '-container');
            panelContainer.style.height = (dim['PANEL_HEIGHT'] - 20) + "px";
            panelContainer.style.width = (dim['PANEL_WIDTH'] - 20) + "px";

            switch(panel.id){
                case 'drill':
                    panel.style.top = dim['PANEL_HEIGHT'] + "px";
                    break;
                case 'detail':
                    panel.style.top = (dim['PANEL_HEIGHT'] * 2) + "px";
            }
        }
    }

    //Set up other remaining interface variables
    document.getElementById('current-server').innerText = (server !== null) ? server : "no server";
}

function setUpWorkspaceContainer(workspace, dim){
    workspace.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    workspace.style.width = dim['WINDOW_WIDTH'] + "px";
    workspace.style.left = "0px";
    workspace.style.top = dim['HEADER_HEIGHT'] + "px";
}

function togglePanel(panelName){
    (getPanel(panelName).state === PanelState.OPEN) ? closePanel(panelName) : openPanel(panelName);
}

function openPanel(panelName){
    let dim = getCurrentDimensions();
    let panel = document.getElementById(panelName);
    let header = document.getElementById(panelName + '-heading');
    let container = document.getElementById(panelName + '-container');
    let allPanels = document.getElementsByClassName('panel');
    for(let i in allPanels){
        if(allPanels[i].id && panelNames.includes(allPanels[i].id) && allPanels[i].id !== panelName){
            allPanels[i].classList.add('hidden');
        }
    }

    panel.classList.remove('hidden');
    if(panelName === 'settings'){
        header.style.top = "5px";
        header.style.left = (dim['WINDOW_WIDTH'] - (header.clientWidth + 5)) + "px";
    }else{
        header.style.top = (dim['WORKSPACE_HEIGHT'] - header.clientHeight) + "px";
    }
    panel.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    panel.style.width = dim['WINDOW_WIDTH'] + "px";
    panel.style.left = "0px";
    panel.style.top = "0px";
    container.style.height = (dim['WORKSPACE_HEIGHT'] - 20) + "px";
    container.style.width = (dim['WINDOW_WIDTH'] - 20) + "px";
    getPanel(panelName).state = PanelState.OPEN;

}

function closePanel(panelName){
    if(panelName === 'settings'){
        document.getElementById(panelName).classList.add('hidden');
    }
    getPanel(panelName).state = PanelState.CLOSED;
    setUpWorkspace();
}

function getCurrentDimensions(){
    let WINDOW_HEIGHT = window.innerHeight;
    let WINDOW_WIDTH = window.innerWidth;
    let HEADER_HEIGHT = document.getElementById('header').clientHeight;
    let FOOTER_HEIGHT = document.getElementById('footer').clientHeight;
    let WORKSPACE_HEIGHT = WINDOW_HEIGHT - (HEADER_HEIGHT + FOOTER_HEIGHT);
    let SIDEBAR_WIDTH = (WINDOW_WIDTH * 0.20);
    let PANEL_HEIGHT = (WORKSPACE_HEIGHT / 3);
    let PANEL_WIDTH = (WINDOW_WIDTH - SIDEBAR_WIDTH);
    return {
        'WINDOW_HEIGHT':WINDOW_HEIGHT,
        'WINDOW_WIDTH':WINDOW_WIDTH,
        'HEADER_HEIGHT':HEADER_HEIGHT,
        'FOOTER_HEIGHT':FOOTER_HEIGHT,
        'WORKSPACE_HEIGHT':WORKSPACE_HEIGHT,
        'SIDEBAR_WIDTH':SIDEBAR_WIDTH,
        'PANEL_HEIGHT':PANEL_HEIGHT,
        'PANEL_WIDTH':PANEL_WIDTH
    };
}

function toggleFieldButton(fieldName, buttonId){
    let button = document.getElementById(buttonId);
    if(button.classList.contains('field-button-active')){
        removePivotTable(fieldName, buttonId);
    }else{
        addPivotTable(fieldName, buttonId);
    }
}

function togglePivotValue(key, value, buttonId){
    let button = document.getElementById(buttonId);
    if(button.classList.contains('pivot-table-active')){
        removeDrillValue(key, value, buttonId);
    }else{
        addDrillValue(key, value, buttonId);
    }
}

function toggleDetailButton(buttonId, divId){
    let button = document.getElementById(buttonId);
    (button.classList.contains('detail-button-active') ? closeDetailButton(buttonId, divId) : expandDetailButton(buttonId, divId));
}

function expandDetailButton(buttonId, divId){
    let button = document.getElementById(buttonId);
    let div = document.getElementById(divId);
    button.classList.remove('detail-button-inactive');
    button.classList.add('detail-button-active');
    div.classList.remove('hidden');
}

function closeDetailButton(buttonId, divId){
    let button = document.getElementById(buttonId);
    let div = document.getElementById(divId);
    button.classList.remove('detail-button-active');
    button.classList.add('detail-button-inactive');
    div.classList.add('hidden');
}