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

    /*if(panelName === "settings"){
        panel.style.width = (dim['WINDOW_WIDTH'] / 2) + "px";
        footer.style.width = ((dim['WINDOW_WIDTH'] / 2) - 20) + 'px';
        footer.style.left = "5px";
        panel.style.left = (dim['WINDOW_WIDTH'] / 4) + "px";
        container.style.width = ((dim['WINDOW_WIDTH'] / 2) - 20) + "px";
    }else{*/
        panel.style.width = dim['WINDOW_WIDTH'] + "px";
        footer.style.width = (dim['WINDOW_WIDTH'] - 20) + 'px';
        footer.style.left = "5px";
        panel.style.left = "0px";
        container.style.width = (dim['WINDOW_WIDTH'] - 20) + "px";
    //}
    panel.classList.remove('hidden');
    footer.style.top = (dim['WORKSPACE_HEIGHT'] - footer.clientHeight) + "px";
    panel.style.height = dim['WORKSPACE_HEIGHT'] + "px";
    panel.style.top = "0px";
    container.style.height = (dim['WORKSPACE_HEIGHT'] - (footer.clientHeight + 15)) + "px";

    getPanel(panelName).state = PanelState.OPEN;
}

function closePanel(panelName){
    /*
    if(panelName === 'settings'){
        document.getElementById(panelName).classList.add('hidden');
    }
     */
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

function toggleFieldButton(buttonId, event, caller){
    let fieldName = buttonId.replace('--field-', '');
    if(caller === 'field-button' && event.altKey){
        buildEntityBlobFromSiblings(fieldName);
    }else{
        let button = document.getElementById(buttonId);
        if(button.classList.contains('field-button-active')){
            removePivotTable(fieldName, buttonId);
            removeDrillValue(fieldName, null, null);
        }else{
            addPivotTable(fieldName, buttonId);
        }
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

/*
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
*/

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
    if(drillQuery && drillQuery.hasQuery()){
        drillQuery.run();
    }
}

function downloadDrillTable(){
    let filepath = document.getElementById('input-data').value.split('\\');
    let outJson = {
        'file':filepath[filepath.length - 1],
        'dataset':settings.getCurrentSetting('current-dataset'),
        'drill_results':[]
    };
    if(drillQuery !== null && drillQuery.hasQuery() && drillQuery.currentResults.length > 0){
        for(let i in drillQuery.currentResults){
            let e = entityBlobs[settings.getCurrentSetting('current-dataset')].entities[drillQuery.currentResults[i]];
            outJson['drill_results'].push(e.data);
        }
        downloadFile('drill_results.json', JSON.stringify(outJson));
    }else{
        summonChatterBox('No drill results to download', 'error');
    }
}

function downloadPivotTables(){
    let filepath = document.getElementById('input-data').value.split('\\');
    let outJson = {
        'file':filepath[filepath.length - 1],
        'dataset':settings.getCurrentSetting('current-dataset'),
        'pivot_tables':{}
    };
    let pivotTables = document.getElementById('pivot-table-container').childNodes;
    for(let i in pivotTables){
        if(typeof(pivotTables[i]) === 'object' && pivotTables[i].id && pivotTables[i].id.startsWith("--pivot-table-")){
            let key = pivotTables[i].firstChild.innerText
            let values = entityBlobs[settings.getCurrentSetting('current-dataset')].keys[key].values;
            outJson['pivot_tables'][key] = values;
        }
    }
    if(Object.keys(outJson['pivot_tables']).length > 0){
        downloadFile('pivot_tables.json', JSON.stringify(outJson));
    }else{
        summonChatterBox('No pivot tables to download', 'error');
    }
}

function downloadFile(name, data){
    let blob = new Blob([data], {type: 'application/json'});
    if(window.navigator.msSaveOrOpenBlob){
        window.navigator.msSaveOrOpenBlob(blob, name);
    }else{
        let element = window.document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = name;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

class ToggleArray{
    constructor(id, data){
        this.id = id;
        this.data = data;
    }

    print(){
        let span = document.createElement('span');
        let closeId = 'close__' + this.id;
        let openId = 'open__' + this.id;
        let toggler = this.buildToggler('[...]', closeId);
        toggler.id = closeId;
        span.appendChild(toggler);

        let listDiv = document.createElement('div');
        listDiv.id = openId;
        listDiv.classList.add('open-toggle-array');
        listDiv.classList.add('hidden');
        listDiv.appendChild(this.buildToggler('[...', openId));
        for(let i in this.data){
            if(this.data[i] !== null && ('' + this.data[i]).length > 0){
                let aryDiv = document.createElement('div');
                let tc = this.data[i];
                if(i < (this.data.length - 1)){
                    tc += ',';
                }
                aryDiv.textContent = tc;
                listDiv.appendChild(aryDiv);
            }
        }
        listDiv.appendChild(this.buildToggler('...]', openId));
        span.appendChild(listDiv);

        return span;
    }

    buildToggler(text, id){
        let toggler = document.createElement('a');
        toggler.textContent = text;
        toggler.href = "javascript:void(0)";
        toggler.classList.add('text-red');
        toggler.classList.add('nounderline');
        toggler.classList.add('toggler');
        toggler.onclick = function(){toggleToggleArray(id)};
        return toggler;
    }
}

function toggleToggleArray(id){
    let elmt = document.getElementById(id);
    let otherElmt = document.getElementById((id.startsWith('close__')) ? id.replace(/^close__/g, 'open__'): id.replace(/^open__/g, 'close__'));
    elmt.classList.add('hidden');
    otherElmt.classList.remove('hidden');
}