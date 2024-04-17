import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import * as bitcoin from 'bitcoinjs-lib';
import EventEmitter from 'eventemitter3';
import { reverse } from 'lodash';
import DefaultPreference from 'react-native-default-preference';

import { Utxo } from './BlueElectrum';

const ElectrumClient = require('electrum-client');

export const electrumConnectionEmitter = new EventEmitter();

export enum ConnectionEmitter {
  disconnected = 'disconnected',
  connected = 'connected',
}

export const emitElectrumDisconnected = () => {
  electrumConnectionEmitter.emit(ConnectionEmitter.disconnected);
};

export const emitElectrumConnected = () => {
  electrumConnectionEmitter.emit(ConnectionEmitter.connected);
};

export const ElectrumState: {
  mainConnected: boolean;
  serverName: string;
  connectionAttempt: number;
  wasConnectedAtLeastOnce: boolean;
  mainClient: any;
  disableBatching: boolean;
  txhashHeightCache: { [txid: string]: number };
  latestBlockHeight: number | undefined;
  latestBlockHeightTimestamp: number | undefined;
} = {
  mainConnected: false,
  serverName: '',
  connectionAttempt: 0,
  wasConnectedAtLeastOnce: false,
  mainClient: null,
  disableBatching: false,
  txhashHeightCache: {},
  latestBlockHeight: undefined,
  latestBlockHeightTimestamp: undefined,
};

const ELECTRUM_HOST = 'electrum_host';
const ELECTRUM_TCP_PORT = 'electrum_tcp_port';
const ELECTRUM_SSL_PORT = 'electrum_ssl_port';
const ELECTRUM_CONNECTION_DISABLED = 'electrum_disabled';

type Peer = {
  host: string;
  ssl?: string;
  tcp?: string;
};
const hardcodedPeers: Peer[] = [{ host: 'electrum.wallet.kraken.com', ssl: '443' }];

async function getRandomHardcodedPeer() {
  return hardcodedPeers[(hardcodedPeers.length * Math.random()) | 0];
}

async function isDisabled() {
  let isDisabled;
  try {
    const savedValue = await AsyncStorage.getItem(ELECTRUM_CONNECTION_DISABLED);
    if (savedValue === null) {
      isDisabled = false;
    } else {
      isDisabled = savedValue;
    }
  } catch {
    isDisabled = false;
  }
  return !!isDisabled;
}

async function getSavedPeer(): Promise<Peer | undefined> {
  const host = await AsyncStorage.getItem(ELECTRUM_HOST);
  const port = await AsyncStorage.getItem(ELECTRUM_TCP_PORT);
  const sslPort = await AsyncStorage.getItem(ELECTRUM_SSL_PORT);
  if (!host) {
    return undefined;
  }
  if (port) {
    return { host, tcp: port };
  } else if (sslPort) {
    return { host, ssl: sslPort };
  } else {
    return undefined;
  }
}

export async function forceDisconnect() {
  ElectrumState?.mainClient?.close();
}

export async function connectMain() {
  if (await isDisabled()) {
    console.log('Electrum connection disabled by user. Skipping connectMain call');
    return;
  }
  let usingPeer = await getRandomHardcodedPeer();
  const savedPeer = await getSavedPeer();
  if (savedPeer) {
    usingPeer = savedPeer;
  }

  await DefaultPreference.setName('group.io.bluewallet.bluewallet');
  try {
    let peerToSave;
    if (usingPeer.host.endsWith('onion')) {
      peerToSave = await getRandomHardcodedPeer();
    } else {
      peerToSave = usingPeer;
    }
    await DefaultPreference.set(ELECTRUM_HOST, peerToSave.host);
    await DefaultPreference.set(ELECTRUM_TCP_PORT, peerToSave.tcp ?? '');
    await DefaultPreference.set(ELECTRUM_SSL_PORT, peerToSave.ssl ?? '');
  } catch (e) {
    console.log(e);
  }

  try {
    console.log('begin connection:', JSON.stringify(usingPeer));
    const globalAny = global as any;
    ElectrumState.mainClient = new ElectrumClient(
      globalAny.net,
      globalAny.tls,
      usingPeer.ssl || usingPeer.tcp,
      usingPeer.host,
      'ssl' in usingPeer ? 'tls' : 'tcp',
    );

    ElectrumState.mainClient.onError = function (e: any) {
      console.log('electrum mainClient.onError():', e.message);
      if (ElectrumState.mainConnected) {
        ElectrumState.mainClient.close();
        ElectrumState.mainConnected = false;

        console.log('reconnecting after socket error');
        setTimeout(connectMain, usingPeer.host.endsWith('.onion') ? 4000 : 500);
      }
    };
    const ver = await ElectrumState.mainClient.initElectrum({ client: 'bluewallet', version: '1.4' });
    if (ver && ver[0]) {
      console.log('connected to ', ver);
      ElectrumState.serverName = ver[0];
      emitElectrumConnected();
      ElectrumState.mainConnected = true;
      ElectrumState.wasConnectedAtLeastOnce = true;
      if (ver[0].startsWith('ElectrumPersonalServer') || ver[0].startsWith('electrs') || ver[0].startsWith('Fulcrum')) {
        ElectrumState.disableBatching = true;
      }
      const header = await ElectrumState.mainClient.blockchainHeaders_subscribe();
      if (header && header.height) {
        ElectrumState.latestBlockHeight = header.height;
        ElectrumState.latestBlockHeightTimestamp = Math.floor(+new Date() / 1000);
      }
    }
  } catch (e) {
    ElectrumState.mainConnected = false;
    console.log('bad connection:', JSON.stringify(usingPeer), e);
  }

  if (!ElectrumState.mainConnected) {
    console.log('retry');
    ElectrumState.connectionAttempt = ElectrumState.connectionAttempt + 1;
    ElectrumState.mainClient.close && ElectrumState.mainClient.close();
    if (ElectrumState.connectionAttempt >= 5) {
      emitElectrumDisconnected();
    } else {
      console.log('reconnection attempt #', ElectrumState.connectionAttempt);
      setTimeout(connectMain, 500);
    }
  }
}

type FeeHistogram = [number, number][];

export const estimateFees = async function (fastBlocks: number, mediumBlocks: number, slowBlocks: number) {
  let histogram: FeeHistogram | undefined;
  try {
    histogram = await Promise.race([ElectrumState.mainClient.mempool_getFeeHistogram(), new Promise(resolve => setTimeout(resolve, 29000))]);
  } catch (_) {}

  if (!histogram) {
    throw new Error('timeout while getting mempool_getFeeHistogram');
  }

  const _fast = await estimateFee(fastBlocks);
  const _medium = await estimateFee(mediumBlocks);
  const _slow = await estimateFee(slowBlocks);

  const fast = calcEstimateFeeFromFeeHistogram(1, histogram);

  const medium = Math.max(1, Math.round((fast * _medium) / _fast));
  const slow = Math.max(1, Math.round((fast * _slow) / _fast));
  return { fast, medium, slow };
};

const estimateFee = async function (numberOfBlocks: number) {
  if (!ElectrumState.mainClient) {
    throw new Error('Electrum client is not connected');
  }
  numberOfBlocks = numberOfBlocks || 1;
  const coinUnitsPerKilobyte = await ElectrumState.mainClient.blockchainEstimatefee(numberOfBlocks);
  if (coinUnitsPerKilobyte === -1) {
    return 1;
  }
  return Math.round(new BigNumber(coinUnitsPerKilobyte).dividedBy(1024).multipliedBy(100000000).toNumber());
};

export const calcEstimateFeeFromFeeHistogram = function (numberOfBlocks: number, feeHistogram: FeeHistogram) {
  let totalVsize = 0;
  const histogramToUse = [];
  for (const h of feeHistogram) {
    let [fee, vsize] = h;
    let timeToStop = false;

    if (totalVsize + vsize >= 1000000 * numberOfBlocks) {
      vsize = 1000000 * numberOfBlocks - totalVsize;
      timeToStop = true;
    }

    histogramToUse.push({ fee, vsize });
    totalVsize += vsize;
    if (timeToStop) {
      break;
    }
  }

  let histogramFlat: number[] = [];
  for (const hh of histogramToUse) {
    histogramFlat = histogramFlat.concat(Array(Math.round(hh.vsize / 25000)).fill(hh.fee));
  }

  histogramFlat = histogramFlat.sort(function (a, b) {
    return a - b;
  });

  return Math.round(percentile(histogramFlat, 0.5) || 1);
};

function percentile(arr: number[], p: number) {
  if (arr.length === 0) {
    return 0;
  }
  if (p <= 0) {
    return arr[0];
  }
  if (p >= 1) {
    return arr[arr.length - 1];
  }

  const index = (arr.length - 1) * p;
  const lower = Math.floor(index);
  const upper = lower + 1;
  const weight = index % 1;

  if (upper >= arr.length) {
    return arr[lower];
  }
  return arr[lower] * (1 - weight) + arr[upper] * weight;
}

export const splitIntoChunks = function <T>(arr: T[], chunkSize: number): T[][] {
  const groups = [];
  let i;
  for (i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }
  return groups;
};

export async function multiGetUtxoByAddress(addresses: string[], batchsize?: number) {
  batchsize = batchsize || 100;
  if (!ElectrumState.mainClient) {
    throw new Error('Electrum client is not connected');
  }

  const ret: { [key: string]: Utxo[] } = {};
  const chunks = splitIntoChunks(addresses, batchsize);
  for (const chunk of chunks) {
    const scripthashes: string[] = [];
    const scripthash2addr: { [key: string]: string } = {};
    for (const addr of chunk) {
      const script = bitcoin.address.toOutputScript(addr);
      const reversedHash = Buffer.from(reverse(bitcoin.crypto.sha256(script))).toString('hex');

      scripthashes.push(reversedHash);
      scripthash2addr[reversedHash] = addr;
    }

    let result: {
      param: string;
      result: {
        tx_hash: string;
        tx_pos: number;
        height: number;
        value: number;
      }[];
    }[];
    if (ElectrumState.disableBatching) {
      throw new Error('not supported w/o batching');
    } else {
      result = await ElectrumState.mainClient.blockchainScripthash_listunspentBatch(scripthashes);
    }

    for (const utxos of result) {
      ret[scripthash2addr[utxos.param]] = [];
      for (const utxo of utxos.result) {
        ret[scripthash2addr[utxos.param]].push({
          address: scripthash2addr[utxos.param],
          txId: utxo.tx_hash,
          vout: utxo.tx_pos,
          height: utxo.height,
          value: utxo.value,
        });
      }
    }
  }

  return ret;
}

export const multiGetBalanceByAddress = async function (addresses: string[], batchsize?: number) {
  batchsize = batchsize || 200;
  if (!ElectrumState.mainClient) {
    throw new Error('Electrum client is not connected');
  }
  const ret: {
    balance: number;
    unconfirmed_balance: number;
    addresses: {
      [key: string]: {
        confirmed: string;
        unconfirmed: string;
      };
    };
  } = { balance: 0, unconfirmed_balance: 0, addresses: {} };

  const chunks = splitIntoChunks(addresses, batchsize);
  for (const chunk of chunks) {
    const scripthashes: string[] = [];
    const scripthash2addr: { [key: string]: string } = {};
    for (const addr of chunk) {
      const script = bitcoin.address.toOutputScript(addr);
      const hash = bitcoin.crypto.sha256(script);
      let reversedHash = Buffer.from(reverse(hash));
      let reversedHashStr = reversedHash.toString('hex');
      scripthashes.push(reversedHashStr);
      scripthash2addr[reversedHashStr] = addr;
    }

    let balances: {
      param: string;
      error?: {
        code: number;
        message: string;
      };
      result: {
        confirmed: string;
        unconfirmed: string;
      };
    }[] = [];

    if (ElectrumState.disableBatching) {
      const promises = [];
      const index2scripthash: { [key: number]: string } = {};
      for (let promiseIndex = 0; promiseIndex < scripthashes.length; promiseIndex++) {
        promises.push(ElectrumState.mainClient.blockchainScripthash_getBalance(scripthashes[promiseIndex]));
        index2scripthash[promiseIndex] = scripthashes[promiseIndex];
      }
      const promiseResults = await Promise.all(promises);
      for (let resultIndex = 0; resultIndex < promiseResults.length; resultIndex++) {
        balances.push({ result: promiseResults[resultIndex], param: index2scripthash[resultIndex].toString() });
      }
    } else {
      balances = await ElectrumState.mainClient.blockchainScripthash_getBalanceBatch(scripthashes);
    }

    for (const bal of balances) {
      if (bal.error) {
        console.warn('multiGetBalanceByAddress():', bal.error?.message);
        continue;
      }
      ret.balance += +bal.result.confirmed;
      ret.unconfirmed_balance += +bal.result.unconfirmed;
      ret.addresses[scripthash2addr[bal.param]] = bal.result;
    }
  }

  return ret;
};

export type HistoryItem = {
  tx_hash: string;
  height: number;
  address: string;
};

export const multiGetHistoryByAddress = async function (addresses: string[], batchsize?: number): Promise<Record<string, HistoryItem[]>> {
  batchsize = batchsize || 100;
  if (!ElectrumState.mainClient) {
    throw new Error('Electrum client is not connected');
  }
  const ret: { [addr: string]: HistoryItem[] } = {};

  const chunks = splitIntoChunks(addresses, batchsize);
  for (const chunk of chunks) {
    const scripthashes = [];
    const scripthash2addr: { [key: string]: string } = {};
    for (const addr of chunk) {
      const script = bitcoin.address.toOutputScript(addr);
      const hash = bitcoin.crypto.sha256(script);
      let reversedHash = Buffer.from(reverse(hash));
      let reversedHashStr = reversedHash.toString('hex');
      scripthashes.push(reversedHashStr);
      scripthash2addr[reversedHashStr] = addr;
    }

    let results: {
      error?: unknown;
      param: string;
      result: {
        tx_hash: string;
        height: number;
      }[];
    }[] = [];

    if (ElectrumState.disableBatching) {
      const promises: Promise<
        {
          tx_hash: string;
          height: number;
        }[]
      >[] = [];
      const index2scripthash: { [key: number]: string } = {};
      for (let promiseIndex = 0; promiseIndex < scripthashes.length; promiseIndex++) {
        index2scripthash[promiseIndex] = scripthashes[promiseIndex];
        promises.push(ElectrumState.mainClient.blockchainScripthash_getHistory(scripthashes[promiseIndex]));
      }
      const histories = await Promise.all(promises);
      for (let historyIndex = 0; historyIndex < histories.length; historyIndex++) {
        results.push({ result: histories[historyIndex], param: index2scripthash[historyIndex] });
      }
    } else {
      results = await ElectrumState.mainClient.blockchainScripthash_getHistoryBatch(scripthashes);
    }

    for (const history of results) {
      if (history.error) {
        console.warn('multiGetHistoryByAddress():', history.error);
        continue;
      }

      for (const result of history.result || []) {
        if (result.tx_hash) {
          ElectrumState.txhashHeightCache[result.tx_hash] = result.height;
        }
      }

      ret[scripthash2addr[history.param]] = history.result.map(item => ({
        ...item,
        address: scripthash2addr[history.param],
      }));
    }
  }

  return ret;
};

export const waitTillConnected = async function () {
  let waitTillConnectedInterval: NodeJS.Timer;
  let retriesCounter = 0;
  return new Promise(function (resolve, reject) {
    waitTillConnectedInterval = setInterval(() => {
      if (ElectrumState.mainConnected) {
        clearInterval(waitTillConnectedInterval);
        return resolve(true);
      }

      if (ElectrumState.wasConnectedAtLeastOnce && ElectrumState.mainClient.status === 1) {
        clearInterval(waitTillConnectedInterval);
        ElectrumState.mainConnected = true;
        emitElectrumConnected();
        return resolve(true);
      }

      if (ElectrumState.wasConnectedAtLeastOnce && retriesCounter++ >= 30) {
        clearInterval(waitTillConnectedInterval);
        emitElectrumDisconnected();
        reject(new Error('Waiting for Electrum connection timeout'));
      }
    }, 100);
  });
};

export function resetElectrumMainClient() {
  ElectrumState.connectionAttempt = 0;
  ElectrumState?.mainClient?.close();
  setTimeout(connectMain, 500);
}
