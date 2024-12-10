import { Networks, isTestNet } from '@/onChain/wallets/registry';
import { type SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { ACCOUNT_BATCH_SIZE } from './consts';
import { getWalletDataByAccount } from './getWalletDataByAccount';

import { handleError } from '/helpers/errorHandler';

export async function getCaip10Accounts(getSeed: SecuredKeychainContext['getSeed'], accountIndexStart = 0, isTestnetEnabled = false) {
  const seed = await getSeed('createWallet', true);
  if (!seed) {
    handleError('Onboarding import sub-wallets: missing seed', 'ERROR_CONTEXT_PLACEHOLDER');
    return {};
  }

  const caip10Accounts: Record<string, string[]> = {};
  const promises = [];
  const filteredNetworks = Object.entries(Networks).filter(([networkName, network]) => {
    if (!isTestnetEnabled && isTestNet(network)) {
      return false;
    }

    if (networkName === 'HDsegwitBech32') {
      return false;
    }

    return true;
  });

  for (let i = accountIndexStart; i < accountIndexStart + ACCOUNT_BATCH_SIZE; i++) {
    const accountPromises = filteredNetworks.map(async ([_networkName, network]) => {
      const walletData = getWalletDataByAccount(seed, network, i);
      const address = await network.deriveAddress(walletData);
      const caip10Account = network.caipId + ':' + address;

      if (caip10Accounts[i]) {
        caip10Accounts[i].push(caip10Account);
      } else {
        caip10Accounts[i] = [caip10Account];
      }
    });

    promises.push(accountPromises);
  }

  await Promise.all(promises.flat());

  return caip10Accounts;
}
