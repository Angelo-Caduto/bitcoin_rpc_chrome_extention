setActiveMenuItem('menu_receive');

let txid;
let walletSelector = document.getElementById('wallet_selector_tr');

walletslist(walletSelector, function onResult(walletsArray) {

});

walletSelector.addEventListener('change', function () {
    if (walletSelector.selectedIndex > 0){
        bitdata.method = 'loadwallet';
        bitdata.params = [getSelectedWalletTr()];
        bitcoinRpc(
            bitdata,
            function onResultOk(responseText) {

            },
            function onResultError(responseText, errorCode) {

            },
            ''
        );
    }
});

function getSelectedWalletTr() {
    return walletSelector.options[walletSelector.selectedIndex].value;
}

function getAddress() {
    return document.getElementById('address_input_tr').value;
}

function getAmount() {
    return document.getElementById('amount_input_tr').value;
}

document.getElementById('create_row_transaction').addEventListener('click', function () {
    createRawTransaction();
});

// document.getElementById('create_partially_signed').addEventListener('click', function () {
//     walletCreateFundedPsbt();
// });

function walletCreateFundedPsbt (trCount) {
    let output = '[{ "' + getAddress() + '":"' + getAmount() + '" }]';
    bitdata.method = 'walletcreatefundedpsbt';
    bitdata.params = [[  ], JSON.parse(output)];
    console.log(bitdata);
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            finalizepsbt(JSON.parse(responseText).result.psbt.toString());
        },
        function onResultError(responseText, errorCode) {

        },
        'wallet/' + getSelectedWalletTr()
    );
}

function finalizepsbt  (psbtt) {
    console.log(psbtt);
    let t = psbtt;
    bitdata.method = 'finalizepsbt';
    bitdata.params = [ t ];
    console.log(bitdata);
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            sendRawTransaction(JSON.parse(responseText).result.psbt);
        },
        function onResultError(responseText, errorCode) {
            let errorMSG = JSON.parse(responseText).error.message;
            document.getElementById('error').innerHTML = errorMSG.length > 0 ?errorMSG : errorCode;
        },
        'wallet/' + getSelectedWalletTr()
    );
}



function createRawTransaction () {
    let output = '[{ "' + getAddress() + '":"' + getAmount() + '" }]';
    bitdata.method = 'createrawtransaction';
    bitdata.params = [ [ ], JSON.parse(output)];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            fundRawTransaction(JSON.parse(responseText).result);
        },
        function onResultError(responseText, errorCode) {
            let errorMSG = JSON.parse(responseText).error.message;
            document.getElementById('error').innerHTML = errorMSG.length > 0 ?errorMSG : errorCode;
        },
        ''
    );
}

function fundRawTransaction(hexstring) {
    bitdata.method = 'fundrawtransaction';
    bitdata.params = [ hexstring ];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            signRawTransactionWithWallet(JSON.parse(responseText).result.hex);
        },
        function onResultError(responseText, errorCode) {
            let errorMSG = JSON.parse(responseText).error.message;
            document.getElementById('error').innerHTML = errorMSG.length > 0 ?errorMSG : errorCode;
        },
        'wallet/' + getSelectedWalletTr()
    );
}

function signRawTransactionWithWallet(hexstring) {
    bitdata.method = 'signrawtransactionwithwallet';
    bitdata.params = [ hexstring ];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            sendRawTransaction(JSON.parse(responseText).result.hex);
        },
        function onResultError(responseText, errorCode) {
            let errorMSG = JSON.parse(responseText).error.message;
            document.getElementById('error').innerHTML = errorMSG.length > 0 ?errorMSG : errorCode;
        },
        'wallet/' + getSelectedWalletTr()
    );
}

function sendRawTransaction(hexstring) {
    bitdata.method = 'sendrawtransaction';
    bitdata.params = [ hexstring ];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            document.getElementById('result').innerHTML = 'Transaction ' + JSON.parse(responseText).result + " has been send";
        },
        function onResultError(responseText, errorCode) {
            let errorMSG = JSON.parse(responseText).error.message;
            document.getElementById('error').innerHTML = errorMSG.length > 0 ?errorMSG : errorCode;
        },
        'wallet/' + getSelectedWalletTr()
    );
}

function getLastTransaction() {
    bitdata.method = 'listtransactions';
    bitdata.params = [ "*", 1 ];
    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            let lastTr = JSON.parse(responseText).result;
            walletCreateFundedPsbt(lastTr.length === 0 ? 0 : lastTr[0].vout + 1);
        },
        function onResultError(responseText, errorCode) {
            document.getElementById('error').innerHTML = "Transaction error";
        },
        'wallet/' + getSelectedWalletTr()
    );
}