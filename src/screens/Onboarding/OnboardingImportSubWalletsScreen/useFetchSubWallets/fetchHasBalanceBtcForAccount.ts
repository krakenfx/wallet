import BigNumber from 'bignumber.js';

import { Networks, Transports } from '@/onChain/wallets/registry';
import { type SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { getWalletDataByAccount } from './getWalletDataByAccount';

import { handleError } from '/helpers/errorHandler';

export async function fetchHasBalanceBtcForAccount(getSeed: SecuredKeychainContext['getSeed'], accountNumber: number) {
  try {
    const seed = await getSeed('createWallet', true);
    if (!seed) {
      throw new Error('Onboarding import sub-wallets: missing seed');
    }

    const walletData = getWalletDataByAccount(seed, Networks.HDsegwitBech32, accountNumber);
    const btcBalance = await Transports.HDsegwitBech32.fetchBalanceWithoutWalletStorage(Networks.HDsegwitBech32, walletData);
    const btcValue = BigNumber(btcBalance ?? '0');
    const hasBalance = btcValue.gt(0);

    return { [accountNumber]: hasBalance };
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    return {};
  }
}
