import type { FeeOptionKind } from '@/api/types';
import type { TotalFee } from '@/onChain/wallets/base';
import type { RealmNft } from '@/realm/nfts';
import type { RealmToken } from '@/realm/tokens';

export type CoinTransactionParams = {
  type: 'coin';
  amount: string;
  useMaxAmount?: boolean;
  address: ValidAddress;
  token: RealmToken;
};

export type TokenTransactionParams = {
  type: 'token';
  amount: string;
  useMaxAmount?: boolean;
  address: ValidAddress;
  token: RealmToken;
};

export type NftTransactionParams = {
  type: 'nft';
  address: ValidAddress;
  nft: RealmNft;
};

export type Amounts = {
  amountFiat: string | undefined;
  feeFiat: string;
  fee: TotalFee;
  feePrice: number;
};

export type TransactionParams = NftTransactionParams | TokenTransactionParams | CoinTransactionParams;

export type FeeEstimationMap = Record<FeeOptionKind, TotalFee>;

export type ValidAddress = Branded<string, 'address'>;

export enum ScreenStage {
  ReadyToBroadcast,
  Broadcasting,
  Sent,
}
