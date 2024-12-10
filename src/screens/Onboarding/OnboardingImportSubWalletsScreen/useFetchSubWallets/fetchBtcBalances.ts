import { Networks, Transports } from '@/onChain/wallets/registry';

import { type SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { ACCOUNT_BATCH_SIZE } from './consts';
import { getWalletDataByAccount } from './getWalletDataByAccount';

import { handleError } from '/helpers/errorHandler';

export async function fetchBtcBalances(getSeed: SecuredKeychainContext['getSeed'], accountIndexStart: number) {
  const seed = await getSeed('createWallet', true);
  if (!seed) {
    handleError('Onboarding import sub-wallets: missing seed', 'ERROR_CONTEXT_PLACEHOLDER');
    return {};
  }

  const btcAccountIndexes: number[] = [];
  const btcPromises = [];
  for (let i = accountIndexStart; i < accountIndexStart + ACCOUNT_BATCH_SIZE; i++) {
    const walletData = getWalletDataByAccount(seed, Networks.HDsegwitBech32, i);

    btcAccountIndexes.push(i);
    btcPromises.push(Transports.HDsegwitBech32.fetchBalanceWithoutWalletStorage(Networks.HDsegwitBech32, walletData));
  }

  const allBtcBalances = await Promise.all(btcPromises);
  const btcAccountIndexToHasBalance: Record<string, boolean> = {};

  allBtcBalances.forEach((btcBalance, i) => {
    if (i in btcAccountIndexes) {
      const btcAccountIndex = btcAccountIndexes[i];

      btcAccountIndexToHasBalance[btcAccountIndex] = btcBalance > 0;
    }
  });

  return btcAccountIndexToHasBalance;
}
