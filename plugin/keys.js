setActiveMenuItem('menu_key');

let walletSelector = document.getElementById('wallet_selector_key');
let addressesSelector = document.getElementById('wallet_addresses_selector_key');
let resultView = document.getElementById('result');
let errorView = document.getElementById('error');
let addressesList = [];

function getSelectedWallet(){
    return walletSelector.options[walletSelector.selectedIndex].value;
}

walletslist(walletSelector, function onResultOk(walletsArray) {

});

walletSelector.addEventListener('change', function () {
    addresseslist(getSelectedWallet(walletSelector), addressesList, addressesSelector);
});
addressesSelector.addEventListener('change', function () {
    loadAndUnloadIfLoad();
});

document.getElementById('dump_privekey').addEventListener('click', function () {
    if (addressesSelector.selectedIndex > 0) {

        bitdata.method = 'dumpprivkey';
        bitdata.params = [getSelectedAddress(addressesSelector)];

        bitcoinRpc(
            bitdata,
            function onResultOk(responseText) {
                let resp = JSON.parse(responseText);
                document.getElementById('privekey_input').value = resp.result;
            },
            function onResultError(responseText, errorCode) {
                document.getElementById('error').innerHTML = 'No select address';
            },
            'wallet/' + getSelectedWallet(walletSelector)
        );
    } else {
        alert('No select address');
    }
});

document.getElementById('dump_pubkey').addEventListener('click', function () {
    if (addressesSelector.selectedIndex > 0) {
        bitdata.method = 'getaddressinfo';
        bitdata.params = [getSelectedAddress(addressesSelector)];
        bitcoinRpc(
            bitdata,
            function onResultOk(responseText) {
                console.log(responseText);
                var resp = JSON.parse(responseText);
                console.log(resp);
                document.getElementById('pubkey_input').value = resp.result.pubkey;
            },
            function onResultError(responseText, errorCode) {

            },
            'wallet/' + getSelectedWallet(walletSelector)
        );
    } else {
        alert('No select address');
    }
});
document.getElementById('prive_key_import').addEventListener('click', function () {
    let prKey = document.getElementById('privekey_input').value;
    if (prKey.length > 0) {
        bitdata.method = 'importprivkey';
        bitdata.params = [prKey, "", false];

        bitcoinRpc(
            bitdata,
            function onResultOk(responseText) {
                resultView.innerHTML = 'Private key has been set'
            },
            function onResultError(responseText, errorCode) {
                errorView.innerHTML = JSON.parse(responseText).error.message;
            },
            'wallet/' + getSelectedWallet(walletSelector)
        );
    } else {
        errorView.innerHTML = 'Private key value should not be empty';
    }
});

document.getElementById('pub_key_import').addEventListener('click', function () {
    let prKey = document.getElementById('pubkey_input').value;
    if (prKey.length > 0) {
        bitdata.method = 'importpubkey';
        bitdata.params = [prKey, "", false];

        bitcoinRpc(
            bitdata,
            function onResultOk(responseText) {
                console.log('dsfds');
                resultView.innerHTML = 'Public key has been set'
            },
            function onResultError(responseText, errorCode) {
                console.log(responseText);
                errorView.innerHTML = JSON.parse(responseText).error.message;
            },
            'wallet/' + getSelectedWallet(walletSelector)
        );
    } else {
        errorView.innerHTML = 'Public key value should not be empty';
    }
});

function loadAndUnloadIfLoad() {
    loadWallet(document.getElementById('wallet_selector_key').value);
}
function loadWallet(walletname) {
    bitdata.method = 'loadwallet';
    bitdata.params = [walletname];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            console.log('load wallet');
            alert('Wallet has been loaded');
            var resp = JSON.parse(responseText);
            getWalletInfo(resp.result.name);
            addresseslist(resp.result.name, addressesList, addressesSelector);
        },
        function onResultError(responseText, errorCode) {

        },
        ''
    );
}