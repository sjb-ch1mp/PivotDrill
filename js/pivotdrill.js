function addFields(data){
    //create a button for in field in list 'fields' and add it to the fields panel
    //data : stringified JSON
    data = JSON.parse(data);
    let root = settings.getCurrentSetting('data-root');
    if(!(root in Object.keys(data))){
        let rootData = getDataAtRoot(data, 1, root);
        if(rootData === null){
            summonChatterBox('Unable to locate root node "' + root + '" in data.', 'error');
            return;
        }else{
            data = rootData[0]; //FIXME : For the time being, I will fetch the first element of the array, but eventually, this is the point at which entities will be created and fields summarised
        }
    }
    let fields = dedupList(Object.keys(data));

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

function addPivotTable(fieldName, buttonId){
    //search through data for all objects with this field

    //go get all the unique values for that field
    let pivotTable = new PivotTable(fieldName, getDummyList());
    let pivotContainer = document.getElementById('pivot-container');
    pivotContainer.appendChild(pivotTable.print());

    activateFieldButton(buttonId);
}

function removePivotTable(fieldName, buttonId){

    let pivotContainer = document.getElementById('pivot-container');
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
                document.getElementById('pivot-container').removeChild(pivotTables[i]);
            }
        }
        pivotTables = document.getElementsByClassName('pivot-table');
    }

}

function deactivatePivotTables(queryData){
    if(document.getElementById('pivot-container').innerHTML.trim().length > 0){ //check if pivot tables exist
        for(let key in queryData){
            let rows = document.getElementById("--pivot-table-" + key).childNodes;
            for(let j in rows){
                if(queryData[key].includes(rows[j].innerText)){
                    let td = rows[j].childNodes;
                    td[0].classList.remove('pivot-table-active');
                }
            }
        }
    }
}

function addDrillValue(key, value, buttonId){
    //search through data for all objects with this key:value pair
    let button = document.getElementById(buttonId);
    button.classList.add('pivot-table-active');

    if(drillQuery === null){
        drillQuery = new DrillQuery();
    }
    drillQuery.add(key, value);
    drillQuery.run();
}

function removeDrillValue(key, value, buttonId){
    let button = document.getElementById(buttonId);
    button.classList.remove('pivot-table-active');

    drillQuery.remove(key, value);
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
    let button = document.getElementById(buttonId);
    button.classList.remove('drill-button-inactive');
    button.classList.add('drill-button-active');

    //fetch entity from entityBlob and add to detail pane

    let detailButton = new DetailButton(new Entity(entityId, JSON.parse(getTestJSON())));
    let detailContainer = document.getElementById('detail-container');
    detailContainer.appendChild(detailButton.print());
}

function removeDetail(entityId, buttonId){
    //add the raw object identified by the objectId to the detail panel
    let button = document.getElementById(buttonId);
    button.classList.remove('drill-button-active');
    button.classList.add('drill-button-inactive');

    //fetch entity from entityBlob and add to detail pane

    let detailContainer = document.getElementById('detail-container');
    let detailButton = document.getElementById('--detail-container-' + entityId);
    detailContainer.removeChild(detailButton);
}

function clearDetailButtons(){
    let detailContainer = document.getElementById('detail-container');
    detailContainer.innerHTML = '';
}

function dedupList(list){
    let unique = [];
    for(let i in list){
        if(!(unique.includes(list[i]))){
            unique.push(list[i]);
        }
    }
    return unique;
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
            td.onclick = function(){togglePivotValue(key, this.innerText, this.id)};
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
        this.queryData = {}; //{key:[value, value, value],key:[value,value, value]}
    }

    remove(key, value){
        if(value === null){
            delete this.queryData[key];
            return;
        }
        if(key in this.queryData && this.queryData[key].includes(value)){
            let hold = [];
            for(let i in this.queryData[key]){
                if(this.queryData[key][i] !== value){
                    hold.push(this.queryData[key][i]);
                }
            }
            if(hold.length > 0){
                this.queryData[key] = hold;
            }else{
                delete this.queryData[key];
            }
        }
    }

    add(key, value){
        if(!(key in this.queryData)){
            this.queryData[key] = [value];
        }else{
            if(!(this.queryData[key].includes(value))){
                this.queryData[key].push(value);
            }
        }
    }

    print(){
        if(this.queryData.length === 0){
            return '';
        }

        let orStatements = [];
        for(let key in this.queryData){
            let elements = [];
            for(let i in this.queryData[key]){
                elements.push(key + ":" + this.queryData[key][i]);
            }
            orStatements.push('(' +  elements.join(' OR ') + ')');
        }
        return orStatements.join(' AND ');
    }

    hasQuery(){
        return Object.keys(this.queryData).length > 0;
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