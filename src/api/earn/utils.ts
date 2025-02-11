import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

export const VAULTS_SUPPORTED_NETWORKS: ChainAgnostic[] = [
  ChainAgnostic.NETWORK_ARBITRUM,
  ChainAgnostic.NETWORK_BASE,
  ChainAgnostic.NETWORK_ETHEREUM,
  ChainAgnostic.NETWORK_OPTIMISM,
  ChainAgnostic.NETWORK_POLYGON,
];
