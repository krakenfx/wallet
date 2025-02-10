export interface HighlightVault {
  assetId: string;
  assetAddress: string;
  assetSymbol: string;
  assetNetwork: string;
  apy: number;
  tvlInUsd: number;
  protocolName: string;
  protocolLogoUrl: string;
}

export interface DefiHighlightHeroContentProps {
  vault: HighlightVault;
}
