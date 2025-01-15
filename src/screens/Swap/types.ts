import type { SwapQuoteAsset, SwapRouteProvider, SwapRouteTXStep } from '@/api/types';
import type { RealmToken } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';

import type { MergeExclusive } from 'type-fest';

export type SwapTargetAsset = RemoteAsset | RealmToken;

export type SwapFeeFiatValueMap = Record<string, number>;

type FeeImageIconProps = {
  uri: string;
  type: 'image';
};
type FeeAssetIconProps = {
  type: 'asset';
  assetId: string;
};

export type FeeDetails = {
  assetId: string;
  amount?: string;
  key: string;
  iconProps: MergeExclusive<FeeImageIconProps, FeeAssetIconProps>;
};

export type SwapGasFeeUIData = {
  key: string;
  feeAsset: SwapQuoteAsset;
  type: 'gas';
};
export type SwapBridgeFeeUIData = {
  key: string;
  provider: SwapRouteProvider;
  feeAsset: SwapQuoteAsset;
  type: 'bridge';
};
export type SwapFeeUIData = SwapGasFeeUIData | SwapBridgeFeeUIData;

export type SwapRouteUIData = {
  sourceAsset: RealmToken;
  targetAsset: SwapTargetAsset;
  sourceAssetAmount: string;
  rate?: string;

  output: string;
  minOutput: string;
  minOutputFormatted: string;
  slippage?: string;
  transactionFeesTotalFiat: string;
  fees: SwapFeeUIData[];
  steps: SwapRouteTXStep[];
  duration?: string;
};
