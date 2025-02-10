export interface DefiProtocol {
  name: string;
  protocolLogo: string;
  apy: number;
  tvlInUsd: number;
}

export interface DefiAssetProtocolRowProps {
  protocol: DefiProtocol;
  isFirst: boolean;
  isLast: boolean;
}
