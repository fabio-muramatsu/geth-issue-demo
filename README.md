# geth-issue-demo
Sample code to reproduce transaction drops in geth when calling `sendRawTransaction` asynchronously.

## Requirements
* geth v1.6.0
* Node.js v7

## Issue description
geth seems to drop transactions arbitrarily when sending many transactions in a row with the `sendRawTransaction` asynchronous RPC call. The script provided in `async.js` attempts to send 100 transactions to geth using this call. To do so, the transactions are assembled and signed before being sent to geth. However, some of them are not added to the transaction pool. This is evidenced by running `txpool.content.pending` in the console, which returns less than 100 transactions. If `sendRawTransaction` is called synchronously (as in `sync.js`), all transactions are added to the pool, as expected.

## Steps to reproduce
1. Run `npm install` to install dependencies;
2. Run a private chain with geth, and make sure address `0x722bbc43bb665a5570640b0a56af48364eaba495` has a few ethers. Since transactions are signed in the scripts, I had to fix this address;
3. Run `node async`. This script will send 100 transactions to geth asynchronously.

After running the script, the amount of transactions in the pool will likely be less than 100. The number of transactions in the pool after running the script varied in my tests.

Running `node sync` in step 3 will send the same 100 transactions with synchronous calls. In this case, I verified that all the transactions were consistently added to the pool.
