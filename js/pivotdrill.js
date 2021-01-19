function addFields(data){
    let fields = Object.keys(data.keys);
    //FIXME : Do pretty nesting here, e.g. results:host_type -> results [host_type] ???
    fields.sort();
    let fieldButtonsContainer = document.getElementById('fields-container');
    for(let i in fields){
        if(fields[i].trim().length > 0){
            let field = new FieldButton(fields[i]);
            fieldButtonsContainer.appendChild(field.print());
        }
    }
}

function activateFieldButton(buttonId){
    let button = document.getElementById(buttonId);
    button.classList.remove('field-button-inactive');
    button.classList.add('field-button-active');
}

function deactivateFieldButton(buttonId){
    let button = document.getElementById(buttonId);
    button.classList.remove('field-button-active');
    button.classList.add('field-button-inactive');
}

function clearFieldButtons(){
    let activeFieldButtons = document.getElementsByClassName('field-button-active');
    let inactiveFieldButtons = document.getElementsByClassName('field-button-inactive');
    while(activeFieldButtons.length > 0 || inactiveFieldButtons.length > 0){
        for(let i in activeFieldButtons){
            removeFieldButton(activeFieldButtons[i]);
        }
        for(let i in inactiveFieldButtons){
            removeFieldButton(inactiveFieldButtons[i]);
        }
    }
}

function removeFieldButton(button){
    if(typeof(button) === 'object' && button.id && button.id.startsWith('--field')){
        document.getElementById('fields-container').removeChild(button);
    }
}

function addPivotTable(fieldName, buttonId){
    let values = entityBlobs['_main'].keys[fieldName]['values'];
    values.sort();
    let pivotTable = new PivotTable(fieldName, values);
    let pivotContainer = document.getElementById('pivot-table-container');
    pivotContainer.appendChild(pivotTable.print());

    activateFieldButton(buttonId);
}

function removePivotTable(fieldName, buttonId){

    let pivotContainer = document.getElementById('pivot-table-container');
    let pivotTable = document.getElementById('--pivot-table-' + fieldName);
    pivotContainer.removeChild(pivotTable);

    if(drillQuery !== null && fieldName in drillQuery.queryData){
        drillQuery.remove(fieldName, null);
        drillQuery.run();
    }

    deactivateFieldButton(buttonId);
}

function clearPivotTables(){

    let pivotTables = document.getElementsByClassName('pivot-table');
    while(pivotTables.length > 0){
        for(let i in pivotTables){
            if(typeof(pivotTables[i]) === 'object' && pivotTables[i].id){
                let fieldName = pivotTables[i].id.replace("--pivot-table-", '');
                deactivateFieldButton('--field-' + fieldName);
                document.getElementById('pivot-table-container').removeChild(pivotTables[i]);
            }
        }
        pivotTables = document.getElementsByClassName('pivot-table');
    }

}

function deactivatePivotTables(queryData){
    if(document.getElementById('pivot-table-container').innerHTML.trim().length > 0){ //check if pivot tables exist
        for(let key in queryData['positive']){
            let rows = document.getElementById("--pivot-table-" + key).childNodes;
            for(let j in rows){
                if(queryData['positive'][key].includes(rows[j].innerText)){
                    let td = rows[j].childNodes;
                    td[0].classList.remove('pivot-table-active');
                }
            }
        }
        for(let key in queryData['negative']){
            let rows = document.getElementById("--pivot-table-" + key).childNodes;
            for(let j in rows){
                if(queryData['negative'][key].includes(rows[j].innerText)){
                    let td = rows[j].childNodes;
                    td[0].classList.remove('pivot-table-active');
                }
            }
        }
    }
}

function addDrillValue(key, value, buttonId, conditional){
    //search through data for all objects with this key:value pair
    let button = document.getElementById(buttonId);
    button.classList.add('pivot-table-active-' + conditional);

    if(drillQuery === null || drillQuery === undefined){
        drillQuery = new DrillQuery();
    }

    drillQuery.add(key, value, conditional);
    drillQuery.run();
}

function removeDrillValue(key, value, buttonId){
    let button = document.getElementById(buttonId);
    if(button.classList.contains('pivot-table-active-positive')){
        button.classList.remove('pivot-table-active-positive');
        drillQuery.remove(key, value, 'positive');
    }
    if(button.classList.contains('pivot-table-active-negative')){
        button.classList.remove('pivot-table-active-negative');
        drillQuery.remove(key, value, 'negative');
    }

    drillQuery.run();
}

function clearDrillQuery(){
    if(drillQuery !== null){
        deactivatePivotTables(drillQuery.queryData);
        drillQuery.queryData = {};
    }
    let drillInput = document.getElementById('input-drill');
    drillInput.value = '';
    clearDrillButtons();
    clearDetailButtons();
}

function clearDrillButtons(){
    let drillButtonContainer = document.getElementById('drill-button-container');
    drillButtonContainer.innerHTML = '';
}

function addDetail(entityId, buttonId){
    //add the raw object identified by the objectId to the detail panel
    if(buttonId !== null){
        let button = document.getElementById(buttonId);
        button.classList.remove('drill-button-inactive');
        button.classList.add('drill-button-active');
    }

    //fetch entity from entityBlob and add to detail pane

    let detailButton = new DetailButton(new Entity(entityId, JSON.parse(getTestJSON())));
    let detailContainer = document.getElementById('detail-container');
    detailContainer.appendChild(detailButton.print());
}

function removeDetail(entityId, buttonId){
    //add the raw object identified by the objectId to the detail panel
    if(buttonId !== null){
        let button = document.getElementById(buttonId);
        button.classList.remove('drill-button-active');
        button.classList.add('drill-button-inactive');
    }

    //fetch entity from entityBlob and add to detail pane

    let detailContainer = document.getElementById('detail-container');
    let detailButton = document.getElementById('--detail-container-' + entityId);
    detailContainer.removeChild(detailButton);
}

function clearDetailButtons(){
    let activeDetailButtons = document.getElementsByClassName('detail-button-active');
    let inactiveDetailButtons = document.getElementsByClassName('detail-button-inactive');
    while(activeDetailButtons.length > 0 || inactiveDetailButtons.length > 0){
        for(let i in activeDetailButtons){
            if(typeof(activeDetailButtons[i]) === 'object' && activeDetailButtons[i].id && activeDetailButtons[i].id.startsWith('--detail')){
                removeDetail(activeDetailButtons[i].id, null);
            }
        }
        for(let i in inactiveDetailButtons){
            if(typeof(inactiveDetailButtons[i]) === 'object' && inactiveDetailButtons[i].id && inactiveDetailButtons[i].id.startsWith('--detail')){
                removeDetail(inactiveDetailButtons[i].id, null);
            }
        }
    }
}

class FieldButton{
    constructor(fieldName){
        this.fieldName = fieldName;
    }

    print(){
        let button = document.createElement('button');
        button.id = "--field-" + this.fieldName;
        button.classList.add("field-button-inactive");
        button.classList.add("nounderline");
        button.onclick = function(){toggleFieldButton(this.innerText, this.id)};
        button.textContent = this.fieldName;
        return button;
    }
}

class PivotTable{
    constructor(key, values){
        this.key = key;
        this.values = values;
    }

    print(){
        let key = this.key;
        let table = document.createElement('table');
        table.id = "--pivot-table-" + this.key;
        table.classList.add("pivot-table");
        let th = document.createElement('th');
        th.classList.add("pivot-table");
        th.classList.add("nounderline");
        th.onclick = function(){toggleFieldButton(key, "--field-" + key);};
        th.textContent = this.key;
        table.appendChild(th);
        let idx = 0;
        for(let i in this.values){
            idx++;
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.classList.add("nounderline");
            td.onclick = function(){togglePivotValue(key, this.innerText, this.id, event)};
            td.id = "--pivot-" + this.key + "-" + idx;
            td.textContent = this.values[i];
            tr.appendChild(td);
            table.appendChild(tr);
        }
        return table;
    }
}

class DrillButton{
    constructor(entityId){
        this.entityId = entityId;
    }

    print(){
        let drillButton = document.createElement('button');
        drillButton.classList.add("drill-button-inactive");
        drillButton.classList.add("nounderline");
        drillButton.id = "--drill-" + this.entityId;
        drillButton.onclick = function(){toggleDrillbutton(this.innerText, this.id);};
        drillButton.textContent = this.entityId;
        return drillButton;
    }
}

class DrillQuery{
    constructor(){
        this.queryData = {
            'positive':{},
            'negative':{}
        }; //{positive:{key:[value, value, value],key:[value,value, value]},negative:{key:[value,..]}}
    }

    remove(key, value, conditional){
        if(value === null){
            if(this.queryData['positive'][key]){
                delete this.queryData['positive'][key];
            }
            if(this.queryData['negative'][key]){
                delete this.queryData['negative'][key];
            }
            return;
        }

        if(key in this.queryData[conditional] && this.queryData[conditional][key].includes(value)){
            let hold = [];
            for(let i in this.queryData[conditional][key]){
                if(this.queryData[conditional][key][i] !== value){
                    hold.push(this.queryData[conditional][key][i]);
                }
            }
            if(hold.length > 0){
                this.queryData[conditional][key] = hold;
            }else{
                delete this.queryData[conditional][key];
            }
        }
    }

    add(key, value, conditional){
        this.checkQueryData();
        if(!(key in this.queryData[conditional])){
            this.queryData[conditional][key] = [value];
        }else{
            if(!(this.queryData[conditional][key].includes(value))){
                this.queryData[conditional][key].push(value);
            }
        }
    }

    print(){
        if(this.queryData.length === 0){
            return '';
        }

        let orStatements = [];
        for(let key in this.queryData['positive']){
            let elements = [];
            for(let i in this.queryData['positive'][key]){
                elements.push(key + '="' + this.queryData['positive'][key][i] + '"');
            }
            orStatements.push('(' +  elements.join(' OR ') + ')');
        }

        let notStatements = [];
        for(let key in this.queryData['negative']){
            for(let i in this.queryData['negative'][key]){
                notStatements.push(key + '="' + this.queryData['negative'][key][i] + '"')
            }
        }

        let toPrint = (orStatements.length > 0) ? orStatements.join(' AND ') : '';
        toPrint += ((notStatements.length > 0) ? ((toPrint.length > 0) ? ' AND ' : '') +  'NOT (' + notStatements.join(' OR ') + ')':'');
        return toPrint;
    }

    checkQueryData(){
        if(!this.queryData['positive']){
            this.queryData['positive'] = {};
        }
        if(!this.queryData['negative']){
            this.queryData['negative'] = {};
        }
    }

    hasQuery(){
        return Object.keys(this.queryData['positive']).length > 0 || Object.keys(this.queryData['negative']).length > 0;
    }

    run(){
        clearDrillButtons();
        clearDetailButtons();
        document.getElementById('input-drill').value = this.print();
        if(this.hasQuery()){

            //FIXME: Run query and post resulting drill table
            let data = getDummyList();

            let drillButtonContainer = document.getElementById('drill-button-container');
            for(let i in data){
                let drillButton = new DrillButton(data[i]);
                drillButtonContainer.appendChild(drillButton.print());
            }
        }
    }
}

class DetailButton{
    //Container class for each individual entity in a data stream
    constructor(entity){
        this.entity = entity;
    }
    print(){
        let buttonId = '--detail-button-' + this.entity.entityId;
        let divId = '--detail-' + this.entity.entityId;
        let containerId = '--detail-container-' + this.entity.entityId;
        let container = document.createElement('div');
        container.id = containerId;
        let button = document.createElement('button');
        button.classList.add('detail-button-inactive');
        button.classList.add('nounderline');
        button.id = buttonId;
        button.onclick = function(){toggleDetailButton(buttonId, divId);};
        button.textContent = this.entity.entityId;
        let details = document.createElement('div');
        details.classList.add('hidden');
        details.classList.add('detail-container');
        details.id = divId;
        details.innerHTML = prettyPrintJson.toHtml(this.entity.data);
        container.appendChild(button);
        container.appendChild(details);
        return container;
    }
}