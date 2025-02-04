/* eslint-disable radix */

import { secp256k1 } from '@noble/curves/secp256k1';
import { ripemd160 } from '@noble/hashes/ripemd160';
import BigNumber from 'bignumber.js';

import BIP32Factory from 'bip32';
import bs58check from 'bs58check';

import { Buffer } from 'buffer';
import crypto from 'crypto';

import { getHarmony } from '@/api/base/apiFactory';
import type { BaseFeeOption, FeeOption } from '@/api/types';
import type { RealmToken } from '@/realm/tokens';

import { HarmonyTransport } from './HarmonyTransport';
import { ChainAgnostic } from './utils/ChainAgnostic';
import CompactSize from './utils/CompactSize';
import { nobleAdapter } from './utils/nobleToTinySecpInterface.ts';

import type {
  BlockExplorer,
  ExtendedPublicKeyAndChainCode,
  NativeTokenSymbol,
  Network,
  NetworkIcon,
  PreparedTransaction,
  TotalFee,
  WalletData,
  WalletDataWithSeed,
} from './base';
import type { WalletStorage } from './walletState';
import type { BIP32Interface } from 'bip32';

import loc from '/loc';

const bip32 = BIP32Factory(nobleAdapter);

type SendRequest = {
  amount: bigint;
  to: string;
};

type UTXOIn = {
  previousOutput: {
    hash: string;
    index: number;
  };
  sequence: number;
  script: Buffer;

  signature?: Buffer;
  signatureSize?: Buffer;
};

type DogecoinTransaction = {
  version: 1;
  txIns: UTXOIn[];
  txOuts: {
    value: bigint;
    pkScript: Buffer;
    pkScriptSize: number;
  }[];
  locktime: 0;
};

function newTx(): DogecoinTransaction {
  return {
    version: 1,
    txIns: [],
    txOuts: [],
    locktime: 0,
  };
}

const NETWORK_BYTE = '1e';
const WALLET = {
  wif: 0x9e,
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398,
  },
};

export class DogecoinNetwork implements Network {
  label = loc.network.dogecoin;
  caipId: string = ChainAgnostic.NETWORK_DOGECOIN;
  nativeTokenCaipId: string = ChainAgnostic.COIN_DOGECOIN;
  nativeTokenDecimals: number = 8;
  nativeTokenSymbol: NativeTokenSymbol = 'DOGE';
  paymentUriPrefix = 'dogecoin';
  blockExplorer: BlockExplorer = {
    transactionUri(txId: string) {
      return `https://dogechain.info/tx/${txId}`;
    },
  };
  icon: NetworkIcon = ({ opacity }) => ({
    id: 'doge',
    fgColor: '#face5e',
    bgColor: `rgba(221, 172, 0, ${opacity})`,
  });

  async createPaymentTransaction(data: WalletData, to: string, amount: StringNumber): Promise<SendRequest> {
    return {
      to,
      amount: BigInt(amount),
    };
  }

  createTokenTransferTransaction(_data: WalletData, _to: string, _token: RealmToken, _amount: StringNumber): Promise<SendRequest> {
    throw new Error('not supported');
  }

  async deriveAddress(wallet: WalletData): Promise<string> {
    return this._getAddressByIndexAndChange(wallet, 0, false);
  }

  async deriveAllAddresses(wallet: WalletData): Promise<string[]> {
    return [await this.deriveAddress(wallet)];
  }

  getDerivationPath(accountIdx?: number): string {
    return `m/44'/3'/${accountIdx ?? 0}'`;
  }

  isAddressValid(address: string): boolean {
    try {
      const decoded = bs58check.decode(address);
      const versionByte = decoded[0];

      if (versionByte === 0x1e || versionByte === 0x16) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  private async getPrivateKey(wallet: WalletDataWithSeed, index: number, change: number) {
    const path = this.getDerivationPath(wallet.accountIdx) + '/' + change + '/' + index;
    const root = bip32.fromSeed(Buffer.from(wallet.seed.data), WALLET);
    return root.derivePath(path);
  }

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx?: number): ExtendedPublicKeyAndChainCode {
    const path = this.getDerivationPath(accountIdx);
    const root = bip32.fromSeed(Buffer.from(seed), WALLET);
    const bip32Interface = root.derivePath(path);
    return {
      extendedPublicKey: bip32Interface.publicKey,
      chainCode: bip32Interface.chainCode,
    };
  }

  async signTransaction(data: WalletDataWithSeed, transaction: DogecoinTransaction): Promise<string> {
    const key = await this.getPrivateKey(data, 0, 0);
    for (const txInIndex in transaction.txIns) {
      const { signature, publicKey } = await signTransaction(transaction, key, parseInt(txInIndex), 1);
      transaction = addP2KHSignature(transaction, signature, publicKey, parseInt(txInIndex));
    }
    return serializeTransaction(transaction).toString('hex');
  }

  private _getAddressByIndexAndChange(wallet: WalletData, index: number, isChangeAddress = false) {
    const path = (isChangeAddress ? '1' : '0') + '/' + index;

    const root = deriveRoot(wallet);
    const child = root.derivePath(path);
    return pubkeyToAddress(child.publicKey, NETWORK_BYTE);
  }
}

export function deriveRoot(wallet: WalletData) {
  const publicKey = Buffer.from(wallet.extendedPublicKey);
  if (wallet.chainCode) {
    const chainCode = Buffer.from(wallet.chainCode);
    return bip32.fromPublicKey(publicKey, chainCode);
  }
  throw new Error('[dogecoin] missing chainCode in wallet data');
}

export function serializePayToPubkeyHashScript(address: string): Buffer {
  const decoded = bs58check.decode(address);
  const versionByte = decoded[0];
  const pubkeyHash = decoded.slice(1);

  if (versionByte === 0x1e) {
    return Buffer.from('76a914' + pubkeyHash.toString('hex') + '88ac', 'hex');
  }
  if (versionByte === 0x16) {
    return Buffer.from('a914' + pubkeyHash.toString('hex') + '87', 'hex');
  }
  throw new Error(`Unsupported address type: ${versionByte.toString(16)}`);
}

function pubkeyToAddress(pubkey: Buffer, networkByte: any) {
  const hash = crypto.createHash('sha256').update(pubkey).digest();
  const pubKeyHash = ripemd160.create().update(hash).digest();
  networkByte = Buffer.from(networkByte, 'hex');

  return bs58check.encode(Buffer.concat([networkByte, pubKeyHash]));
}

export class DogecoinTransport extends HarmonyTransport<unknown, unknown, unknown> {
  async prepareTransaction(
    network: DogecoinNetwork,
    walletData: WalletData,
    store: WalletStorage<unknown>,
    tx: SendRequest,
    fee: BaseFeeOption,
  ): Promise<PreparedTransaction<unknown>> {
    const singleAddress = await network.deriveAddress(walletData);

    const balances = await this.fetchBalance(network, walletData);
    const balance = BigInt(balances.find(item => item.balance.token === network.nativeTokenCaipId)?.balance?.value ?? 0);

    const transaction = newTx();

    transaction.txIns = await this.fetchUtxoFromHarmony(singleAddress, ChainAgnostic.NETWORK_DOGECOIN);

    const pkScript = serializePayToPubkeyHashScript(tx.to);

    transaction.txOuts[0] = {
      value: BigInt(tx.amount),

      pkScriptSize: pkScript.length,
      pkScript,
    };

    if (balance > tx.amount) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const pkScript = serializePayToPubkeyHashScript(singleAddress);
      const value = balance - tx.amount - BigInt(fee.amount);

      if (value > 10000) {
        transaction.txOuts[1] = {
          value: BigInt(value.toString()),

          pkScriptSize: pkScript.length,
          pkScript,
        };
      }
    }

    return {
      data: transaction,
    };
  }

  async estimateTransactionCost(network: DogecoinNetwork, _wallet: WalletData, _tx: PreparedTransaction<SendRequest>, fee: FeeOption): Promise<TotalFee> {
    if (!('amount' in fee)) {
      throw new Error('called with wrong fee type');
    }

    return {
      token: network.nativeTokenCaipId,
      amount: fee.amount,
    };
  }

  async estimateDefaultTransactionCost(network: DogecoinNetwork): Promise<TotalFee> {
    return {
      token: network.nativeTokenCaipId,
      amount: '100000',
    };
  }

  async fetchUtxoFromHarmony(address: string, network: string) {
    const harmony = await getHarmony();
    const response = await harmony.GET('/v1/utxo', {
      params: { query: { address, network } },
    });

    const ret: UTXOIn[] = [];

    for (const utxo of response.content ?? []) {
      ret.push({
        previousOutput: {
          hash: Buffer.from(utxo.transactionId, 'hex').reverse().toString('hex'),
          index: utxo.index,
        },
        sequence: 4294967294,
        script: Buffer.from(utxo.script, 'hex'),
      });
    }
    return ret;
  }
}

export const dogecoinNetwork = new DogecoinNetwork();
export const dogecoinTransport = new DogecoinTransport();

async function signTransaction(transaction: DogecoinTransaction, key: BIP32Interface, index: number, hashCodeType: number) {
  const rawUnsignedTransaction = prepareTransactionToSign(transaction, index, hashCodeType);
  const rawTransactionHash = doubleHash(rawUnsignedTransaction);

  const signature = secp256k1.sign(rawTransactionHash, key.privateKey!);
  return { signature: Buffer.from(signature.toDERRawBytes()), publicKey: key.publicKey };
}

function addP2KHSignature(transaction: DogecoinTransaction, signature: Buffer, publicKey: Buffer, index: number) {
  const signatureCompactSize = CompactSize.fromSize(signature.length + 1);
  const publicKeyCompactSize = CompactSize.fromSize(publicKey.length);

  const scriptSig = signatureCompactSize.toString('hex') + signature.toString('hex') + '01' + publicKeyCompactSize.toString('hex') + publicKey.toString('hex');

  transaction.txIns[index].signatureSize = CompactSize.fromSize(Buffer.from(scriptSig).length);
  transaction.txIns[index].signature = Buffer.from(scriptSig, 'hex');

  return transaction;
}

function serializeTransaction(transaction: DogecoinTransaction) {
  const txInCount = CompactSize.fromSize(transaction.txIns.length);
  const txOutCount = CompactSize.fromSize(transaction.txOuts.length);
  let bufferSize = 4 + txInCount.length;

  for (let txIn = 0; txIn < transaction.txIns.length; txIn++) {
    bufferSize += 32 + 4 + transaction.txIns[txIn].signatureSize!.length + transaction.txIns[txIn].signature!.length + 4;
  }

  bufferSize += txOutCount.length;

  for (let txOut = 0; txOut < transaction.txOuts.length; txOut++) {
    bufferSize += 8 + CompactSize.fromSize(transaction.txOuts[txOut].pkScriptSize).length + transaction.txOuts[txOut].pkScriptSize;
  }

  bufferSize += 4;

  let buffer = Buffer.alloc(bufferSize);
  let offset = 0;

  buffer.writeUInt32LE(transaction.version, offset);
  offset += 4;

  txInCount.copy(buffer, offset);
  offset += txInCount.length;

  for (let txInIndex = 0; txInIndex < transaction.txIns.length; txInIndex++) {
    Buffer.from(transaction.txIns[txInIndex].previousOutput.hash, 'hex').copy(buffer, offset);
    offset += 32;

    buffer.writeUInt32LE(transaction.txIns[txInIndex].previousOutput.index, offset);
    offset += 4;

    const scriptSigSize = CompactSize.fromSize(transaction.txIns[txInIndex].signature!.length);
    scriptSigSize.copy(buffer, offset);
    offset += scriptSigSize.length;

    transaction.txIns[txInIndex].signature!.copy(buffer, offset);
    offset += transaction.txIns[txInIndex].signature!.length;

    buffer.writeUInt32LE(transaction.txIns[txInIndex].sequence, offset);
    offset += 4;
  }

  txOutCount.copy(buffer, offset);

  offset += txOutCount.length;

  for (let txOutIndex = 0; txOutIndex < transaction.txOuts.length; txOutIndex++) {
    let before = buffer.toString('hex');

    let value2write = new BigNumber(transaction.txOuts[txOutIndex].value.toString()).toString(16);
    if (value2write.length % 2 !== 0) {
      value2write = '0' + value2write;
    }
    value2write = Buffer.from(value2write, 'hex').reverse().toString('hex');

    for (let cc = 0; cc < value2write.length; cc++) {
      before = setCharAt(before, cc + offset * 2, value2write[cc]);
    }

    buffer = Buffer.from(before, 'hex');

    offset += 8;

    const pkScriptSize = CompactSize.fromSize(transaction.txOuts[txOutIndex].pkScriptSize);

    pkScriptSize.copy(buffer, offset);
    offset += pkScriptSize.length;

    transaction.txOuts[txOutIndex].pkScript.copy(buffer, offset);
    offset += transaction.txOuts[txOutIndex].pkScriptSize;
  }

  buffer.writeUInt32LE(transaction.locktime, offset);
  offset += 4;

  return buffer;
}

function prepareTransactionToSign(transaction: DogecoinTransaction, vint: number, hashCodeType: number) {
  const txInCount = CompactSize.fromSize(transaction.txIns.length);
  const txOutCount = CompactSize.fromSize(transaction.txOuts.length);
  let bufSize = 4 + 1;

  bufSize += 41 * transaction.txIns.length + transaction.txIns[vint].script.length;
  bufSize += 1;
  for (const txout of transaction.txOuts) {
    bufSize += 9 + txout.pkScriptSize;
  }
  bufSize += 8;

  let buffer = Buffer.alloc(bufSize);
  let offset = 0;

  buffer.writeUInt32LE(transaction.version, offset);
  offset += 4;

  txInCount.copy(buffer, offset);
  offset += txInCount.length;

  for (let txInIndex = 0; txInIndex < transaction.txIns.length; txInIndex++) {
    Buffer.from(transaction.txIns[txInIndex].previousOutput.hash, 'hex').copy(buffer, offset);
    offset += 32;

    buffer.writeUInt32LE(transaction.txIns[txInIndex].previousOutput.index, offset);
    offset += 4;

    if (txInIndex === vint) {
      const scriptSigSize = CompactSize.fromSize(transaction.txIns[txInIndex].script.length);
      scriptSigSize.copy(buffer, offset);
      offset += scriptSigSize.length;

      transaction.txIns[txInIndex].script.copy(buffer, offset);
      offset += transaction.txIns[txInIndex].script.length;
    } else {
      const nullBuffer = Buffer.alloc(1);
      nullBuffer.copy(buffer, offset);
      offset += nullBuffer.length;
    }

    buffer.writeUInt32LE(transaction.txIns[txInIndex].sequence, offset);
    offset += 4;
  }

  txOutCount.copy(buffer, offset);
  offset += txOutCount.length;

  for (const txOutIndex in transaction.txOuts) {
    let before = buffer.toString('hex');

    let value2write = new BigNumber(transaction.txOuts[txOutIndex].value.toString()).toString(16);
    if (value2write.length % 2 !== 0) {
      value2write = '0' + value2write;
    }
    value2write = Buffer.from(value2write, 'hex').reverse().toString('hex');
    for (let cc = 0; cc < value2write.length; cc++) {
      before = setCharAt(before, cc + offset * 2, value2write[cc]);
    }

    buffer = Buffer.from(before, 'hex');

    offset += 8;

    const pkScriptSize = CompactSize.fromSize(transaction.txOuts[txOutIndex].pkScriptSize);

    pkScriptSize.copy(buffer, offset);
    offset += pkScriptSize.length;

    transaction.txOuts[txOutIndex].pkScript.copy(buffer, offset);
    offset += transaction.txOuts[txOutIndex].pkScriptSize;
  }

  buffer.writeUInt32LE(transaction.locktime, offset);
  offset += 4;

  buffer.writeUInt32LE(hashCodeType, offset);

  return buffer;
}

function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) {
    return str;
  }
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function doubleHash(data: Buffer) {
  let hash = crypto.createHash('sha256').update(data).digest();
  hash = crypto.createHash('sha256').update(hash).digest();
  return hash;
}
