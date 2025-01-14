import { Networks, isTestNet } from '@/onChain/wallets/registry';
import { type SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { ACCOUNT_BATCH_SIZE } from './consts';
import { getWalletDataByAccount } from './getWalletDataByAccount';

import { handleError } from '/helpers/errorHandler';

type Props = { getSeed: SecuredKeychainContext['getSeed']; accountIndexStart: number; isTestnetEnabled: boolean; accountBatchSize?: number };

export async function getCaip10Accounts({ getSeed, accountIndexStart = 0, isTestnetEnabled = false, accountBatchSize = ACCOUNT_BATCH_SIZE }: Props) {
  try {
    const seed = await getSeed('createWallet', true);
    if (!seed) {
      throw new Error('Onboarding import sub-wallets: missing seed');
    }

    const filteredNetworks = Object.entries(Networks).filter(([networkName, network]) => {
      if (!isTestnetEnabled && isTestNet(network)) {
        return false;
      }

      if (networkName === 'HDsegwitBech32') {
        return false;
      }

      return true;
    });
    const caip10Accounts: Record<string, string[]> = {};
    const allAccountPromises = [];

    for (let i = accountIndexStart; i < accountIndexStart + accountBatchSize; i++) {
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

      allAccountPromises.push(accountPromises);
    }

    await Promise.all(allAccountPromises.flat());

    return caip10Accounts;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    return {};
  }
}
