import { FeeOption } from '@/api/types';
import { RealmishWallet } from '@/onChain/wallets/base';

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
