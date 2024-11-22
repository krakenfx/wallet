import { Legacy_scriptPubKeyToAddress, SegwitBech32_scriptPubKeyToAddress, SegwitP2SH_scriptPubKeyToAddress } from './BlueElectrumExtensions';
import { splitIntoChunks, ElectrumState } from './BlueElectrumTyped';
const bitcoin = require('bitcoinjs-lib');
const ElectrumClient = require('electrum-client');
const reverse = require('buffer-reverse');
const BigNumber = require('bignumber.js');

const net = require('net');
const tls = require('tls');

module.exports.getBalanceByAddress = async function (address) {
  if (!ElectrumState.mainClient) throw new Error('Electrum client is not connected');
  const script = bitcoin.address.toOutputScript(address);
  const hash = bitcoin.crypto.sha256(script);
  const reversedHash = Buffer.from(reverse(hash));
  const balance = await ElectrumState.mainClient.blockchainScripthash_getBalance(reversedHash.toString('hex'));
  balance.addr = address;
  return balance;
};

module.exports.getConfig = async function () {
  if (!ElectrumState.mainClient) throw new Error('Electrum client is not connected');
  return {
    host: ElectrumState.mainClient.host,
    port: ElectrumState.mainClient.port,
    serverName: ElectrumState.mainClient.serverName,
    connected: ElectrumState.mainClient.timeLastCall !== 0 && ElectrumState.mainClient.status,
  };
};

module.exports.getSecondsSinceLastRequest = function () {
  return ElectrumState.mainClient && ElectrumState.mainClient.timeLastCall ? (+new Date() - ElectrumState.mainClient.timeLastCall) / 1000 : -1;
};

module.exports.getTransactionsByAddress = async function (address) {
  if (!ElectrumState.mainClient) throw new Error('Electrum client is not connected');
  const script = bitcoin.address.toOutputScript(address);
  const hash = bitcoin.crypto.sha256(script);
  const reversedHash = Buffer.from(reverse(hash));
  const history = await ElectrumState.mainClient.blockchainScripthash_getHistory(reversedHash.toString('hex'));
  for (const h of history || []) {
    if (h.tx_hash) ElectrumState.txhashHeightCache[h.tx_hash] = h.height;
  }

  return history;
};

module.exports.ping = async function () {
  try {
    await ElectrumState.mainClient.server_ping();
  } catch (_) {
    ElectrumState.mainConnected = false;
    return false;
  }
  return true;
};

module.exports.getTransactionsFullByAddress = async function (address) {
  const txs = await this.getTransactionsByAddress(address);
  const ret = [];
  for (const tx of txs) {
    const full = await ElectrumState.mainClient.blockchainTransaction_get(tx.tx_hash, true);
    full.address = address;
    for (const input of full.vin) {
      const prevTxForVin = await ElectrumState.mainClient.blockchainTransaction_get(input.txid, true);
      if (prevTxForVin && prevTxForVin.vout && prevTxForVin.vout[input.vout]) {
        input.value = prevTxForVin.vout[input.vout].value;

        if (prevTxForVin.vout[input.vout].scriptPubKey && prevTxForVin.vout[input.vout].scriptPubKey.addresses) {
          input.addresses = prevTxForVin.vout[input.vout].scriptPubKey.addresses;
        }
      }
    }

    for (const output of full.vout) {
      if (output.scriptPubKey && output.scriptPubKey.addresses) output.addresses = output.scriptPubKey.addresses;
    }
    full.inputs = full.vin;
    full.outputs = full.vout;
    delete full.vin;
    delete full.vout;
    delete full.hex;
    delete full.hash;
    ret.push(full);
  }

  return ret;
};

module.exports.multiGetTransactionByTxid = async function (txids, batchsize, verbose = true) {
  batchsize = batchsize || 45;

  if (!ElectrumState.mainClient) throw new Error('Electrum client is not connected');
  const ret = {};

  const chunks = splitIntoChunks(txids, batchsize);
  for (const chunk of chunks) {
    let results = [];

    if (ElectrumState.disableBatching) {
      try {
        const promises = [];
        const index2txid = {};
        for (let promiseIndex = 0; promiseIndex < chunk.length; promiseIndex++) {
          const txid = chunk[promiseIndex];
          index2txid[promiseIndex] = txid;
          promises.push(ElectrumState.mainClient.blockchainTransaction_get(txid, verbose));
        }

        const transactionResults = await Promise.all(promises);
        for (let resultIndex = 0; resultIndex < transactionResults.length; resultIndex++) {
          let tx = transactionResults[resultIndex];
          if (typeof tx === 'string' && verbose) {
            tx = txhexToElectrumTransaction(tx);
          }
          const txid = index2txid[resultIndex];
          results.push({ result: tx, param: txid });
        }
      } catch (_) {
        for (const txid of chunk) {
          try {
            let tx = await ElectrumState.mainClient.blockchainTransaction_get(txid, verbose);
            if (typeof tx === 'string' && verbose) {
              tx = txhexToElectrumTransaction(tx);
            }
            results.push({ result: tx, param: txid });
          } catch (_) {}
        }
      }
    } else {
      results = await ElectrumState.mainClient.blockchainTransaction_getBatch(chunk, verbose);
    }

    for (const txdata of results) {
      if (txdata.error && txdata.error.code === -32600) {
        txdata.result = await ElectrumState.mainClient.blockchainTransaction_get(txdata.param, false);

        txdata.result = txhexToElectrumTransaction(txdata.result);
      }
      ret[txdata.param] = txdata.result;
      if (ret[txdata.param]) delete ret[txdata.param].hex;
    }
  }

  return ret;
};

module.exports.serverFeatures = async function () {
  if (!ElectrumState.mainClient) throw new Error('Electrum client is not connected');
  return ElectrumState.mainClient.server_features();
};

module.exports.broadcast = async function (hex) {
  if (!ElectrumState.mainClient) throw new Error('Electrum client is not connected');
  try {
    const broadcast = await ElectrumState.mainClient.blockchainTransaction_broadcast(hex);
    return broadcast;
  } catch (error) {
    return error;
  }
};

module.exports.broadcastV2 = async function (hex) {
  if (!ElectrumState.mainClient) throw new Error('Electrum client is not connected');
  return ElectrumState.mainClient.blockchainTransaction_broadcast(hex);
};

module.exports.estimateCurrentBlockheight = function () {
  if (ElectrumState.latestBlockHeight) {
    const timeDiff = Math.floor(+new Date() / 1000) - ElectrumState.latestBlockHeightTimestamp;
    const extraBlocks = Math.floor(timeDiff / (9.93 * 60));
    return ElectrumState.latestBlockHeight + extraBlocks;
  }

  const baseTs = 1587570465609;
  const baseHeight = 627179;
  return Math.floor(baseHeight + (+new Date() - baseTs) / 1000 / 60 / 9.93);
};

module.exports.calculateBlockTime = function (height) {
  if (ElectrumState.latestBlockHeight) {
    return Math.floor(ElectrumState.latestBlockHeightTimestamp + (height - ElectrumState.latestBlockHeight) * 9.93 * 60);
  }

  const baseTs = 1585837504;
  const baseHeight = 624083;
  return Math.floor(baseTs + (height - baseHeight) * 9.93 * 60);
};

module.exports.testConnection = async function (host, tcpPort, sslPort) {
  const client = new ElectrumClient(net, tls, sslPort || tcpPort, host, sslPort ? 'tls' : 'tcp');

  client.onError = () => {};
  let timeoutId = false;
  try {
    const rez = await Promise.race([
      new Promise(resolve => {
        timeoutId = setTimeout(() => resolve('timeout'), 5000);
      }),
      client.connect(),
    ]);
    if (rez === 'timeout') return false;

    await client.server_version('2.7.11', '1.4');
    await client.server_ping();
    return true;
  } catch (_) {
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    client.close();
  }

  return false;
};

function txhexToElectrumTransaction(txhex) {
  const tx = bitcoin.Transaction.fromHex(txhex);

  const ret = {
    txid: tx.getId(),
    hash: tx.getId(),
    version: tx.version,
    size: Math.ceil(txhex.length / 2),
    vsize: tx.virtualSize(),
    weight: tx.weight(),
    locktime: tx.locktime,
    vin: [],
    vout: [],
    hex: txhex,
    blockhash: '',
    confirmations: 0,
    time: 0,
    blocktime: 0,
  };

  if (ElectrumState.txhashHeightCache[ret.txid]) {
    ret.confirmations = module.exports.estimateCurrentBlockheight() - ElectrumState.txhashHeightCache[ret.txid];
    if (ret.confirmations < 0) {
      ret.confirmations = 1;
    }
    ret.time = module.exports.calculateBlockTime(ElectrumState.txhashHeightCache[ret.txid]);
    ret.blocktime = module.exports.calculateBlockTime(ElectrumState.txhashHeightCache[ret.txid]);
  }

  for (const inn of tx.ins) {
    const txinwitness = [];
    if (inn.witness[0]) txinwitness.push(inn.witness[0].toString('hex'));
    if (inn.witness[1]) txinwitness.push(inn.witness[1].toString('hex'));

    ret.vin.push({
      txid: reverse(inn.hash).toString('hex'),
      vout: inn.index,
      scriptSig: { hex: inn.script.toString('hex'), asm: '' },
      txinwitness,
      sequence: inn.sequence,
    });
  }

  let n = 0;
  for (const out of tx.outs) {
    const value = out.value;
    let address = false;
    let type = false;

    if (SegwitBech32_scriptPubKeyToAddress(out.script.toString('hex'))) {
      address = SegwitBech32_scriptPubKeyToAddress(out.script.toString('hex'));
      type = 'witness_v0_keyhash';
    } else if (SegwitP2SH_scriptPubKeyToAddress(out.script.toString('hex'))) {
      address = SegwitP2SH_scriptPubKeyToAddress(out.script.toString('hex'));
      type = '???';
    } else if (Legacy_scriptPubKeyToAddress(out.script.toString('hex'))) {
      address = Legacy_scriptPubKeyToAddress(out.script.toString('hex'));
      type = '???';
    }

    ret.vout.push({
      value,
      n,
      scriptPubKey: {
        asm: '',
        hex: out.script.toString('hex'),
        reqSigs: 1,
        type,
        addresses: [address],
      },
    });
    n++;
  }
  return ret;
}
