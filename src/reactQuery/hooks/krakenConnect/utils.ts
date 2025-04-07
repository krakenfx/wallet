import { compact } from 'lodash';

import type { KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { Networks } from '@/onChain/wallets/registry';

const supportedKrakenConnectNetworkIds: string[] = compact(Object.entries(Networks).map(([_key, value]) => value.krakenConnectNetworkId));

export const getSupportedMethods = (methods: KrakenWithdrawMethod[] | null) => {
  if (!methods) {
    throw new Error('No supported withdraw methods found.');
  }
  const supportedMethods = methods.filter(method => supportedKrakenConnectNetworkIds.includes(method.network_id));
  if (supportedMethods.length === 0) {
    throw new Error('No supported withdraw methods found.');
  }

  return supportedMethods;
};
