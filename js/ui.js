function summonChatterBox(message, type){
    let chatterBox = document.getElementById('chatter-box');
    chatterBox.innerText = message;
    switch(type){
        case "error":
            chatterBox.classList.add('bg-error');
            chatterBox.classList.remove('bg-normal');
            break;
        default:
            chatterBox.classList.add('bg-normal');
            chatterBox.classList.remove('bg-error');
    }
}

function dismissChatterBox(){
    let chatterBox = document.getElementById("chatter-box");
    chatterBox.innerText = '';
}

function setUpWorkspace(){
    const WINDOW_HEIGHT = window.innerHeight;
    const WINDOW_WIDTH = window.innerWidth;
    const HEADER_HEIGHT = document.getElementById('header').clientHeight;
    const FOOTER_HEIGHT = document.getElementById('footer').clientHeight;
    const WORKSPACE_HEIGHT = WINDOW_HEIGHT - (HEADER_HEIGHT + FOOTER_HEIGHT);
    const SIDEBAR_WIDTH = (WINDOW_WIDTH * 0.20);
    const PANEL_HEIGHT = (WORKSPACE_HEIGHT / 3);
    const PANEL_WIDTH = (WINDOW_WIDTH - SIDEBAR_WIDTH);

    let workspace = document.getElementById('workspace');
    let fields = document.getElementById('fields');
    let pivot = document.getElementById('pivot');
    let drill = document.getElementById('drill');
    let detail = document.getElementById('detail');

    //Set up workspace container
    let style = "height:" + WORKSPACE_HEIGHT + "px;";
    style += "width:" + WINDOW_WIDTH + "px;";
    style += "left:0px;";
    style += "top:" + HEADER_HEIGHT + "px;";
    workspace.setAttribute('style', style);

    //Set up fields container
    style = "height:" + WORKSPACE_HEIGHT + "px;";
    style += "width:" + SIDEBAR_WIDTH + "px;"
    fields.setAttribute('style', style);
    let panelHeader = document.getElementById('fields-heading');
    panelHeader.style.top = (WORKSPACE_HEIGHT - panelHeader.clientHeight) + "px";

    //Set up pivot container
    style = "height:" + PANEL_HEIGHT + "px;";
    style += "width:" + PANEL_WIDTH + "px;";
    style += "left:" + SIDEBAR_WIDTH + "px;";
    pivot.setAttribute('style', style);
    panelHeader = document.getElementById('pivot-heading');
    panelHeader.style.top = (PANEL_HEIGHT - panelHeader.clientHeight) + "px";

    //Set up drill container
    style = "height:" + PANEL_HEIGHT + "px;";
    style += "width:" + PANEL_WIDTH + "px;";
    style += "left:" + SIDEBAR_WIDTH + "px;";
    style += "top:" + PANEL_HEIGHT + "px;";
    drill.setAttribute('style', style);
    panelHeader = document.getElementById('drill-heading');
    panelHeader.style.top = (PANEL_HEIGHT - panelHeader.clientHeight) + "px";

    //Set up object container
    style = "height:" + PANEL_HEIGHT + "px;";
    style += "width:" + PANEL_WIDTH + "px;";
    style += "left:" + SIDEBAR_WIDTH + "px;";
    style += "top:" + (PANEL_HEIGHT * 2) + "px;";
    detail.setAttribute('style', style);
    panelHeader = document.getElementById('detail-heading');
    panelHeader.style.top = (PANEL_HEIGHT - panelHeader.clientHeight) + "px";


    //Set up other remaining interface variables
    document.getElementById('current-server').innerText = (server !== null) ? server : "no server";
    document.getElementById('input-query').style.width = (WINDOW_WIDTH * 0.90) + "px";
}