import type { AssetMetadata } from '@/realm/assetMetadata';

export interface KrakenAssetBalance {
  balance: string;
  hold_trade: string;
}

export interface AssetsDict {
  [symbol: string]: KrakenAssetBalance;
}

export interface KrakenAssetRaw {
  krakenAssetSymbol: string;
  symbol: string;
  balance: string;
  hold_trade: string;
}

export interface KrakenAssetMetadata {
  label: AssetMetadata['label'];
  symbol: AssetMetadata['symbol'];
  decimals: AssetMetadata['decimals'];
}

export interface KrakenAssetSupported extends KrakenAssetRaw {
  isSupported: true;
  assetId: string;
  metadata: KrakenAssetMetadata;
  walletId: string;
  balanceInUsd?: number;
}

export interface KrakenAssetNotSupported extends KrakenAssetRaw {
  isSupported: false;
  assetId?: string;
  metadata?: KrakenAssetMetadata;
  walletId?: string;
  balanceInUsd?: number;
}

export interface KrakenTicker {
  a: string[];
  b: string[];
  o: string;
}

export interface KrakenTickerDict {
  [ticker: string]: KrakenTicker;
}

export type KrakenAsset = KrakenAssetSupported | KrakenAssetNotSupported;

export interface KrakenConnectWithdrawMethodFee {
  asset: string;
  fee: string;
  fee_percentage?: string;
}

export interface KrakenWithdrawMethod {
  asset: string;
  method_id: string;
  method: string;
  network_id: string;
  network: string;
  minimum: string;
  fee: KrakenConnectWithdrawMethodFee;
}

export interface KrakenWithdrawFee {
  asset_class: string;
  asset: string;
  fee: string;
  total: string;
  net: string;
  fee_token: string;
}
