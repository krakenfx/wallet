import { Network } from '@/onChain/wallets/base';

import { ValidAddress } from '../types';

export const isValidAddress = (network: Network, value?: string): value is ValidAddress => {
  return !!value && network.isAddressValid(value);
};
