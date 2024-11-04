import type { WalletType } from './onChain/wallets/registry';

export type AssetBalanceId =
  | string
  | {
      assetId: string;
      walletId: string;
    };

export type Warning = { severity: 'critical' | 'medium'; heading: string; message: string };

export type RemoteAssetMetadata = {
  label: string;
  symbol: string;
  decimals: number;
  tokenAddress: string | null;
  reputation: {
    whitelists: string[];
    blacklists: string[];
  };
  walletType: WalletType;
};

export type RemoteAsset = {
  assetId: string;
  balance: string;
  metadata: RemoteAssetMetadata;
  type: 'remoteAsset';
};
