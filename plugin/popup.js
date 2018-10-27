bitdata.method = 'getblockchaininfo';
bitdata.params = [];
setActiveMenuItem('menu_info');
bitcoinRpc(
    bitdata,
    function onResultOk(responseText) {
        let resp = JSON.parse(responseText);
        document.getElementById('chain').innerText = resp.result.chain;
        document.getElementById('blocks').innerText = resp.result.blocks;
        document.getElementById('headers').innerText = resp.result.headers;
        document.getElementById('bestblockhash').innerText = resp.result.bestblockhash;
        document.getElementById('chainwork').innerText = resp.result.chainwork;
        document.getElementById('size_on_disk').innerText = resp.result.size_on_disk;
    },
    function onResultError(responseText, errorCode) {
        document.getElementById('error').innerHTML = 'Error code: ' + errorCode;
    },
    ''
);