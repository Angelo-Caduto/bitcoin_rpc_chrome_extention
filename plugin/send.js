setActiveMenuItem('menu_send_to');
var walletSelector = document.getElementById('wallet_selector');
walletslist(walletSelector, function onResultOk(walletsArray) {
});
document.getElementById('send_coins').addEventListener('click', function () {
    bitdata.method = 'sendtoaddress';
    bitdata.params = [
        document.getElementById('address').value,
        document.getElementById('amount').value,
        document.getElementById('comment').value,
        document.getElementById('comment_to').value
    ];

    bitcoinRpc(
        bitdata,
        function onResultOk(responseText) {
            let resp = JSON.parse(responseText);
            console.log(resp.result);
            document.getElementById('create_result').innerHTML = "Transaction id: " + resp.result + " .";
        },
        function onResultError(responseText, errorCode) {
            document.getElementById('error').innerHTML = "Transaction error";

        },
        'wallet/' + getSelectedWallet(walletSelector)
    );
});

// var xhr = new XMLHttpRequest();
    // var wallet_name = document.getElementById('')
    //
    // xhr.open("POST", "http://localhost:8332/", true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('Authorization', 'Basic ' + btoa('rpc_user_anyone' + ':' + 'rpc_password_of_anyone'));
    // xhr.onreadystatechange = function() {
    //     var dannie = document.getElementById('create_result');
    //     if (xhr.readyState == XMLHttpRequest.DONE && this.status == 200) {// если всё прошло хорошо, выполняем, что в скобках
    //         //{"result":{"name":"testwallet","warning":""},"error":null,"id":null}
    //         var resp = JSON.parse(xhr.responseText);
    //         dannie.innerHTML = "Transaction " + resp.result.txid + " .";
    //         console.log(xhr.responseText);
    //     } else {
    //         dannie.innerHTML = "Error: " + xhr.errorCode;
    //         console.log(xhr.responseText);
    //     }
    // };
    // console.log(JSON.stringify(bitData));
    // xhr.send(JSON.stringify(bitData));