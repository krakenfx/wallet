import type { SharedValue } from 'react-native-reanimated';

export interface DefiProtocolPositionsProps {
  protocol: DefiProtocol;
}
export interface DefiProtocol {
  id: string;
  protocolName: string;
  protocolIcon: string;
  totalValueInUsd: number;
  positions: Position[];
}

export interface DefiAsset {
  id: string;
  address: string;
  symbol: string;
  network: string;
  decimals: number;
  balanceNative: string;
  balanceUsd: number;
  portion: number;
}

export interface Position {
  id: string;
  isDebt: boolean;
  positionUsdValue: number;
  apy?: number;
  assets: DefiAsset[];
}

export interface DefiProtocolHeadingProps {
  protocolName: string;
  protocolIcon: string;
  nOfPositions: number;
  totalValueInUsd: number;
  isExpanded: SharedValue<boolean>;
  onToggle: () => void;
}

export interface DefiProtocolSingleAssetPositionRowProps {
  positionUsdValue: number;
  asset: DefiAsset;
  isDebt: boolean;
  apy?: number;
}

export interface DefiProtocolMultipleAssetsPositionRowProps {
  assets: DefiAsset[];
  isDebt: boolean;
  positionUsdValue: number;
}
