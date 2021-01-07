function sendQuery(query){
    //clear query input
    document.getElementById('input-query').value = '';

    //check user has entered a query
    if(query.trim().length === 0){
        summonChatterBox('Please enter a query!', 'alert-danger');
        return;
    }

    //send query to server
    summonChatterBox(query, 'alert-success');
}