import { onMigration } from '@/realm/migrations';

import { AccountSchema } from './accounts';
import { AssetMarketDataPercentageChangeSchema, AssetMarketDataSchema } from './assetMarketData';
import { AssetExplorerSchema, AssetLinksSchema, AssetMetadataSchema, AssetReputationSchema } from './assetMetadata';
import { DappWalletPermissionsSchema } from './dappIntegration';
import {
  DefiAncillaryStatSchema,
  DefiPositionMetadataSchema,
  DefiPositionsSchema,
  DefiProductsSchema,
  DefiSchema,
  DefiSublabelSchema,
  DefiTokenNestedSchema,
  DefiTokenSchema,
} from './defi';
import { NftMetadataSchema } from './nftMetadata';
import { NftSchema, NftTraitsSchema } from './nfts';
import { SettingsSchema } from './settings';
import {
  TokenPriceFiatCurrencySchema,
  TokenPriceFiatValueSchema,
  TokenPriceHighLow,
  TokenPriceHighLowItem,
  TokenPriceHistoryItemSchema,
  TokenPriceHistorySchema,
  TokenPriceSchema,
} from './tokenPrice';
import { TokenSchema } from './tokens';
import { TransactionNotesSchema } from './transactionNotes';
import { PendingTransactionsSchema, WalletTransactionsSchema } from './transactions';
import { UsdFiatRatesSchema } from './usdFiatRates';
import { WalletConnectTopicsSchema } from './walletConnectTopics';
import { WalletAddressCacheSchema, WalletSchema, WalletStateSchema } from './wallets';

import type { Configuration } from 'realm';

export const RealmSchema = [
  WalletConnectTopicsSchema,
  WalletSchema,
  WalletStateSchema,
  WalletAddressCacheSchema,
  WalletTransactionsSchema,
  NftSchema,
  NftMetadataSchema,
  TokenSchema,
  TokenPriceSchema,
  TokenPriceFiatValueSchema,
  TokenPriceFiatCurrencySchema,
  TransactionNotesSchema,
  AssetExplorerSchema,
  AssetMetadataSchema,
  AssetReputationSchema,
  SettingsSchema,
  NftTraitsSchema,
  AccountSchema,
  DefiSublabelSchema,
  DefiAncillaryStatSchema,
  DefiPositionMetadataSchema,
  DefiTokenSchema,
  DefiTokenNestedSchema,
  DefiPositionsSchema,
  DefiProductsSchema,
  DefiSchema,
  PendingTransactionsSchema,
  UsdFiatRatesSchema,
  AssetMarketDataSchema,
  AssetMarketDataPercentageChangeSchema,
  AssetLinksSchema,
  TokenPriceHistoryItemSchema,
  TokenPriceHistorySchema,
  TokenPriceHighLowItem,
  TokenPriceHighLow,
  DappWalletPermissionsSchema,
];

export const realmConfig: Configuration = {
  schemaVersion: 37,
  schema: RealmSchema,
  onMigration,
};
