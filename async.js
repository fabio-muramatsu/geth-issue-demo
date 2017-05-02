/*jshint esversion: 6 */
const Web3 = require('web3');
const web3 = new Web3();

const Tx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');

const provider = new web3.providers.HttpProvider('http://localhost:8080');

/*
    This script attempts to send 100 transactions in a row to geth, using the sendRawTransaction
    RPC call asynchronously. In my tests, geth seems to receive all transactions, but some of them
    are not added to the transaction pool.
*/

// Transactions are signed before sending to geth. The following private key is used, which corresponds
// to public address 0x722bbc43bb665a5570640b0a56af48364eaba495.
var privKey = Buffer.from("fdd97775a609e59f0fe5c8e8e24b847848c322c0ffd8f5d0ba8fe2120584ace7", "hex");

var signAndSendTransaction = function(provider, nonce, callback) {
    web3.setProvider(provider);
    
    // Assemble a simple ether transfer transaction. Address 0x722bbc43bb665a5570640b0a56af48364eaba495
    // should have some ethers for this to work.
    var transactionObj = {
        nonce: nonce,
        from: "0x722bbc43bb665a5570640b0a56af48364eaba495",
        to: "0x7423c975164969881680c7ad944444dfae1887f9",
        value: "0x100",
        gasPrice: '0x4a817c800', 
        gasLimit: "0x200000"
    };

    // Sign the transaction with the private key of the sender
    var tx = new Tx(transactionObj);
    tx.sign(privKey);
    var serialized = tx.serialize();

    // Send the transaction asynchronously
    web3.eth.sendRawTransaction("0x" + serialized.toString("hex"), (err, result) => {
        if(err) {
            callback({ok: false, errorMessage: err.message});
            return;
        }
        callback({ok: true, result:result, nonce: transactionObj.nonce});
    });         
};

var cb = (result) => console.log(result);

// Send 100 transaction in a row to geth. Notice that sequential nonces are defined for the transaction,
// so they should be considered valid by geth.
for(let nonce = 0 ; nonce < 100 ; ++nonce) {
    signAndSendTransaction(provider, nonce, cb);
}