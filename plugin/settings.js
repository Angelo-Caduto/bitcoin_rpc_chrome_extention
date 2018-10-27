const rpcUserViewID = 'settings_rpc_user';
const rpcPassViewID = 'settings_rpc_pass';
const protocolViewID = 'settings_protocol';
const hostViewID = 'settings_host';
const portViewID = 'settings_port';
const walletIdViewID = 'settings_wallet_id';

setActiveMenuItem('menu_settings');

function upddata(){
    saveToLS(Key, rpcUserViewID);
    saveToLS(rpcPassKey, rpcPassViewID);
    saveToLS(protocolKey, protocolViewID);
    saveToLS(hostKey, hostViewID);
    saveToLS(portKey, portViewID);
    // saveToLS(walletIdKey, walletIdViewID);
}

function saveToLS(key, viewId) {
    localStorage.setItem(key, document.getElementById(viewId).value);
}

function loadFromLS() {
    setDataToView(Key, rpcUserViewID, 'user name');
    setDataToView(rpcPassKey, rpcPassViewID, 'password');
    setDataToView(protocolKey, protocolViewID, 'http');
    setDataToView(hostKey, hostViewID, 'localhost');
    setDataToView(portKey, portViewID, '8332');
    // setDataToView(walletIdKey, walletIdViewID, 'id');
}

function setDataToView(key, viewID, defValue) {
    document.getElementById(viewID).value = localStorage.getItem(key) == null ? defValue : localStorage.getItem(key);
}

loadFromLS();

document.getElementById('save_settings').addEventListener('click', function () {
    upddata();
    alert('Setting has been saved');
});
