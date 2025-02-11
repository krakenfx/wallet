import { compact } from 'lodash';

import type { KrakenAssetSupported, KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { Networks } from '@/onChain/wallets/registry';
import { isEvmAsset } from '@/screens/KrakenConnectTransfer/utils';

const supportedKrakenConnectNetworkIds: string[] = compact(Object.entries(Networks).map(([_key, value]) => value.krakenConnectNetworkId));

export const getSupportedMethods = (methods: KrakenWithdrawMethod[] | null, asset: KrakenAssetSupported) => {
  if (!methods) {
    throw new Error('No supported withdraw methods found.');
  }
  const supportedMethods = methods.filter(method => supportedKrakenConnectNetworkIds.includes(method.network_id));
  if (supportedMethods.length === 0) {
    throw new Error('No supported withdraw methods found.');
  }

  if (isEvmAsset(asset.assetId) || supportedMethods.length === 1) {
    return supportedMethods;
  }

  if (supportedMethods.length > 1) {
    return methods.filter(m => m.network.toLowerCase().includes(asset.metadata.label.toLowerCase()));
  }
};
