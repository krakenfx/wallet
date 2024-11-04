
export class ChainAgnostic {
  static NETWORK_ARBITRUM = 'eip155:42161';
  static NETWORK_BASE = 'eip155:8453';
  static NETWORK_BITCOIN = 'bip122:000000000019d6689c085ae165831e93';
  static NETWORK_BLAST = 'eip155:81457';
  static NETWORK_ETHEREUM = 'eip155:1';
  static NETWORK_LINEA = 'eip155:59144';
  static NETWORK_OPTIMISM = 'eip155:10';
  static NETWORK_POLYGON = 'eip155:137';
  static NETWORK_SOLANA = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
  static NETWORK_SOLANA_DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
  static NETWORK_DOGECOIN = 'bip122:1a91e3dace36e2be3bf030a65679fe82';
  static NETWORK_TEZOS = 'tezos:NetXdQprcVkpaWU';
  static NETWORK_AVALANCHE = 'eip155:43114';

  static COIN_ARBITRUM = 'eip155:42161/slip44:60';
  static COIN_ETHEREUM = 'eip155:1/slip44:60';
  static COIN_OPTIMISM = 'eip155:10/slip44:60';
  static COIN_BASE = 'eip155:8453/slip44:60';
  static COIN_BLAST = 'eip155:81457/slip44:60';
  static COIN_LINEA = 'eip155:59144/slip44:60';
  static COIN_POLYGON = 'eip155:137/slip44:966';
  static COIN_BITCOIN = 'bip122:000000000019d6689c085ae165831e93/slip44:0';
  static COIN_SOLANA = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/slip44:501';
  static COIN_SOLANA_DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1/slip44:501';
  static COIN_DOGECOIN = 'bip122:1a91e3dace36e2be3bf030a65679fe82/slip44:3';
  static COIN_TEZOS = 'tezos:NetXdQprcVkpaWU/slip44:1729';
  static COIN_AVALANCHE = 'eip155:43114/slip44:9005';
}

const CAIP19_REGEX = /^([-a-z0-9]{3,8}):([-_a-zA-Z0-9]{1,32})\/([-a-z0-9]{3,8}):([-.%a-zA-Z0-9]{1,128})(?:\/([-.%a-zA-Z0-9]{1,78}))?$/;


export type CAIP19 = {
  assetType: string; 
  chainId: string; 
  chainNamespace: string; 
  chainReference: string; 
  assetId: string; 
  assetNamespace: string; 
  assetReference: string; 
  tokenId?: string; 
};


export function parseCAIP19(assetType: string): CAIP19 | null {
  const match: RegExpMatchArray | null = assetType.match(CAIP19_REGEX);
  if (!match) {
    return null;
  }
  
  
  const [_, chainNamespace, chainReference, assetNamespace, assetReference, tokenId] = match;
  const caip19: CAIP19 = {
    assetType,
    chainId: `${chainNamespace}:${chainReference}`,
    chainNamespace,
    chainReference,
    assetId: `${assetNamespace}:${assetReference}${tokenId ? `/${tokenId}` : ''}`,
    assetNamespace,
    assetReference,
    tokenId,
  };
  return caip19;
}
