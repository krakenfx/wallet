/* eslint @typescript-eslint/no-unused-vars: 0 */
import * as ed25519 from 'ed25519-hd-key';

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
} from './base';

import { ChainAgnostic } from './utils/ChainAgnostic';

import loc from '/loc';
import { POCKET_RPC_ENDPOINT } from '/config';
import { superFetch } from '@/api/base/superFetch';

import { ProtoStdSignature, ProtoStdTx } from './pocket/generated/tx-signer';
import { varintEncode } from './pocket/varintEncode';
import { MsgProtoSend } from './pocket/msg-proto-send';

import createHash = require('create-hash');

const POKT_BIP44_COINTYPE = 635;

const TX_TYPE_SEND_AMINO_KEY = 'pos/Send';

type SendRequest = {
  amount: bigint;
  to: string;
  messageType: typeof TX_TYPE_SEND_AMINO_KEY;
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

function getPocketKeyPair(derivationPath: string, seedHex: string) {
  const { key } = ed25519.derivePath(derivationPath, seedHex);

  return nacl.sign.keyPair.fromSeed(key);
}

function getPublicKeyFromPrivateKey(privateKey: Buffer): Buffer {
  const publicKey = ed25519.getPublicKey(privateKey);

  // remove left padding (1 byte)
  return Buffer.from(publicKey.subarray(1));
}

async function getAddressFromPublicKey(publicKey: Buffer): Promise<string> {
  return createHash('sha256').update(publicKey).digest().toString('hex').slice(0, 40);
}

export class Poktscan implements BlockExplorer {
  transactionUri(txId: string): string {
    return `https://poktscan.com/tx/${txId}`;
  }
}

export class PocketNetwork implements Network<PocketTransaction> {
  label = loc.network.pocket;
  caipId: string = ChainAgnostic.NETWORK_POCKET;
  nativeTokenCaipId: string = ChainAgnostic.COIN_POCKET;
  nativeTokenDecimals: number = 6;
  nativeTokenSymbol: NativeTokenSymbol = 'POKT';
  paymentUriPrefix = 'pokt';
  blockExplorer = new Poktscan();
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
      messageType: TX_TYPE_SEND_AMINO_KEY,
    };
  }

  createTokenTransferTransaction(data: WalletData, to: string, token: RealmToken, amount: StringNumber): Promise<unknown> {
    throw new Error('not supported');
  }

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx: number): ExtendedPublicKeyAndChainCode {
    const { publicKey } = getPocketKeyPair(this.getDerivationPath(accountIdx) + "/0'", Buffer.from(seed).toString('hex'));

    return {
      extendedPublicKey: publicKey,
    };
  }

  async deriveAddress(wallet: WalletData): Promise<string> {
    const publicKey = Buffer.from(wallet.extendedPublicKey);

    return getAddressFromPublicKey(publicKey);
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

    const { publicKey, secretKey } = getPocketKeyPair(this.getDerivationPath(data.accountIdx) + "/0'", Buffer.from(data.seed.data).toString('hex'));

    const entropy = Number(BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString()).toString();

    // important! we need to keep the order of the fields in the object
    const docToSign = {
      chain_id: 'mainnet',
      entropy: entropy,
      fee: [
        {
          amount: fee.amount || '10000',
          denom: 'upokt',
        },
      ],
      memo: 'Kraken Wallet',
      msg: msg.toStdSignDocMsgObj(),
    };

    const bytesToSign = Buffer.from(JSON.stringify(docToSign), 'utf-8');

    const signatureBytes = nacl.sign.detached(bytesToSign, secretKey);

    const txSig: ProtoStdSignature = {
      publicKey: publicKey,
      Signature: signatureBytes,
    };

    const stdTx: ProtoStdTx = {
      msg: msg.toStdTxMsgObj(),
      fee: docToSign.fee,
      signature: txSig,
      memo: docToSign.memo,
      entropy: parseInt(docToSign.entropy, 10),
    };

    // Create the Proto Std Tx bytes
    const protoStdTxBytes: Buffer = Buffer.from(ProtoStdTx.encode(stdTx).finish());

    // Create the prefix
    const prefixBytes = varintEncode(protoStdTxBytes.length);
    const prefix = Buffer.from(prefixBytes);

    // Concatenate for the result
    const rawHexBytes = Buffer.concat([prefix, protoStdTxBytes]).toString('hex');

    return JSON.stringify({
      address: await getAddressFromPublicKey(publicKey),
      rawHexBytes,
    } as RawTxRequestBase);
  }
}

export class PocketTransport implements Transport<PocketTransaction, SendRequest, unknown, PocketNetwork> {
  async estimateTransactionCost(_network: PocketNetwork, _wallet: WalletData, _tx: PreparedTransaction<PocketTransaction>, _fee: unknown): Promise<TotalFee> {
    return {
      amount: '10000',
      token: 'POKT',
    };
  }

  async estimateDefaultTransactionCost(_network: PocketNetwork, _wallet: WalletData, _store: WalletStorage<unknown>, _fee: unknown): Promise<TotalFee> {
    return {
      amount: '10000',
      token: 'POKT',
    };
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

    const res: Response = await superFetch(`${POCKET_RPC_ENDPOINT}/v1/client/rawtx`, {
      method: 'POST',
      body: JSON.stringify(rawTxRequest),
    });

    const data = await res.json();

    return data.txhash;
  }

  async getTransactionStatus(network: PocketNetwork, txid: string): Promise<boolean> {
    const res: Response = await superFetch(`${POCKET_RPC_ENDPOINT}/v1/query/tx`, {
      method: 'POST',
      body: JSON.stringify({ hash: txid }),
    });

    const data = await res.json();

    return data.tx_result?.code === 0;
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

    const res: Response = await superFetch(`${POCKET_RPC_ENDPOINT}/v1/query/balance`, {
      method: 'POST',
      body: JSON.stringify({ address }),
    });

    const data = await res.json();

    return [
      {
        balance: {
          token: network.nativeTokenCaipId,
          value: data.balance.toString(),
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
    // @todo: implement tgus properly
    // let address;
    // if ('address' in wallet) {
    //   address = wallet.address;
    // } else {
    //   address = await network.deriveAddress(wallet);
    // }
    // let page = 1;
    // while (true) {
    //   const res: Response = await superFetch(`${POCKET_RPC_ENDPOINT}/v1/query/accounttxs`, {
    //     method: 'POST',
    //     body: JSON.stringify({ address, page, per_page: 20 }),
    //   });
    //   const data = await res.json();
    //   const blockTimes = data.txs.reduce((acc: any, tx: any) => {
    //     if (!acc[tx.height]) {
    //       const blockres = superFetch(`${POCKET_RPC_ENDPOINT}/v1/query/block`, {
    //         method: 'POST',
    //         body: JSON.stringify({ height: tx.height }),
    //       })
    //         .then(res => res.json())
    //         .then(data => Math.round(new Date(data.block.header.time).getTime() / 1000));
    //       acc[tx.height] = blockres;
    //     }
    //     return acc;
    //   }, {});
    //   const txs: Transaction[] = await Promise.all(
    //     data.txs.map(async (tx: any) => {
    //       const effect =
    //         tx.stdTx.msg.value.from_address === address
    //           ? {
    //               amount: tx.stdTx.msg.value.amount,
    //               assetId: '',
    //               receiver: tx.stdTx.msg.value.to_address,
    //               type: 'send',
    //             }
    //           : {
    //               amount: tx.stdTx.msg.value.amount,
    //               assetId: '',
    //               sender: tx.stdTx.msg.value.from_address,
    //               type: 'receive',
    //             };
    //       return {
    //         protocolInfo: {
    //           projectId: 'pocket',
    //         },
    //         id: tx.hash,
    //         kind: 'sent',
    //         status: tx.tx_result.code === 0 ? 'succeeded' : 'failed',
    //         timestamp: await blockTimes[tx.height],
    //         effects: [effect],
    //         fee: {
    //           amount: tx.stdTx.fee[0].amount,
    //           token: 'POKT',
    //         },
    //       };
    //     }),
    //   );
    //   handle(txs);
    //   if (data.page_count <= page) {
    //     break;
    //   }
    //   page++;
    //   break;
    // }
  }
}

export const pocketNetwork = new PocketNetwork();
export const pocketTransport = new PocketTransport();
