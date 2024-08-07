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
  reputation: {
    whitelists: string[];
    blacklists: string[];
  };
};

export type RemoteAsset = {
  assetId: string;
  balance: string;
  metadata: RemoteAssetMetadata;
  type: 'remoteAsset';
};
