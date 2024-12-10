import { fetchEnsOwnership } from '@/api/fetchEnsOwnership';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

import { getWalletNameOrEnsNameIfPresent } from './getWalletName';

export async function buildSubWallets(caip10Accounts: Record<string, string[]>, balances: Record<string, boolean>, btcBalances: Record<string, boolean>) {
  const promises = Object.entries(caip10Accounts).map(async ([accountIndex, caip10Accounts]) => {
    const accountHasBalance = caip10Accounts.some(caip10Account => balances[caip10Account] === true) || btcBalances[accountIndex];
    const accountIndexNumber = parseInt(accountIndex, 10);
    const ethCaip10Account = caip10Accounts.find(caip10Account => caip10Account.startsWith(ChainAgnostic.NETWORK_ETHEREUM + ':'));
    const name = await getWalletNameOrEnsNameIfPresent(accountIndexNumber, ethCaip10Account);
    const avatar = await getEnsAvatar(name);

    return { index: accountIndexNumber, name, hasBalance: accountHasBalance, avatar };
  });

  const subWallets = await Promise.all(promises);

  return subWallets;
}

async function getEnsAvatar(name: string) {
  if (name.endsWith('.eth')) {
    const ensData = await fetchEnsOwnership(name);

    return ensData?.owner?.avatar ?? undefined;
  }

  return undefined;
}
