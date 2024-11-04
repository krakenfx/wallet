import type { ColorValue } from 'react-native';

import createHash from 'create-hash';

import type { FeeOption, InternalBalance, SimulationResult, TokenMetadata, Transaction, TransactionEffect } from '@/api/types';
import type { AssetMetadata } from '@/realm/assetMetadata';
import type { Nft } from '@/realm/nfts';
import type { RealmToken } from '@/realm/tokens';

import type { WalletType } from './registry';
import type { IWalletStorage } from './walletState';

export interface PreparedTransaction<T = unknown> {
  data: T;
  effects?: TransactionEffect[];
  isError?: boolean;
  preventativeAction?: SimulationResult['preventativeAction'];
  warnings?: SimulationResult['warnings'];
}


export interface FeeOptions<T extends FeeOption = FeeOption> {
  options: T[];
}




export interface BalanceResponse {
  balance: InternalBalance;
  metadata: TokenMetadata;
}

export interface BlockExplorer {
  transactionUri(txId: string): string;
}

export type NetworkIcon = (args: { opacity: number }) => {
  id: string;
  bgColor: ColorValue;
  
  fgColor: string | [string, string, number];
};

export type TotalFee = {
  token: string;
  amount: string;
};

export type ExtendedPublicKeyAndChainCode = {
  extendedPublicKey: ArrayBuffer;
  chainCode?: ArrayBuffer;
};

export type NativeTokenSymbol = 'BTC' | 'DOGE' | 'ETH' | 'MATIC' | 'SOL' | 'TEZ' | 'AVAX';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Network<TransactionType = unknown, TransactionRequest = unknown, TFeeOption = unknown> {
  label: string;
  nativeTokenDecimals: number;
  nativeTokenCaipId: string;
  caipId: string;
  isTestnet?: boolean;
  nativeTokenSymbol: NativeTokenSymbol;
  nativeTokenLabel?: string;
  paymentUriPrefix?: string;
  blockExplorer?: BlockExplorer;
  blockchainLabel?: string;
  icon?: NetworkIcon;
  isAddressValid(address: string): boolean;
  deriveAddress(data: WalletData): Promise<string>;
  getReceiveAddress?(data: WalletData, storage: IWalletStorage<any>): Promise<string>;
  deriveAllAddresses(data: WalletData, store: IWalletStorage<unknown>, onlyPublic?: boolean): Promise<string[]>;
  getDerivationPath(accountIdx?: number): string;
  signTransaction(data: WalletDataWithSeed, txPayload: TransactionType): Promise<string>;

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx: number): ExtendedPublicKeyAndChainCode;

  
  createMaxPaymentTransaction?(data: WalletData, to: string, minAmount?: StringNumber): Promise<TransactionRequest>;
  createPaymentTransaction(data: WalletData, to: string, amount: StringNumber): Promise<TransactionRequest>;
  createTokenTransferTransaction(data: WalletData, to: string, token: RealmToken, amount: StringNumber): Promise<TransactionRequest>;
  createNFTTransferTransaction?(data: WalletData, to: string, nft: Realmish<Nft>): Promise<TransactionRequest>;
  formatTransactionFee?(amount: string): string;
}

export interface SingleAddressNetwork extends Network {
  deriveAddress(data: WalletData): Promise<string>;
}


export class NotSupportedError extends Error {}


export interface Transport<TTransaction, TTransactionRequest, TWalletState, TNetwork = Network, TFeeOption extends FeeOption = FeeOption> {
  getTransactionStatus(network: TNetwork, txid: string): Promise<boolean>;
  getFeesEstimate(network: TNetwork): Promise<FeeOptions<TFeeOption>>;

  
  prepareTransaction(
    network: TNetwork,
    walletData: WalletData,
    data: IWalletStorage<TWalletState>,
    transaction: TTransactionRequest,
    fee: TFeeOption,
    final?: boolean,
  ): Promise<PreparedTransaction<TTransaction>>;

  
  estimateTransactionCost(network: TNetwork, wallet: WalletData, tx: PreparedTransaction<TTransaction>, fee: TFeeOption): Promise<TotalFee>;
  
  estimateDefaultTransactionCost(network: TNetwork, wallet: WalletData, store: IWalletStorage<TWalletState>, fee: TFeeOption): Promise<TotalFee>;

  broadcastTransaction(network: TNetwork, signedTx: string): Promise<string>;
  fetchBalance(
    network: Network,
    wallet: WalletData,
    data: IWalletStorage<TWalletState>,
    getTokenMetadata?: (assetId: string) => Promise<AssetMetadata>,
  ): Promise<BalanceResponse[]>;
  fetchTransactions(network: TNetwork, wallet: WalletData, data: IWalletStorage<TWalletState>, handle: (txs: Transaction[]) => Promise<boolean>): Promise<void>;
  fetchState?(wallet: WalletData, network: Network, data: IWalletStorage<TWalletState>): Promise<TWalletState>;
}


export type RealmishWallet = {
  id: string;
  type: WalletType;
  extendedPublicKey: ArrayBuffer;
  chainCode: ArrayBuffer | null;
  accountIdx?: number;
};


export type WalletData = {
  extendedPublicKey: ArrayBuffer;
  chainCode: ArrayBuffer | null;
  accountIdx?: number;
};

export type WalletDataWithSeed = WalletData & {
  seed: {
    data: ArrayBuffer;
  };
};


export type SingleKeyWalletData = {
  privateKey: string;
};

export type WatchOnlyWallet = {
  address: string;
};

export type AnyWalletKind = WalletData | WatchOnlyWallet;


export function makeWalletId(wallet: { accountIdx: number; type: string }) {
  const string2hash = wallet.type + new Date().getTime() + wallet.accountIdx;
  return createHash('sha256').update(string2hash).digest().toString('hex');
}
