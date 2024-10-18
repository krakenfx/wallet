import { entries, fromPairs } from 'lodash';

import { DefiNetwork } from '@/realm/defi';

import { Network, RealmishWallet, Transport } from './base';
import { BitcoinNetwork } from './bitcoin';
import { electrumXTransport, hdSegwitBech32Network } from './bitcoinWallets';
import { DogecoinNetwork, dogecoinNetwork, dogecoinTransport } from './dogecoin';
import { EVMHarmonyTransport, EVMNetwork } from './evm';
import {
  arbitrumNetwork,
  baseNetwork,
  blastNetwork,
  ethereumNetwork,
  ethereumSepoliaNetwork,
  lineaNetwork,
  optimismNetwork,
  polygonNetwork,
} from './evmNetworks';
import { SolanaNetwork } from './solana';
import { solanaDevnet, solanaDevnetTransport } from './solanaDevnet';
import { solanaMainnet, solanaRpcNetwork } from './solanaMainnet';


export const Networks = {
  HDsegwitBech32: hdSegwitBech32Network,
  ethereum: ethereumNetwork,
  arbitrum: arbitrumNetwork,
  optimism: optimismNetwork,
  base: baseNetwork,
  polygon: polygonNetwork,
  solana: solanaMainnet,
  dogecoin: dogecoinNetwork,
  
  ethereumTestnetSepolia: ethereumSepoliaNetwork,
  
  solanaDevnet: solanaDevnet,
  blast: blastNetwork,
  linea: lineaNetwork,
};


export const DefiNetworks = [Networks.HDsegwitBech32, Networks.ethereum, Networks.polygon, Networks.base, Networks.arbitrum, Networks.optimism, Networks.linea];
export const parseDefiNetworkTypeToWalletType = (networkType: DefiNetwork): WalletType => {
  switch (networkType) {
    case 'bitcoin':
      return 'HDsegwitBech32';
    default:
      return networkType as WalletType;
  }
};

export const evmHarmonyTransport = new EVMHarmonyTransport();

const Transports = {
  HDsegwitBech32: electrumXTransport,
  
  polygon: evmHarmonyTransport,
  arbitrum: evmHarmonyTransport,
  optimism: evmHarmonyTransport,
  base: evmHarmonyTransport,
  solana: solanaRpcNetwork,
  solanaDevnet: solanaDevnetTransport,
  dogecoin: dogecoinTransport,
  ethereum: evmHarmonyTransport,
  ethereumTestnetSepolia: evmHarmonyTransport,
  blast: evmHarmonyTransport,
  linea: evmHarmonyTransport,
  
} satisfies { [x in keyof typeof Networks]: Transport<any, any, any, any, any> };

export type WalletType = keyof typeof Networks;


export function getImplForWallet<TType, TRequest, TFeeOption>(wallet: RealmishWallet) {
  return getImplForType<TType, TRequest, TFeeOption>(wallet.type);
}

export function getImplForType<TType, TRequest, TFeeOption>(type: WalletType) {
  if (!(type in Networks) || !(type in Transports)) {
    throw new Error('Network not configured properly: ' + type);
  }
  type TypedNetwork = Network<TType, TRequest, TFeeOption>;
  const network = Networks[type] as unknown as TypedNetwork;
  const transport = Transports[type] as unknown as Transport<TType, TRequest, unknown, TypedNetwork>;

  return { network, transport };
}

export function getNetworkName<TType, TRequest, TFeeOption>(network: Network<TType, TRequest, TFeeOption>) {
  switch (true) {
    case network instanceof BitcoinNetwork:
      return 'BitcoinNetwork';
    case network instanceof EVMNetwork:
      return 'EVMNetwork';
    case network instanceof SolanaNetwork:
      return 'SolanaNetwork';
    case network instanceof DogecoinNetwork:
      return 'DogecoinNetwork';
    default:
      return 'unknown';
  }
}

export const isTestNet = (network: Network & { isTestnet?: boolean }) => {
  return !!network.isTestnet;
};

export const isNetworkCoin = (assetId: string) => {
  const nativeTokenCaipIds = Object.values(Networks).map(network => network.nativeTokenCaipId);
  return nativeTokenCaipIds.includes(assetId);
};



export const DEPRECATED_NETWORKS: WalletType[] = [];


export const ALL_MAINNET_COINS = entries(Networks)
  .filter(([t, n]) => !isTestNet(n) && !DEPRECATED_NETWORKS.includes(t as WalletType))
  .map(([type]) => type as WalletType);


export const TESTNET_COINS = entries(Networks)
  .filter(([t, n]) => isTestNet(n) && !DEPRECATED_NETWORKS.includes(t as WalletType))
  .map(([type]) => type as WalletType);


export const DEFAULT_GALLERY_COINS: WalletType[] = ['HDsegwitBech32', 'ethereum', 'polygon', 'solana'];

export const networkIdToNetworkName = fromPairs<WalletType>(
  entries(Networks).map(([type, network]) => {
    return [network.caipId, type as WalletType];
  }),
);

export const nativeCoinToNetworkName = fromPairs<WalletType>(
  entries(Networks).map(([type, network]) => {
    return [network.nativeTokenCaipId, type as WalletType];
  }),
);
