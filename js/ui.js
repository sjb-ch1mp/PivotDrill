function summonChatterBox(message, alertType){
    document.getElementById('chatter-box-msg').innerText = message;
    let chatterBox = document.getElementById('chatter-box');
    chatterBox.classList.add(alertType);
    chatterBox.classList.add('show');
    chatterBox.classList.remove('hidden');
}

function dismissChatterBox(){
    let chatterBox = document.getElementById("chatter-box");
    document.getElementById('chatter-box-msg').innerText = '';
    chatterBox.classList.remove('show');
    chatterBox.classList.add('hidden');
}
