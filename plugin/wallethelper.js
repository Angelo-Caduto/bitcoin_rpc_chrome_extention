const selectedWalletIndexKey = 'SELECTED_WALLET_INDEX';
const selectedAddressIndexKey = 'SELECTED_ADDRESS_INDEX';
const selectedWalletValueKey = 'SELECTED_WALLET_VALUE';
const selectedAddressValueKey = 'SELECTED_ADDRESS_VALUE';
const walletsListKey = 'WALLETS_LIST';

var selectedWalletIndex = -1;
var selectedWalletValue = '';
var userWalletsNames = [];

function getUserWallets() {
    return localStorage.getItem(walletsListKey) == null ? [ ] : JSON.parse(localStorage.getItem(walletsListKey));
}

function saveUserWallets(new_wallet) {
    userWalletsNames = getUserWallets();
    userWalletsNames.push(new_wallet);
    localStorage.setItem(walletsListKey, JSON.stringify(userWalletsNames));
}

function unLoadWallet(walletname) {
    bitdata.method = 'unloadwallet';
    bitdata.params = [walletname];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            alert('has been unload')
        },
        function onResultError(responseText, errorCode) {

        },
        ''
    );
}

function getSelectedAndSave(walletSelector) {
    selectedWalletIndex = walletSelector.selectedIndex;
    selectedWalletValue = walletSelector.options[selectedWalletIndex].value;
    localStorage.setItem(selectedWalletIndexKey,selectedWalletIndex);
    localStorage.setItem(selectedWalletValueKey,selectedWalletValue);
}

function clearSelectedAndSave() {
    selectedWalletIndex = -1;
    selectedWalletValue = '';
    localStorage.setItem(selectedWalletIndexKey, '-1');
    localStorage.setItem(selectedWalletValueKey, '');
}

function clearListView(view) {
    view.selectedIndex = 0;
    while (view.firstChild) {
        view.removeChild(view.firstChild);
    }
    let option = document.createElement("option");
    option.id = 'please_choose';
    option.text = '-- Please choose --';
    view.appendChild(option);
}

function walletslist(walletSelector, onResult) {
    clearListView(walletSelector);
    userWalletsNames = getUserWallets();
    console.log(userWalletsNames);
    if (userWalletsNames != null) {
        for (var i = 0; i < userWalletsNames.length; i++) {
            var option = document.createElement("option");
            option.id = 'wallet_' + userWalletsNames[i];
            option.text = userWalletsNames[i];
            walletSelector.appendChild(option);
            console.log("wallet: " + userWalletsNames[i] + ' has been added.');
        }
        onResult(userWalletsNames);
    }
}

function loadedWallets(onResult) {
    bitdata.method = 'listwallets';
    bitdata.params = [];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            var resp = JSON.parse(responseText);
            onResult(resp.result);
        },
        function onResultError(responseText, errorCode) {
            alert('Error loading of wallets list');
    },
    ''
    );
}

function addresseslist(walletName, addressesNamesList, addressesSelector) {
    clearListView(addressesSelector);
    bitdata.method = 'getaddressesbylabel';
    bitdata.params = [''];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            addressesNamesList = [];
            var resp = JSON.parse(responseText);
            for(var key in resp.result){
                addressesNamesList.push(key);
                console.log("address: " + key + ' has been added.');
            }
            for (let i = 0; i < addressesNamesList.length; i++) {
                var option = document.createElement("option");
                option.id = 'address_' + addressesNamesList[i];
                option.text = addressesNamesList[i];
                addressesSelector.appendChild(option);
                console.log("adders: " + addressesNamesList[i] + ' has been added to view.');
            }
        },
        function onResultError(responseText, errorCode) {
            // alert('Error loading of addresses list');
        },
        'wallet/' + walletName
    );
}


function getSelectedWallet(walletSelector) {
    return walletSelector.options[walletSelector.selectedIndex].value
}

function getSelectedAddress(addressesSelector) {
    return addressesSelector.options[addressesSelector.selectedIndex].value;
}
