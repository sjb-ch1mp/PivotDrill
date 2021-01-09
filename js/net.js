function sendQuery(query){
    //clear query input
    resetWorkspace();
    document.getElementById('input-query').value = '';

    //FIXME : Terminating function for debugging
    let testJSON = getTestJSON();
    addFields(testJSON.split(/\W/g));
    return;
    //FIXME : Terminating function for debugging

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
    summonChatterBox(query);
}