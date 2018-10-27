const Key = 'RPC_USER';
const rpcPassKey = 'RPC_PASS';
const protocolKey = 'PROTOCOL';
const hostKey = 'HOST';
const portKey = 'PORT';
const walletIdKey = 'WALLET_ID';

var user;
var pass;
var protocol;
var host;
var port;
var wallet;

function buildPath(path) {
    return protocol + "://" + host + ":" + port + "/" + path;
}

function bitcoinRpc(bitData, onResultOk, onResultError, path) {
    initVariables();
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        buildPath(path),
        true
    );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + pass));
    xhr.onreadystatechange = function() {
        if (xhr.responseText.length > 0){
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('resp');
                console.log(JSON.parse(xhr.responseText));
                onResultOk(xhr.responseText);
            } else if (xhr.status != 200) {
                onResultError(xhr.responseText, xhr.errorCode);
            }
        }
    };
    console.log(JSON.stringify(bitData));
    xhr.send(JSON.stringify(bitData));
}

function initVariables() {
    user = localStorage.getItem(Key) == null ? 'rpc_user_anyone' : localStorage.getItem(Key);
    pass = localStorage.getItem(rpcPassKey) == null ? 'rpc_password_of_anyone' : localStorage.getItem(rpcPassKey);
    protocol = localStorage.getItem(protocolKey) == null ? 'http' : localStorage.getItem(protocolKey);
    host = localStorage.getItem(hostKey) == null ? 'localhost' : localStorage.getItem(hostKey);
    port = localStorage.getItem(portKey) == null ? 'localhost' : localStorage.getItem(portKey);
    wallet = localStorage.getItem(walletIdKey) == null ? 'localhost' : localStorage.getItem(walletIdKey);
}