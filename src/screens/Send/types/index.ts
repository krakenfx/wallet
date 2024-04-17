import { FeeOptionKind } from '@/api/types';
import { TotalFee } from '@/onChain/wallets/base';
import { RealmNft } from '@/realm/nfts';
import { RealmToken } from '@/realm/tokens';

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

export type TransactionParams = NftTransactionParams | TokenTransactionParams | CoinTransactionParams;

export type FeeEstimationMap = Record<FeeOptionKind, TotalFee>;

export type ValidAddress = Branded<string, 'address'>;
