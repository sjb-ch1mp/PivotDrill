function sendQuery(query){
    //clear query input
    resetWorkspace('new_query');
    let openPanel = getOpenPanel();
    if(openPanel !== null && openPanel.name === 'settings'){
        togglePanel('settings');
    }
    document.getElementById('input-query').value = '';


    //FIXME : Test JSON
    addNewEntityBlob('MAIN', buildEntityBlob(JSON.parse(getTestJSON()), DataType.JSON, null));
    return;
    //FIXME : Test JSON


    //check user has entered a query
    if(query.trim().length === 0){
        summonChatterBox('Please enter a query!', 'error');
        return;
    }

    //check that the server is set
    if(settings.getCurrentSetting('rest-uri') === null){
        summonChatterBox('No REST API to send query to!', 'error');
        return;
    }

    //format headers and query for API
    summonChatterBox('Sending query');
    let restHeaders = settings.getCurrentSetting('rest-headers');
    let headers = {'Content-Type':'application/json'};
    if(restHeaders !== null){
        restHeaders = restHeaders.split(',');
        for(let i in restHeaders){
            if(restHeaders[i].includes(':')){
                headers[restHeaders[i].split(":")[0]] = restHeaders[i].split(':')[1];
            }
        }
    }
    let uri = settings.getCurrentSetting('rest-uri') + escape(query);

    //send request
    fetch(uri, {headers: headers})
        .then(response => addNewEntityBlob('MAIN', response.json(), DataType.JSON, null));
}