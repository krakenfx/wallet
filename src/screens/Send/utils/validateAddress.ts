import type { Network } from '@/onChain/wallets/base';

import type { ValidAddress } from '../types';

export const isValidAddress = (network: Network, value?: string): value is ValidAddress => {
  return !!value && network.isAddressValid(value);
};
