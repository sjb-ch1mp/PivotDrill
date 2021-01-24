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
    let panelFooter = document.getElementById('fields-footer');
    let panelContainer = document.getElementById('fields-container');
    sidebar.classList.remove('hidden');
    sidebar.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    sidebar.style.width = dim['SIDEBAR_WIDTH'] + "px";
    panelFooter.style.top = (dim['WORKSPACE_HEIGHT'] - panelFooter.clientHeight) + "px";
    panelFooter.style.width = (dim['SIDEBAR_WIDTH'] - 20) + "px";
    panelFooter.style.left = "5px";
    panelContainer.style.height = (dim['WORKSPACE_HEIGHT'] - (panelFooter.clientHeight + 15)) + "px";
    panelContainer.style.width = (dim['SIDEBAR_WIDTH'] - 20) + "px";

    //Set up panels
    let allPanels = document.getElementsByClassName('panel');
    for(let i in allPanels){
        if(allPanels[i].id && ['pivot','drill'].includes(allPanels[i].id)){
            let panel = allPanels[i];
            panelFooter = document.getElementById(panel.id + '-footer');
            panelContainer = document.getElementById(panel.id + '-container');
            panel.classList.remove('hidden');
            panel.style.height = dim['PANEL_HEIGHT'] + "px";
            panel.style.width = dim['PANEL_WIDTH'] + "px";
            panel.style.left = dim['SIDEBAR_WIDTH'] + "px";
            panelFooter.style.top = (dim['PANEL_HEIGHT'] - panelFooter.clientHeight) + "px";
            panelFooter.style.width = (dim['PANEL_WIDTH'] - 20) + "px";
            panelFooter.style.left = "5px";
            panelContainer.style.height = (dim['PANEL_HEIGHT'] - (panelFooter.clientHeight + 15)) + "px";
            panelContainer.style.width = (dim['PANEL_WIDTH'] - 20) + "px";
            if(panel.id === 'drill'){
                panel.style.top = dim['PANEL_HEIGHT'] + "px";
            }
        }
    }

    //Set up other remaining interface variables
    updateServer();
}

function updateServer(){
    let server = settings.getCurrentSetting('rest-uri');
    if(server === null){
        server = 'no server';
    }else{
        server = server.replace(/^http(s):/g, '');
        server = server.split('/')[2];
    }
    document.getElementById('current-server').innerText = server;
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
    let footer = document.getElementById(panelName + '-footer');
    let container = document.getElementById(panelName + '-container');
    let allPanels = document.getElementsByClassName('panel');
    for(let i in allPanels){
        if(allPanels[i].id && panelNames.includes(allPanels[i].id) && allPanels[i].id !== panelName){
            allPanels[i].classList.add('hidden');
        }
    }

    if(panelName === "settings"){
        panel.style.width = (dim['WINDOW_WIDTH'] / 2) + "px";
        footer.style.width = ((dim['WINDOW_WIDTH'] / 2) - 20) + 'px';
        footer.style.left = "5px";
        panel.style.left = (dim['WINDOW_WIDTH'] / 4) + "px";
        container.style.width = ((dim['WINDOW_WIDTH'] / 2) - 20) + "px";
    }else{
        panel.style.width = dim['WINDOW_WIDTH'] + "px";
        footer.style.width = (dim['WINDOW_WIDTH'] - 20) + 'px';
        footer.style.left = "5px";
        panel.style.left = "0px";
        container.style.width = (dim['WINDOW_WIDTH'] - 20) + "px";
    }
    panel.classList.remove('hidden');
    footer.style.top = (dim['WORKSPACE_HEIGHT'] - footer.clientHeight) + "px";
    panel.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    panel.style.top = "0px";
    container.style.height = (dim['WORKSPACE_HEIGHT'] - (footer.clientHeight + 15)) + "px";

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
    let PANEL_HEIGHT = (WORKSPACE_HEIGHT / 2);
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

function toggleFieldButton(buttonId){
    let fieldName = buttonId.replace('--field-', '');
    let button = document.getElementById(buttonId);
    if(button.classList.contains('field-button-active')){
        removePivotTable(fieldName, buttonId);
        removeDrillValue(fieldName, null, null);
    }else{
        addPivotTable(fieldName, buttonId);
    }
}

function togglePivotValue(key, value, buttonId, event){
    let button = document.getElementById(buttonId);
    if(button.classList.contains('pivot-table-active-positive') || button.classList.contains('pivot-table-active-negative')){
        removeDrillValue(key, value, buttonId);
    }else{
        if(event.altKey){
            event.stopPropagation();
            addDrillValue(key, value, buttonId, 'negative');
        }else{
            addDrillValue(key, value, buttonId, 'positive');
        }
    }
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
        settings.saveNewSetting(id, (input.value.trim() === '') ? null : input.value);
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
    document.getElementById('input-rest-headers').value = settings.getCurrentSetting('rest-headers');
}

function resetWorkspace(caller){//FIXME : THIS NEEDS TO CLEAR FIELD BUTTONS IF IT IS CALLED FROM SENDQUERY()
    clearPivotTables();
    clearDrillTable();
    clearDrillQuery();
    if(caller === 'new_query'){
        clearFieldButtons();
        clearDatasets();
    }
}

function resetDrillQueryInput(){
    if(drillQuery !== null){
        document.getElementById('input-drill').value = drillQuery.print();
    }
}

function toggleMenu(menuId){
    let menuName = menuId.split('-')[0];
    let menuButtonsContainer = document.getElementById(menuName + '-menu-button-container');
    let menuHeader = document.getElementById(menuName + '-menu');
    let dropdownButton = document.getElementById(menuName + '-dropdown-button');
    if(menuButtonsContainer.classList.contains('hidden')){
        menuButtonsContainer.classList.remove('hidden');
        switch(menuName){
            case 'fields':
                dropdownButton.textContent = 'DATASETS';
                break;
            default:
                dropdownButton.textContent = 'OPTIONS';
        }
    }else{
        menuButtonsContainer.classList.add('hidden');
        dropdownButton.textContent = '☰';
    }
}

function addDatasetButton(name){
    let button = document.createElement('button');
    button.classList.add('menu-button');
    button.classList.add('pivotdrill-heading');
    button.classList.add('nounderline');
    let id = 'dataset-' + name.toLowerCase();
    button.id = id;
    button.onclick = function(){loadEntityBlob(name)};
    button.textContent = name.toUpperCase();
    document.getElementById('fields-menu-button-container').appendChild(button);
}

function activateDatasetButton(name){
    name = name.toLowerCase();
    let dataSetButtons = document.getElementById('fields-menu-button-container').getElementsByClassName('menu-button-selected');
    if(dataSetButtons.length > 0){
        dataSetButtons[0].classList.remove('menu-button-selected');
    }
    document.getElementById('dataset-' + name).classList.add('menu-button-selected');
}

function clearDatasetButtons(){
    document.getElementById('fields-menu-button-container').innerHTML = '';
}

function hideDrillTableColumn(columnId){
    let column = document.getElementsByClassName(columnId);
    let header = document.getElementById(columnId);
    for(let row in column){
        if(typeof(column[row]) === 'object' && column[row].classList){
            column[row].classList.add('hidden');
        }
    }
    header.classList.add('hidden');
}

function restoreHiddenDrillTableColumns(){
    let drillTableContainer = document.getElementById('drill-table-container');
    if(drillTableContainer.innerHTML.length > 0){
        let hiddenColumns = drillTableContainer.getElementsByClassName('hidden');
        while(hiddenColumns.length > 0){
            for(let row in hiddenColumns){
                if(typeof(hiddenColumns[row]) === 'object' && hiddenColumns[row].classList){
                    hiddenColumns[row].classList.remove('hidden');
                }
            }
            hiddenColumns = drillTableContainer.getElementsByClassName('hidden');
        }
    }
}

function downloadDrillTable(){

}

function downloadPivotTables(){

}