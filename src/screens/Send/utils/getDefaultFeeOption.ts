import type { FeeOption } from '@/api/types';
import type { RealmishWallet } from '@/onChain/wallets/base';

export const getDefaultFeeOption = (wallet: RealmishWallet): FeeOption['kind'] | undefined => {
  switch (true) {
    case wallet.type === 'ethereum':
      return 'slow';
    case wallet.type === 'HDsegwitBech32':
      return 'fast';
    default:
      return;
  }
};
