/* eslint @typescript-eslint/no-unused-vars: 0 */


import { InMemorySigner } from '@taquito/signer';
import * as TaquitoUtils from '@taquito/utils';
import * as ed25519 from 'ed25519-hd-key';

import { Buffer } from 'buffer';

import type { RealmToken } from '@/realm/tokens';

import { HarmonyTransport } from './HarmonyTransport';
import { ChainAgnostic } from './utils/ChainAgnostic';

import type { BlockExplorer, ExtendedPublicKeyAndChainCode, NativeTokenSymbol, Network, NetworkIcon, WalletData, WalletDataWithSeed } from './base';

import loc from '/loc';

const TEZOS_BIP44_COINTYPE = 1729;

export class TezosNetwork implements Network {
  label = loc.network.tezos;
  caipId: string = ChainAgnostic.NETWORK_TEZOS;
  nativeTokenCaipId: string = ChainAgnostic.COIN_TEZOS;
  nativeTokenDecimals: number = 6;
  nativeTokenSymbol: NativeTokenSymbol = 'TEZ';
  paymentUriPrefix = 'tezos';
  blockExplorer: BlockExplorer = {
    transactionUri(txId: string) {
      return `https://tzstats.com/${txId}`;
    },
  };
  icon: NetworkIcon = ({ opacity }) => ({
    id: 'xtz',
    fgColor: '#2d7df7',
    bgColor: `rgba(51, 86, 234, ${opacity})`,
  });

  createPaymentTransaction(data: WalletData, to: string, amount: StringNumber): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  createTokenTransferTransaction(data: WalletData, to: string, token: RealmToken, amount: StringNumber): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  getPrivateKey(data: WalletDataWithSeed) {
    const { key } = ed25519.derivePath(this.getDerivationPath(data.accountIdx) + "/0'", Buffer.from(data.seed.data).toString('hex'));
    return TaquitoUtils.b58cencode(key.slice(0, 32), TaquitoUtils.prefix.edsk2);
  }

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx: number): ExtendedPublicKeyAndChainCode {
    throw new Error('todo - tezos not implemented');
  }

  async deriveAddress(data: WalletDataWithSeed): Promise<string> {
    const accPrivateKey = this.getPrivateKey(data);
    const signer = await InMemorySigner.fromSecretKey(accPrivateKey, '');
    return await signer.publicKeyHash();
  }

  async deriveAllAddresses(data: WalletDataWithSeed): Promise<string[]> {
    return [await this.deriveAddress(data)];
  }

  getDerivationPath(accountIdx?: number): string {
    return `m/44'/${TEZOS_BIP44_COINTYPE}'/${accountIdx ?? 0}'`;
  }

  isAddressValid(address: string): boolean {
    return TaquitoUtils.validateAddress(address) === 3;
  }

  signTransaction(data: WalletData, txPayload: unknown): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class TezosTransport extends HarmonyTransport<unknown, unknown, unknown> {}

export const tezosNetwork = new TezosNetwork();
export const tezosTransport = new TezosTransport();
