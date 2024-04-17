import { Transaction } from '@/api/types';
import { RealmAssetMetadata } from '@/realm/assetMetadata';
import { RealmToken } from '@/realm/tokens';
import { RealmTransaction } from '@/realm/transactions';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import { SimpleTransactionData, SwapTransactionData, TransactionData } from '@/realm/transactions/getTransactionMetadata';
import { RealmWallet } from '@/realm/wallets';

export const mockContextToken = {
  id: 'foobar',
  assetId: 'foobar',
  walletId: 'foobar',
  balance: 'foobar',
  metadata: {},
} as RealmToken;

export const mockAssetMetadata = {
  assetId: 'foobar',
  label: 'foobar',
  symbol: 'foobar',
  decimals: 7,
  logoUrl: 'foobar',
  reputation: {
    whitelists: [],
    blacklists: [],
  },
} as unknown as RealmAssetMetadata;

export const mockWallet = {
  id: 'foobar',
  type: 'solanaDevnet',
  accountIdx: 777,
  caipId: 'foobar',
  nativeTokenSymbol: 'ETH',
  nativeTokenCaipId: 'foobar',
  nativeTokenDecimals: 7,
  nativeTokenLabel: 'foobar',
} as RealmWallet;

export const mockTransaction = {
  protocolInfo: {
    projectId: 'foobar',
  },
  effects: [],
  metadata: {
    actionName: 'foobar',
    target: 'foobar',
  },
  fee: {
    amount: 'foobar',
    token: 'foobar',
  },
  kind: 'sent',
  status: 'succeeded',
  timestamp: 777,
  id: 'foobar',
} satisfies Transaction;

export const mockSwapTransactionData = {
  kind: 'swap',
  type: TRANSACTION_TYPES.SWAP,
  sent: {
    amount: 'foobar',
    assetId: 'foobar',
  },
  receive: {
    amount: 'foobar',
    assetId: 'foobar',
  },
  status: 'succeeded',
} satisfies SwapTransactionData;

export const mockSimpleTransactionData = {
  kind: 'simple',
  type: TRANSACTION_TYPES.SEND,
  effect: {
    amount: 'foo',
    assetId: 'bar',
  },
  description: 'desc',
  status: 'succeeded',
} satisfies SimpleTransactionData;

export const mockContractInteractionTransactionData: TransactionData = {
  kind: 'contract',
  type: TRANSACTION_TYPES.CONTRACT_INTERACTION,
  effects: [],
  status: 'succeeded',
};

export const mockRealmTransaction = { fee: '' } as RealmTransaction;

export const mockNftTransactionData = {
  kind: 'nft',
  type: TRANSACTION_TYPES.NFT_SEND,
  nft: {
    assetId: 'foobar',
    amount: 'foobar',
  },
  paymentToken: {
    amount: 'foobar',
    assetId: 'foobar',
  },
  status: 'succeeded',
};
