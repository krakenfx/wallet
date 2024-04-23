export enum NETWORK_FILTERS {
  ethereum = 'eip155:1/',
  polygon = 'eip155:137/',
  solana = 'solana:',
  arbitrum = 'eip155:42161/',
  optimism = 'eip155:10/',
  base = 'eip155:8453/',
  HDsegwitBech32 = 'bip122:000000000019d6689c085ae165831e93',
  doge = 'bip122:1a91e3dace36e2be3bf030a65679fe82',
  pocket = 'pokt:7d551967cb8bbc9f8c0eae78797d0576',
}

export type UINetworkFilters = NETWORK_FILTERS | 'all';
