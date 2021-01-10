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

    if(settings === null){
        settings = new Settings();
    }

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
    let panelMenu = document.getElementById('fields-menu');
    let panelContainer = document.getElementById('fields-container');
    sidebar.classList.remove('hidden');
    sidebar.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    sidebar.style.width = dim['SIDEBAR_WIDTH'] + "px";
    panelMenu.style.top = (dim['WORKSPACE_HEIGHT'] - panelMenu.clientHeight) + "px";
    panelMenu.style.width = (dim['SIDEBAR_WIDTH'] - 20) + "px";
    panelMenu.style.left = "5px";
    panelContainer.style.height = (dim['WORKSPACE_HEIGHT'] - (panelMenu.clientHeight + 15)) + "px";
    panelContainer.style.width = (dim['SIDEBAR_WIDTH'] - 20) + "px";

    //Set up panels
    let allPanels = document.getElementsByClassName('panel');
    for(let i in allPanels){
        if(allPanels[i].id && ['pivot','drill','detail'].includes(allPanels[i].id)){
            let panel = allPanels[i];
            panelMenu = document.getElementById(panel.id + '-menu');
            panelContainer = document.getElementById(panel.id + '-container');
            panel.classList.remove('hidden');
            panel.style.height = dim['PANEL_HEIGHT'] + "px";
            panel.style.width = dim['PANEL_WIDTH'] + "px";
            panel.style.left = dim['SIDEBAR_WIDTH'] + "px";
            panelMenu.style.top = (dim['PANEL_HEIGHT'] - panelMenu.clientHeight) + "px";
            panelMenu.style.width = (dim['PANEL_WIDTH'] - 20) + "px";
            panelMenu.style.left = "5px";
            panelContainer.style.height = (dim['PANEL_HEIGHT'] - (panelMenu.clientHeight + 15)) + "px";
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
    let menu = document.getElementById(panelName + '-menu');
    let container = document.getElementById(panelName + '-container');
    let allPanels = document.getElementsByClassName('panel');
    for(let i in allPanels){
        if(allPanels[i].id && panelNames.includes(allPanels[i].id) && allPanels[i].id !== panelName){
            allPanels[i].classList.add('hidden');
        }
    }

    if(panelName === "settings"){
        panel.style.width = (dim['WINDOW_WIDTH'] / 3) + "px";
        menu.style.width = ((dim['WINDOW_WIDTH'] / 3) - 20) + 'px';
        menu.style.left = "5px";
        panel.style.left = (dim['WINDOW_WIDTH'] / 3) + "px";
        container.style.width = ((dim['WINDOW_WIDTH'] / 3) - 20) + "px";
    }else{
        panel.style.width = dim['WINDOW_WIDTH'] + "px";
        menu.style.width = (dim['WINDOW_WIDTH'] - 20) + 'px';
        menu.style.left = "5px";
        panel.style.left = "0px";
        container.style.width = (dim['WINDOW_WIDTH'] - 20) + "px";
    }
    panel.classList.remove('hidden');
    menu.style.top = (dim['WORKSPACE_HEIGHT'] - menu.clientHeight) + "px";
    panel.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    panel.style.top = "0px";
    container.style.height = (dim['WORKSPACE_HEIGHT'] - (menu.clientHeight + 15)) + "px";

    getPanel(panelName).state = PanelState.OPEN;

    if(panelName === 'settings'){
        loadCurrentSettings();
    }
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

function toggleDrillbutton(entityId, buttonId){
    let button = document.getElementById(buttonId);
    (button.classList.contains('drill-button-active')) ? removeDetail(entityId, buttonId) : addDetail(entityId, buttonId);
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

function activateSettingsInput(id){
    let form = document.getElementById('form-' + id);
    let input = document.getElementById('input-' + id);
    let button = document.getElementById(id);
    if(button.innerText === 'CHANGE'){
        form.classList.remove("settings-inactive");
        form.classList.add("settings-active");
        input.classList.remove("settings-inactive");
        input.classList.add("settings-active");
        button.classList.remove("settings-inactive");
        button.classList.add("settings-active");
        button.innerText = 'SAVE';
    }else{
        settings.saveNewSetting(id, input.value);
        form.classList.remove("settings-active");
        form.classList.add("settings-inactive");
        input.classList.remove("settings-active");
        input.classList.add("settings-inactive");
        button.classList.remove("settings-active");
        button.classList.add("settings-inactive");
        button.innerText = 'CHANGE';
    }
}

function loadCurrentSettings(){
    document.getElementById('input-rest-uri').value = settings.getCurrentSetting('rest-uri');
    document.getElementById('input-rest-key').value = settings.getCurrentSetting('rest-key');
    document.getElementById('input-rest-username').value = settings.getCurrentSetting('rest-username');
    document.getElementById('input-data-root').value = settings.getCurrentSetting('data-root');
}