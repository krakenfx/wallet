import { BitcoinKrakenConnect } from '@/onChain/wallets/bitcoin';
import { arbitrumNetwork, ethereumNetwork, inkNetwork, lineaNetwork, optimismNetwork, polygonNetwork } from '@/onChain/wallets/evmNetworks';
import { Networks, type WalletType } from '@/onChain/wallets/registry';

const supportedNetworks = Object.entries(Networks).map(([key, value]) => ({
  networkId: value.krakenConnectNetworkId,
  type: key,
  ...value,
}));

export const getWalletNetworkByNetworkId = (networkId: string) => supportedNetworks.find(n => n.networkId === networkId);

export const methodOrder = {
  [BitcoinKrakenConnect.networkId]: 5,
  [inkNetwork.krakenConnectNetworkId as string]: 10,
  [ethereumNetwork.krakenConnectNetworkId as string]: 20,
  [optimismNetwork.krakenConnectNetworkId as string]: 30,
  [arbitrumNetwork.krakenConnectNetworkId as string]: 40,
  [polygonNetwork.krakenConnectNetworkId as string]: 50,
  [lineaNetwork.krakenConnectNetworkId as string]: 60,
};

export const isBtcOnEvm = (assetSymbol: string, networkId: string) => {
  if (assetSymbol.toLowerCase() !== 'btc') {
    return false;
  }
  return networkId.toLowerCase() !== BitcoinKrakenConnect.networkId.toString();
};

const kBtcContractAddress = 'erc20:0x73e0c0d45e048d25fc26fa3159b0aa04bfa4db98';
export const getkBtcAssetId = (networkName: WalletType) => {
  switch (networkName) {
    case 'optimism':
      return `eip155:10/${kBtcContractAddress}`;
    default:
      return `eip155:1/${kBtcContractAddress}`;
  }
};
