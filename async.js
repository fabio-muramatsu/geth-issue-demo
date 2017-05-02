/*jshint esversion: 6 */
const Web3 = require('web3');
const web3 = new Web3();

const Tx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');

const provider = new web3.providers.HttpProvider('http://localhost:8080');

var signAndSendTransaction = function(provider, nonce, callback) {
    web3.setProvider(provider);
    var transactionObj = {
        nonce: nonce,
        from: "0x722bbc43bb665a5570640b0a56af48364eaba495",
        to: "0x7423c975164969881680c7ad944444dfae1887f9",
        value: "0x100",
        gasPrice: '0x4a817c800', 
        gasLimit: "0x200000"
    };

    var privKey = Buffer.from("fdd97775a609e59f0fe5c8e8e24b847848c322c0ffd8f5d0ba8fe2120584ace7", "hex");
    //Corresponding address: 0x722bbc43bb665a5570640b0a56af48364eaba495

    var tx = new Tx(transactionObj);
    tx.sign(privKey);
    var serialized = tx.serialize();

    web3.eth.sendRawTransaction("0x" + serialized.toString("hex"), (err, result) => {
        if(err) {
            callback({ok: false, errorMessage: err.message});
            return;
        }
        callback({ok: true, result:result, nonce: transactionObj.nonce});
    });         
};

var count = 1;
var cb = (result) => console.log(result);

for(let nonce = 0 ; nonce < 100 ; ++nonce) {
    signAndSendTransaction(provider, nonce, cb);
}