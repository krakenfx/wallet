export type AssetBalanceId =
  | string
  | {
      assetId: string;
      walletId: string;
    };

export type Warning = { severity: 'critical' | 'medium'; heading: string; message: string };
