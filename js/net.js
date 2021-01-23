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
    if(server == null){
        summonChatterBox('No server to send query to!', 'error');
        return;
    }

    //send query to server
    summonChatterBox('Sending query');
}