function addFields(data){

    let fields = Object.keys(data.keys);
    fields.sort();

    let noChildren = {};
    let hasChildren = {};
    let processedFields = {};
    for(let i in fields){
        if(fields[i].includes(':')){
            let parent = fields[i].split(':')[0];
            let child = fields[i].substring(fields[i].indexOf(':') + 1, fields[i].length);
            if(!(parent in hasChildren)){
                hasChildren[parent] = [];
            }
            hasChildren[parent].push(child);
        }else{
            noChildren[fields[i]] = null;
        }
    }

    for(let key in noChildren){
        processedFields[key] = noChildren[key];
    }

    for(let key in hasChildren){
        processedFields[key] = hasChildren[key];
    }

    let fieldButtonsContainer = document.getElementById('fields-button-container');
    for(let parent in processedFields){
        let field = new FieldButton(parent, processedFields[parent]);
        fieldButtonsContainer.appendChild(field.print());
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
    let parentButtonContainers = document.getElementsByClassName('parent-button-container');
    while(parentButtonContainers.length > 0){
        for(let i in parentButtonContainers){
            removeFieldButton(parentButtonContainers[i]);
        }
        parentButtonContainers = document.getElementsByClassName('parent-button-container');
    }
    let activeFieldButtons = document.getElementsByClassName('field-button-active');
    let inactiveFieldButtons = document.getElementsByClassName('field-button-inactive');
    while(activeFieldButtons.length > 0 || inactiveFieldButtons.length > 0){
        for(let i in activeFieldButtons){
            removeFieldButton(activeFieldButtons[i]);
        }
        for(let i in inactiveFieldButtons){
            removeFieldButton(inactiveFieldButtons[i]);
        }
        activeFieldButtons = document.getElementsByClassName('field-button-active');
        inactiveFieldButtons = document.getElementsByClassName('field-button-inactive');
    }
}

function removeFieldButton(button){
    if(typeof(button) === 'object' && button.id && (button.id.startsWith('--field') || button.id.startsWith('--parent-container-'))){
        document.getElementById('fields-button-container').removeChild(button);
    }
}

function addPivotTable(fieldName, buttonId){
    let values = entityBlobs[settings.getCurrentSetting('current-dataset')].keys[fieldName]['values'];
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

    if(drillQuery === null || drillQuery === undefined){
        drillQuery = new DrillQuery();
    }

    //search through data for all objects with this key:value pair
    let button = document.getElementById(buttonId);
    button.classList.add('pivot-table-active-' + conditional);

    drillQuery.add(key, value, conditional);
    drillQuery.run();
}

function removeDrillValue(key, value, buttonId){

    if(drillQuery === null || drillQuery === undefined){
        drillQuery = new DrillQuery();
    }

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
    clearDrillTable();
}

function clearDrillTable(){
    let drillButtonContainer = document.getElementById('drill-table-container');
    drillButtonContainer.innerHTML = '';
}

class FieldButton{
    constructor(parent, children){
        this.parent = parent;
        this.children = children;
    }

    print(){
        if(this.children !== null){
            let parentButtonContainer = document.createElement('div');
            parentButtonContainer.classList.add('parent-button-container');
            parentButtonContainer.id = '--parent-container-' + this.parent;
            let parentButton = document.createElement('button');
            parentButton.classList.add('parent-field-button');
            parentButton.classList.add('nounderline');
            parentButton.id = '--parent-button-' + this.parent;
            let root = this.parent;
            parentButton.onclick = function(){setNewRootKey(root)};
            parentButton.textContent = root;
            let childButtonContainer = document.createElement('div');
            childButtonContainer.classList.add('child-button-container');
            for(let i in this.children){
                childButtonContainer.appendChild(this.buildFieldButton(this.children[i]));
            }
            parentButtonContainer.appendChild(parentButton);
            parentButtonContainer.appendChild(childButtonContainer);
            return parentButtonContainer;
        }else{
            return this.buildFieldButton(this.parent);
        }
    }

    buildFieldButton(name){
        let button = document.createElement('button');
        button.id = "--field-" + ((this.children === null) ? name : this.parent + ':' + name);
        button.classList.add("field-button-inactive");
        button.classList.add("nounderline");
        button.onclick = function(){toggleFieldButton(this.id, event, 'field-button')};
        button.textContent = name;
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
        th.onclick = function(){toggleFieldButton("--field-" + key, event, null);};
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

        let toPrint = 'dataset="' + settings.getCurrentSetting('current-dataset') + '"';
        toPrint += (orStatements.length > 0) ? ' AND ' + orStatements.join(' AND ') : '';
        toPrint += ((notStatements.length > 0) ? ' AND NOT (' + notStatements.join(' OR ') + ')':'');
        return toPrint;
    }

    hasQuery(){
        return Object.keys(this.queryData['positive']).length > 0 || Object.keys(this.queryData['negative']).length > 0;
    }

    run(){
        clearDrillTable();
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
                if(filteredEntityIndices.length > 0){
                    let drillTable = new DrillTable(filteredEntityIndices);
                    let drillTableContainer = document.getElementById('drill-table-container');
                    drillTableContainer.appendChild(drillTable.print());
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
        let parent = (key !== null && key.includes(':')) ? key.split(':')[0] : key;
        let children = (key !== null && key.includes(':')) ? key.substring(key.indexOf(':') + 1, key.length) : null;
        if(parent === null){ //this is the terminus - either an array or a datum
            if(Array.isArray(data)){
                for(let i in data){
                    if(values.includes('' + data[i])){ //FIXME : coercing all datatypes to string might be dangerous
                        return true;
                    }
                }
            }else{
                if(values.includes('' + data)){ //FIXME : coercing all datatypes to string might be dangerous
                    return true;
                }
            }
        }else{
            if(Array.isArray(data)){
                for(let i in data){
                    hasValue = this.hasValueAtKey(children, data[i][parent], values);
                    if(hasValue === true){
                        break;
                    }
                }
            }else{
                hasValue = this.hasValueAtKey(children, data[parent], values);
            }
        }
        return hasValue;
    }
}

class DrillTable{

    constructor(entityIndices){
        this.entityBuffer = {};
        this.entities = [];
        this.headers = ['entity_id'];
        this.compileDataForDrillTable(entityIndices);
    }

    compileDataForDrillTable(entityIndices){
        for(let i in entityIndices){
            let data = entityBlobs[settings.getCurrentSetting('current-dataset')].entities[entityIndices[i]].data;
            this.entityBuffer['entity_id'] = entityIndices[i];
            this.flattenData('', data);
            let keys = Object.keys(this.entityBuffer);
            for(let j in keys){
                if(!(this.headers.includes(keys[j]))){
                    this.headers.push(keys[j]);
                }
            }
            this.entities.push(this.entityBuffer);
            this.entityBuffer = {};
        }
    }

    flattenData(currentKey, data){
        if(Array.isArray(data)){
            if(!this.arrayContainsObjects(data)){
                this.addDataToEntityBuffer(currentKey, data);
            }else{
                for(let i in data){
                    this.flattenData(
                        currentKey,
                        data[i],
                    );
                }
            }
        }else if(data !== null && typeof(data) === 'object'){
            let keys = Object.keys(data);
            for(let i in keys){
                this.flattenData(
                    (currentKey === '') ? keys[i] : currentKey + ":" + keys[i],
                    data[keys[i]]
                );
            }
        }else if(data !== null && data !== undefined && data.length > 0){
            this.addDataToEntityBuffer(currentKey, data);
        }
    }

    arrayContainsObjects(data){
        for(let i in data){
            if(typeof(data[i]) === 'object'){
                return true;
            }
        }
        return false;
    }

    addDataToEntityBuffer(key, data){
        if(data !== undefined && data !== null && ('' + data).trim().length > 0){
            if(!(key in this.entityBuffer)){
                this.entityBuffer[key] = [];
            }
            if(Array.isArray(data)){
                for(let i in data){
                    if(!(this.entityBuffer[key].includes(data[i]))){
                        this.entityBuffer[key].push(data[i]);
                    }
                }
            }else{
                if(!(this.entityBuffer[key].includes(data))){
                    this.entityBuffer[key].push(data);
                }
            }
        }
    }

    print(){
        let drillTable = document.createElement('table');
        drillTable.classList.add('drill-table');
        drillTable.appendChild(this.buildDrillTableHeader());
        for(let i in this.entities){
            drillTable.appendChild(this.buildDrillTableRow(i));
        }
        return drillTable;
    }

    buildDrillTableHeader(){
        let drillHeader = document.createElement('tr');
        drillHeader.classList.add('drill-table');
        for(let i in this.headers){
            let header = document.createElement('th');
            header.id = 'drill-table-col-' + this.headers[i].replace(/\s+/g, '_');
            header.classList.add('drill-table');
            header.classList.add('pivotdrill-heading');
            header.classList.add('nounderline');
            header.onclick = function(){hideDrillTableColumn(this.id)};
            header.textContent = this.headers[i];
            drillHeader.appendChild(header);
        }
        return drillHeader;
    }

    buildDrillTableRow(idx){
        let drillRow = document.createElement('tr');
        drillRow.classList.add('drill-table');
        for(let i in this.headers){
            let h = this.headers[i].replace(/\s+/g, '_');
            let elmt = document.createElement('td');
            elmt.classList.add('drill-table-col-' + h);
            elmt.classList.add('drill-table');
            elmt.innerHTML = this.formatArray(idx + "__" + h, (this.headers[i] in this.entities[idx]) ? this.entities[idx][this.headers[i]] : '-');
            drillRow.appendChild(elmt);
        }
        return drillRow;
    }

    formatArray(elmtId, data){
        if(Array.isArray(data)){
            //FIXME : toggleable content that hides long arrays
            return data;
        }else{
            return data;
        }
    }
}