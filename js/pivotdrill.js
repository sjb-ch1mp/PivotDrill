function addFields(fields){
    //create a button for in field in list 'fields' and add it to the fields panel
    fields.sort();
    fields = weedOutDuplicates(fields);
    let fieldButtons = '';
    for(let i in fields){
        if(fields[i].trim().length > 0){
            let field = new Field(fields[i]);
            fieldButtons += field.print();
        }
    }
    document.getElementById('fields-container').innerHTML = fieldButtons;
}

function addPivotTable(fieldName, buttonId){
    //search through data for all objects with this field
    let button = document.getElementById(buttonId);
    button.classList.remove('field-button-inactive');
    button.classList.add('field-button-active');
    summonChatterBox('Button "' + buttonId + '" pressed. Adding pivot table for field "' + fieldName + '"');

    //go get all the unique values for that field
    let pivotTable = new PivotTable(fieldName, getTestValues());
    let pivotContainer = document.getElementById('pivot-container');
    pivotContainer.innerHTML += pivotTable.print();
}

function removePivotTable(fieldName, buttonId){
    let button = document.getElementById(buttonId);
    button.classList.remove('field-button-active');
    button.classList.add('field-button-inactive');
    summonChatterBox('Button "' + buttonId + '" pressed. Removing pivot table for field "' + fieldName + '"');

    let pivotContainer = document.getElementById('pivot-container');
    let pivotTable = document.getElementById('--pivot-table-' + fieldName);
    pivotContainer.removeChild(pivotTable);
}

function addDrillValue(key, value, buttonId){
    //search through data for all objects with this key:value pair
    let button = document.getElementById(buttonId);
    button.classList.remove('pivot-table-inactive');
    button.classList.add('pivot-table-active');
    summonChatterBox('Pivot value "' + key + ":" + value + '" pressed. Adding to drill query.');
}

function removeDrillValue(key, value, buttonId){
    let button = document.getElementById(buttonId);
    button.classList.remove('pivot-table-active');
    button.classList.add('pivot-table-inactive');
    summonChatterBox('Pivot value "' + key + ":" + value + '" pressed. Removing from drill query.');
}

function addDetail(objectId){
    //add the raw object identified by the objectId to the detail panel
}

function weedOutDuplicates(list){
    let unique = [];
    for(let i in list){
        if(!(unique.includes(list[i]))){
            unique.push(list[i]);
        }
    }
    return unique;
}

class Field{
    constructor(fieldName){
        this.fieldName = fieldName;
    }

    print(){
        let toPrint = '<button id="--field-' + this.fieldName + '" class="field-button-inactive nounderline" '
        toPrint += 'onclick="toggleFieldButton(this.innerText, this.id)">' + this.fieldName + '</button>';
        return toPrint;
    }
}

class PivotTable{
    constructor(key, values){
        this.key = key;
        this.values = values;
    }

    print(){
        let toPrint = '<table id="--pivot-table-' + this.key + '" class="pivot-table">';
        toPrint += '<th class="pivot-table">' + this.key + '</th>';
        let idx = 0;
        for(let i in this.values){
            idx++;
            toPrint += '<tr><td class="pivot-table-inactive"><a class="nounderline" onclick="togglePivotValue(' + "'" + this.key + "'" + ',this.innerText,this.id)" id="--pivot-' + this.key + '-' + idx + '">' + this.values[i] + '</a></td></tr>'
        }
        return toPrint + '</table>';
    }
}

class DrillTable{

}

class DrillQuery{

}

class Entity{
    //Container class for each individual entity in a data stream

}