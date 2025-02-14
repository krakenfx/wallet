import { Networks } from '@/onChain/wallets/registry';

const supportedNetworks = Object.entries(Networks).map(([key, value]) => ({
  networkId: value.krakenConnectNetworkId,
  type: key,
  ...value,
}));

export const getWalletNetworkByNetworkId = (networkId: string) => supportedNetworks.find(n => n.networkId === networkId);
