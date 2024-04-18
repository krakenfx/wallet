/* eslint @typescript-eslint/no-unused-vars: 0 */
import { IsomorphicProvider } from '@pokt-foundation/pocketjs-isomorphic-provider'
import { CoinDenom, MsgProtoSend, TxEncoderFactory, TxSignature } from '@pokt-foundation/pocketjs-transaction-builder';
import * as ed25519 from 'ed25519-hd-key';
import crypto from 'crypto';

import { Buffer } from 'buffer';
import nacl from 'tweetnacl';

import { RealmToken } from '@/realm/tokens';

import { BaseFeeOption, Transaction } from '@/api/types';
import { WalletStorage } from './walletState';

import { StringNumber } from '../../../entities';

import {
  BlockExplorer,
  ExtendedPublicKeyAndChainCode,
  NativeTokenSymbol,
  Network,
  NetworkIcon,
  PreparedTransaction,
  TotalFee,
  Transport,
  WalletData,
  WalletDataWithSeed,
  AnyWalletKind,
  BalanceResponse,
  FeeOptions,
  NotSupportedError,
} from './base';

import { ChainAgnostic } from './utils/ChainAgnostic';

import loc from '/loc';
import { POCKET_RPC_ENDPOINT } from '/config';

const POKT_BIP44_COINTYPE = 635;

const TX_TYPE_SEND = 'pos/Send';

type SendRequest = {
  amount: bigint;
  to: string;
  messageType: typeof TX_TYPE_SEND;
};

type RawTxRequestBase = {
  address: string;
  rawHexBytes: string;
};

type RawTxRequest = RawTxRequestBase & {
  toJSON: () => { address: string; raw_hex_bytes: string };
};

type PocketTransaction = {
  fee: BaseFeeOption;
  msg: MsgProtoSend;
};

// function hexStringToByteArray(str: string): Uint8Array {
//   const bytes: number[] = [];
//   for (let i = 0; i < str.length; i += 2) {
//     bytes.push(parseInt(str.substr(i, 2), 16));
//   }

//   return new Uint8Array(bytes);
// }

async function getAddressFromPublicKey(publicKey: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest(
    {
      name: 'SHA-256',
    },
    publicKey,
  );

  return Buffer.from(new Uint8Array(hash)).toString('hex').slice(0, 40);
}

export class PocketNetwork implements Network<PocketTransaction> {
  label = loc.network.pocket;
  caipId: string = ChainAgnostic.NETWORK_POCKET;
  nativeTokenCaipId: string = ChainAgnostic.COIN_POCKET;
  nativeTokenDecimals: number = 6;
  nativeTokenSymbol: NativeTokenSymbol = 'POKT';
  paymentUriPrefix = 'pokt';
  blockExplorer: BlockExplorer = {
    transactionUri(txId: string) {
      return `https://poktscan.com/tx/${txId}`;
    },
  };
  icon: NetworkIcon = ({ opacity }) => ({
    id: 'pokt',
    fgColor: '#2d7df7',
    bgColor: `rgba(51, 86, 234, ${opacity})`,
  });

  async createPaymentTransaction(data: WalletData, to: string, amount: StringNumber): Promise<SendRequest> {
    return {
      to,
      amount: BigInt(amount),

      // explicit type for tx
      messageType: TX_TYPE_SEND,
    };
  }

  createTokenTransferTransaction(data: WalletData, to: string, token: RealmToken, amount: StringNumber): Promise<unknown> {
    throw new Error('not supported');
  }

  getPrivateKey(data: WalletDataWithSeed) {
    const { key } = ed25519.derivePath(this.getDerivationPath(data.accountIdx) + "/0'", Buffer.from(data.seed.data).toString('hex'));

    return key;
  }

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx: number): ExtendedPublicKeyAndChainCode {
    const { key } = ed25519.derivePath(this.getDerivationPath(accountIdx) + "/0'", Buffer.from(seed).toString('hex'));

    const publicKey = ed25519.getPublicKey(key);

    // @todo: Do we need to remove zero bytes (left padding)?

    return {
      extendedPublicKey: publicKey,
    };
  }

  async deriveAddress(data: WalletData): Promise<string> {
    return getAddressFromPublicKey(data.extendedPublicKey);
  }

  async deriveAllAddresses(data: WalletDataWithSeed): Promise<string[]> {
    return [await this.deriveAddress(data)];
  }

  getDerivationPath(accountIdx?: number): string {
    return `m/44'/${POKT_BIP44_COINTYPE}'/${accountIdx ?? 0}'`;
  }

  isAddressValid(address: string): boolean {
    // simple validation of 40 hex characters
    return /^[0-9a-f]{40}$/.test(address);
  }

  async signTransaction(data: WalletDataWithSeed, tx: PocketTransaction): Promise<string> {
    const { msg, fee } = tx;

    const privateKey = await this.getPrivateKey(data);

    const publicKey = ed25519.getPublicKey(privateKey);

    const entropy = Number(BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString()).toString();

    const encoder = TxEncoderFactory.createEncoder(entropy, 'mainnet', msg, fee.amount || '10000', CoinDenom.Upokt, 'Kraken Wallet');

    const bytesToSign = encoder.marshalStdSignDoc();

    const signatureBytes = nacl.sign.detached(bytesToSign, privateKey);

    const marshalledTx = new TxSignature(publicKey, Buffer.from(signatureBytes));

    const rawHexBytes = encoder.marshalStdTx(marshalledTx).toString('hex');

    return JSON.stringify({
      address: await getAddressFromPublicKey(publicKey),
      rawHexBytes,
    } as RawTxRequestBase);
  }
}

export class PocketTransport implements Transport<PocketTransaction, SendRequest, unknown, PocketNetwork> {
  rpcProvider: IsomorphicProvider;

  constructor() {
    this.rpcProvider = new IsomorphicProvider({
      rpcUrl: POCKET_RPC_ENDPOINT,
    });
  }

  estimateTransactionCost(_network: PocketNetwork, _wallet: WalletData, _tx: PreparedTransaction<PocketTransaction>, _fee: unknown): Promise<TotalFee> {
    throw new NotSupportedError();
  }

  estimateDefaultTransactionCost(_network: PocketNetwork, _wallet: WalletData, _store: WalletStorage<unknown>, _fee: unknown): Promise<TotalFee> {
    throw new NotSupportedError();
  }

  async prepareTransaction(
    network: PocketNetwork,
    walletData: WalletData,
    _store: WalletStorage<unknown>,
    request: SendRequest,
    fee: BaseFeeOption,
  ): Promise<PreparedTransaction<PocketTransaction>> {
    const signerAddress = await network.deriveAddress(walletData);

    return {
      data: {
        msg: new MsgProtoSend(signerAddress, request.to, request.amount.toString()),
        fee,
      },
    };
  }

  async broadcastTransaction(_network: PocketNetwork, signedTx: string): Promise<string> {
    // workaround so we don't modify the Transport types
    // @todo: should we just modify the Transport interface, so we can override signedTx type?
    const txdata: RawTxRequestBase = JSON.parse(signedTx);

    const rawTxRequest: RawTxRequest = {
      address: txdata.address,
      rawHexBytes: txdata.rawHexBytes,
      toJSON: () => {
        return {
          address: txdata.address,
          raw_hex_bytes: txdata.rawHexBytes,
        };
      },
    };

    const r = await this.rpcProvider.sendTransaction(rawTxRequest);

    return r.txHash;
  }

  async getTransactionStatus(network: PocketNetwork, txid: string): Promise<boolean> {
    const tx = await this.rpcProvider.getTransaction(txid);

    return tx.tx_result.code === 0;
  }

  async getFeesEstimate(_network: PocketNetwork): Promise<FeeOptions> {
    return {
      options: [
        {
          kind: 'default',
          amount: '10000',
          token: 'POKT',
        },
      ],
    };
  }

  async fetchBalance(network: PocketNetwork, wallet: AnyWalletKind): Promise<BalanceResponse[]> {
    let address;

    if ('address' in wallet) {
      address = wallet.address;
    } else {
      address = await network.deriveAddress(wallet);
    }

    const balance = await this.rpcProvider.getBalance(address);

    return [
      {
        balance: {
          token: network.nativeTokenCaipId,
          value: balance.toString(),
        },
        metadata: {
          symbol: network.nativeTokenSymbol,
          label: network.label,
          decimals: network.nativeTokenDecimals,
        },
      },
    ];
  }

  async fetchTransactions(network: PocketNetwork, wallet: AnyWalletKind, _store: WalletStorage<unknown>, handle: (txs: Transaction[]) => Promise<boolean>) {
    let address;

    if ('address' in wallet) {
      address = wallet.address;
    } else {
      address = await network.deriveAddress(wallet);
    }

    let page = 1;

    console.log(`[fetchTransactions] ${network.caipId}`);

    while (true) {
      console.log(`[fetchTransactions]  ${network.caipId} fetching from server, with page`, page);

      const accountWithTxs = await this.rpcProvider.getAccountWithTransactions(address, {
        page,
      });

      const { transactions } = accountWithTxs;

      if (transactions.length === 0) {
        console.log(`[fetchTransactions] ${network.caipId} stopping at empty`);
        break;
      }

      console.log(`[fetchTransactions] ${network.caipId} got results count`, transactions.length);

      // we only filter pos/Send txs
      const mapped: Transaction[] = transactions.filter(tx => tx.stdTx.msg.type === TX_TYPE_SEND).map((tx) => ({
        fee: {
            amount: tx.stdTx.fee.amount as string,
            token: 'POKT',
        },
        kind: 'sent', // or affected?
        status: tx.tx_result.code === 0 ? 'succeeded' : 'failed',
        id: tx.hash as string,

        // @todo: Send/Receive effects based on tx.stdTx.msg.to_address
        effects: [],

        // @todo: do we need to map tx height to block time here?
        timestamp: Date.now(),
      }));

      if (await handle(mapped)) {
        console.log(`[fetchTransactions] ${network.caipId} stopping at known tx`);
        break;
      }

      page++;
    }
  }
}

export class Poktscan implements BlockExplorer {
  transactionUri(txId: string): string {
    return `https://poktscan.com/tx/${txId}`;
  }
}

export const pocketNetwork = new PocketNetwork();
export const pocketTransport = new PocketTransport();
