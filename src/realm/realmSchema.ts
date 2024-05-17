import { Configuration } from 'realm';

import { AccountSchema } from './accounts';
import { AssetMetadataSchema, AssetReputationSchema } from './assetMetadata';
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
import { TokenPriceFiatCurrencySchema, TokenPriceFiatValueSchema, TokenPriceSchema } from './tokenPrice';
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
];

export const realmConfig: Configuration = {
  schemaVersion: 19,
  schema: RealmSchema,
};
