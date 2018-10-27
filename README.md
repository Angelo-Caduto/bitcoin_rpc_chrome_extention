#  Docker

### Building docker image
docker build -t bitcoind

### Running docker container
docker run -t -i -p 19001:19001 -p 19011:19011 bitcoin-testnet-box

### Start bitcoin
make start

#  Install in chrome
1. go to chrome://extensions/
2. turn on developer mode
3. click load unpacked
4. select plugin folder

![alt text](https://raw.githubusercontent.com/Angelo-Caduto/bitcoin_rpc_chrome_extention/master/img/chrome.png)

5. go to extension settings and input test server data

![alt text](https://raw.githubusercontent.com/Angelo-Caduto/bitcoin_rpc_chrome_extention/master/img/settings.png)