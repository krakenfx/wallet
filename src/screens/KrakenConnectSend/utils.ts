import { Networks } from '@/onChain/wallets/registry';

const supportedNetworks = Object.entries(Networks).map(([key, value]) => ({
  networkId: value.krakenConnectNetworkId,
  name: key,
  ...value,
}));

export const getNetworkByNetworkId = (networkId: string) => supportedNetworks.find(n => n.networkId === networkId);
