import { Configuration } from 'realm';

import { onMigration } from '@/realm/migrations';

import { AccountSchema } from './accounts';
import { AssetMarketDataPercentageChangeSchema, AssetMarketDataSchema } from './assetMarketData';
import { AssetExplorerSchema, AssetLinksSchema, AssetMetadataSchema, AssetReputationSchema } from './assetMetadata';
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
import { WalletAddressCacheSchema, WalletSchema, WalletStateSchema } from './wallets';

export const RealmSchema = [
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
];

export const realmConfig: Configuration = {
  schemaVersion: 29,
  schema: RealmSchema,
  onMigration,
};
