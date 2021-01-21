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

    for(let key in queryData['positive']){
        let pivotTable = document.getElementById("--pivot-table-" + key);
        if(pivotTable !== null){
            let rows = pivotTable.childNodes;
            for(let j in rows){
                if(queryData['positive'][key].includes(rows[j].innerText)){
                    let td = rows[j].childNodes;
                    td[0].classList.remove('pivot-table-active-positive');
                }
            }
        }
    }

    for(let key in queryData['negative']){
        let pivotTable = document.getElementById("--pivot-table-" + key);
        if(pivotTable !== null){
            let rows = pivotTable.childNodes;
            for(let j in rows){
                if(queryData['negative'][key].includes(rows[j].innerText)){
                    let td = rows[j].childNodes;
                    td[0].classList.remove('pivot-table-active-negative');
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
    if(buttonId === null){
        //this is being called from toggleFieldButton() and will therefore remove the pivotTable and the entire key from the drillQuery
        drillQuery.remove(key, value, buttonId);
    }else{
        let button = document.getElementById(buttonId);
        if(button.classList.contains('pivot-table-active-positive')){
            button.classList.remove('pivot-table-active-positive');
            drillQuery.remove(key, value, 'positive');
        }
        if(button.classList.contains('pivot-table-active-negative')){
            button.classList.remove('pivot-table-active-negative');
            drillQuery.remove(key, value, 'negative');
        }
    }

    drillQuery.run();
}

function clearDrillQuery(){
    if(drillQuery !== null){
        deactivatePivotTables(drillQuery.queryData);
        drillQuery.queryData = {
            'positive':{},
            'negative':{}
        };
    }
    document.getElementById('input-drill').value = '';
    clearDrillButtons();
}

function clearDrillButtons(){
    let drillButtonContainer = document.getElementById('drill-button-container');
    drillButtonContainer.innerHTML = '';
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
        if(!(key in this.queryData[conditional])){
            this.queryData[conditional][key] = [value];
        }else{
            if(!(this.queryData[conditional][key].includes(value))){
                this.queryData[conditional][key].push(value);
            }
        }
    }

    print(){
        if(!(this.hasQuery())){
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

    hasQuery(){
        return Object.keys(this.queryData['positive']).length > 0 || Object.keys(this.queryData['negative']).length > 0;
    }

    run(){
        clearDrillButtons();
        if(this.hasQuery()){
            try{
                document.getElementById('input-drill').value = this.print();

                //get the indices of all entities that contain a key in the query
                let currentDataset = settings.getCurrentSetting('current-dataset');

                //collect all query keys together
                let queryKeys = {};
                for(let key in this.queryData['positive']){
                    queryKeys[key] = {'positive':null,'negative':null};
                    queryKeys[key]['positive'] = this.queryData['positive'][key];
                }
                for(let key in this.queryData['negative']){
                    if(!(key in queryKeys)){
                        queryKeys[key] = {'positive':null,'negative':null};
                    }
                    queryKeys[key]['negative'] = this.queryData['negative'][key];
                }

                //collect the indices of entities that contain keys in the query, both positive and negative
                let entityIndices = [];
                for(let key in queryKeys){
                    let indices = entityBlobs[currentDataset]['keys'][key]['entities'];
                    for(let j in indices){
                        if(!(entityIndices.includes(indices[j]))){
                            entityIndices.push(indices[j]);
                        }
                    }
                }

                //collect the indices of any entities that contain a positive value at positive key and DO NOT contain a negative value at negative key
                let filteredEntityIndices = [];
                for(let i in entityIndices){
                    let e = entityIndices[i];
                    for(let key in queryKeys){

                        let hasPositiveValueAtKey = this.hasValueAtKey(
                            key,
                            entityBlobs[currentDataset]['entities'][e].data,
                            queryKeys[key]['positive']
                        );

                        let hasNegativeValueAtKey = this.hasValueAtKey(
                            key,
                            entityBlobs[currentDataset]['entities'][e].data,
                            queryKeys[key]['negative']
                        );

                        if(!(filteredEntityIndices.includes(e)) && hasPositiveValueAtKey && !hasNegativeValueAtKey){
                            //if the entity is not yet in the array and it should be... add it
                            filteredEntityIndices.push(e);
                        }else if(hasNegativeValueAtKey){
                            //if the entity is already in the array and it shouldn't be... remove it and leave loops
                            filteredEntityIndices.splice(filteredEntityIndices.indexOf(e), 1);
                            break;
                        }
                    }
                }


                //add all entity indices that remain as drillButtons
                let drillButtonContainer = document.getElementById('drill-button-container');
                for(let i in filteredEntityIndices){
                    let drillButton = new DrillButton(filteredEntityIndices[i]);
                    drillButtonContainer.appendChild(drillButton.print());
                }
            }catch(e){
                summonChatterBox(e.message, 'error');
                if(e.stack){
                    console.log(e.stack);
                }
            }
        }else{
            document.getElementById('input-drill').value = '';
        }
    }

    hasValueAtKey(key, data, values){
        if(values === null){
            return false;
        }

        let hasValue = false;
        if(key !== null){
            let headKey = (key.includes(':')) ? key.split(':')[0] : key;
            let tailKey = (key.includes(':')) ? key.substring(key.indexOf(':') + 1, key.length) : '';
            data = data[headKey];
            if(tailKey.length > 0){ //there are more key levels, object is either an array containing dicts, or a dict
                if(Array.isArray(data)){ //data is an array
                    for(let i in data){
                        hasValue = this.hasValueAtKey(tailKey, data[i], values);
                        if(hasValue){
                            return true;
                        }
                    }
                }else if(typeof(data) === 'object'){ //data is a dict
                    for(let subKey in data){
                        headKey = (key.includes(':')) ? key.split(':')[0] : tailKey;
                        tailKey = (key.includes(':')) ? key.substring(key.indexOf(':') + 1, key.length) : '';
                        hasValue = this.hasValueAtKey(tailKey, data[subKey], values);
                        if(hasValue){
                            return true;
                        }
                    }
                } // only the previous two conditions can be true because there are more keys.
            }
        }

        if(!hasValue && (key === null || !(key.includes(':')))){
            //either the key is null or there are no more tailKeys - this must be the terminus.
            if(Array.isArray(data)){
                for(let i in data){
                    if(values.includes('' + data[i])){//FIXME : potentially dangerous coercing all datatypes to srings
                        return true;
                    }
                }
            }else{
                if(values.includes('' + data)){//FIXME : potentially dangerous coercing all datatypes to srings
                    return true;
                }
            }
        }
        return false;
    }

}