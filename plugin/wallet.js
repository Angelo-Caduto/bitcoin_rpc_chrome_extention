setActiveMenuItem('menu_wallet');
//View
let addressesListSelector = document.getElementById('wallet_addresses_selector');
let walletsSelect = document.getElementById('wallet_selector');

//V
let addressesNamesList = [];

//get from view
function getSelectedWallet(){
    return walletsSelect.options[walletsSelect.selectedIndex].value;
}

function getSelectedWalletIndex(){
    return walletsSelect.selectedIndex;
}

//update
function updWalletList() {
    walletslist(walletsSelect, function onResult(walletsArray) {
        updAddressesList();
        // ifSavedNotNull(walletsArray);
        // updLoaddedWallets();
    });
}

function updLoaddedWallets() {
    loadedWallets(function onResult(result) {
        document.getElementById('loaded_wallet').innerHTML = result;
    });
}

function updAddressesList(){
    addresseslist(getSelectedWallet(), addressesNamesList, addressesListSelector);
}

//Listeners
walletsSelect.addEventListener('change', function () {
    if (getSelectedWalletIndex() > 0){
        loadWallet(getSelectedWallet());
        getWalletInfo(getSelectedWallet());
        updLoaddedWallets();
        updAddressesList();
    }
    savePosition();
});

document.getElementById('create_address').addEventListener('click', function () {
    if (selectedWalletIndex < 0) {
        document.getElementById('new_address').innerHTML = "Wallet not selected";
    } else {
        createNewAddress(walletsSelect.options[selectedWalletIndex].value);
    }
});


//Bitcoin rpc function
function loadWallet(walletname) {
    bitdata.method = 'loadwallet';
    bitdata.params = [walletname];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            var resp = JSON.parse(responseText);
            console.log('wallet ' + resp.result.name + ' loaded');
            updLoaddedWallets();
            getWalletInfo(resp.result.name);
            updAddressesList();
        },
        function onResultError(responseText, errorCode) {

        },
        ''
    );
}

function getWalletInfo(wallet) {
    bitdata.method = 'getwalletinfo';
    bitdata.params = [];

    console.log(localStorage.getItem(walletIdKey));

    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            var resp = JSON.parse(responseText);
            document.getElementById('info_wallet_name').innerHTML = resp.result.walletname;
            document.getElementById('info_balance').innerHTML = resp.result.balance;
            document.getElementById('info_unconfirmed_balance').innerHTML = resp.result.unconfirmed_balance;
        },
        function onResultError(responseText, errorCode) {
            document.getElementById('error').innerHTML = 'Error loading of wallets list';
        },
        'wallet/' + wallet
    );
}

function createNewAddress(wallet, label) {
    bitdata.method = 'getnewaddress';
    bitdata.params = [label];

    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            var resp = JSON.parse(responseText);
            document.getElementById('create_result').innerHTML = "Your new address " + resp.result + " has been created";
            updAddressesList();

        },
        function onResultError(responseText, errorCode) {
            document.getElementById('error').innerHTML = 'Error of create new address';
        },
        'wallet/' + wallet
    );
}


//Main
updWalletList();
updLoaddedWallets();
restoreWalletPosition();

//saving pos
function savePosition() {
    let walletValue = getSelectedWallet();
    localStorage.setItem(selectedWalletValueKey, walletValue);
    let addr = [walletValue, getSelectedAddress(addressesListSelector)];
    localStorage.setItem(selectedAddressValueKey, JSON.stringify(addr));
}

function restoreWalletPosition() {
    let savedWallet = localStorage.getItem(selectedWalletValueKey);
    let savedAddr = localStorage.getItem(selectedWalletValueKey);
    if (savedWallet != null){
        let wlist = getUserWallets();
        for (let i = 0; i < wlist.length; i++){
            if (wlist[i] == savedWallet){
                walletsSelect.selectedIndex = i +1;
                getWalletInfo(savedWallet);
                updAddressesList();
                // if (savedWallet == savedAddr[0]){
                //     for (let j = 0; j < addressesNamesList.length; j++) {
                //         if (savedAddr[1] === addressesNamesList[j]){
                //             addressesListSelector.selectedIndex = j +1;
                //         }
                //     }
                // }
            }
        }
    }
}






var loadedWalletLable = document.getElementById('loaded_wallet');
// loadedWalletLable = localStorage.getItem(selectedWalletValueKey);
document.getElementById('load_wallet').addEventListener('click', function () {
    // getSelectedAndSave(walletsSelect);
    // loadedWalletLable.innerHTML = selectedWalletValue;
    loadWallet(walletsSelect.options[selectedWalletIndex].value);
});

document.getElementById('unload_wallet').addEventListener('click', function () {
    if (selectedWalletIndex >= 0) {
        unLoadWallet(walletsSelect.options[selectedWalletIndex].value);
        // clearSelectedAndSave(walletsSelect);
        // loadedWalletLable.innerHTML = 'non';
    }
});

function ifSavedNotNull(walletArr) {
    var tmpValue = localStorage.getItem(selectedWalletValueKey);
    var i = walletArr.length;
    while (i--) {
        if (walletArr[i] === tmpValue) {
            selectedWalletValue = tmpValue;
            selectedWalletIndex = i +1;
            walletsSelect.selectedIndex = selectedWalletIndex;
            console.log('Saved selected wallet: ' + selectedWalletValue);
            getWalletInfo(selectedWalletValue);
            updAddressesList();
        }
    }
}




addressesListSelector.addEventListener('change', function () {
    if (addressesListSelector.selectedIndex > 0)
        addressesInfo(getSelectedWallet(), getSelectedAddress(addressesListSelector));
});


// function getaddressinfo(walletName, address) {
//     bitdata.method = 'getaddressinfo';
//     bitdata.params = [address];
//     bitcoinRpc(
//         bitdata,
//         function onResultOk(responseText) {
//             console.log(responseText);
//             var resp = JSON.parse(responseText).result;
//             console.log(resp);
//             document.getElementById('info_address_s').innerHTML = resp.address;
//             document.getElementById('info_address_hex').innerHTML = resp.hex;
//             document.getElementById('info_address_master_key_id').innerHTML = resp.hdmasterkeyid;
//             document.getElementById('info_address_seed_id').innerHTML = resp.hdseedid;
//             document.getElementById('info_address_public_key').innerHTML = resp.pubkey;
//         },
//         function onResultError(responseText, errorCode) {
//             document.getElementById('error').innerHTML = 'Error loading of addresses list';
//         },
//         'wallet/' + walletName
//     );
// }





document.getElementById('create_wallet').addEventListener('click', function () {
    bitdata.method = 'createwallet';
    bitdata.params = [document.getElementById('wallet_name').value];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            var resp = JSON.parse(responseText);
            document.getElementById('create_result').innerHTML = "Wallet with name " + resp.result.name + " has been created.";
            console.log(responseText);
            saveUserWallets(resp.result.name);
            updWalletList();
        },
        function onResultError(responseText, errorCode) {
            document.getElementById('error').innerHTML = 'Error of create new wallet';
        },
        ''
    );
});

walletsSelect.addEventListener('change', function () {
    selectedWalletIndex = walletsSelect.selectedIndex;
    localStorage.setItem(selectedWalletIndexKey, selectedWalletIndex);
});






function addressesInfo(walletName, address){
    bitdata.method = 'getaddressinfo';
    bitdata.params = [ address ];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            var resp = JSON.parse(responseText).result;
            document.getElementById('info_address_s').innerHTML = resp.address;
            document.getElementById('info_address_hex').innerHTML = resp.hex;
            document.getElementById('info_address_master_key_id').innerHTML = resp.hdmasterkeyid;
            document.getElementById('info_address_seed_id').innerHTML = resp.hdseedid;
            document.getElementById('info_address_public_key').innerHTML = resp.pubkey;
        },
        function onResultError(responseText, errorCode) {

        },
        'wallet/' + walletName
    );
}








