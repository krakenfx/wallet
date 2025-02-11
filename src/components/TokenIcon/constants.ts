import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

export const NETWORK_ICON_TO_TOKEN_RATIO = 2 / 5;
export const NETWORK_ICON_BORDER_TO_TOKEN_RATIO = 1 / 20;

export const omitNetworkIcons = {
  [ChainAgnostic.COIN_BITCOIN]: 'HDsegwitBech32',

  [ChainAgnostic.COIN_DOGECOIN]: 'dogecoin',

  [ChainAgnostic.COIN_ETHEREUM]: 'ethereum',

  [ChainAgnostic.COIN_POLYGON]: 'polygon',

  [ChainAgnostic.COIN_SOLANA]: 'solana',

  'eip155:42161/erc20:0x912ce59144191c1204e64559fe8253a0e49e6548': 'arbitrum',

  'eip155:10/erc20:0x4200000000000000000000000000000000000042': 'optimism',

  [ChainAgnostic.COIN_AVALANCHE]: 'avalanche',
};
