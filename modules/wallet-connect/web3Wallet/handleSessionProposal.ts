import { CommonActions } from '@react-navigation/native';

import { analyseUrl } from '@/api/analyseUrl';
import { showToast } from '@/components/Toast';
import { getWalletsForMutations } from '@/realm/wallets';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { getAccountsFromMatchedWallets } from '../connectAppWithWalletConnect/getAccountsFromMatchedWallets';
import { getMatchedWallets } from '../connectAppWithWalletConnect/getMatchedWallets';
import { getRequestedNetworkIDs } from '../connectAppWithWalletConnect/getRequestedNetworkIDs';

import type { ReactNavigationDispatch } from '../types';
import type { WalletKitTypes } from '@reown/walletkit';
import type Realm from 'realm';

import loc from '/loc';

export async function handleSessionProposal(
  proposal: WalletKitTypes.SessionProposal,
  dispatch: ReactNavigationDispatch,
  realm: Realm,
  unencryptedRealm: Realm,
): Promise<void> {
  hapticFeedback.impactHeavy();
  void showToast({
    duration: 300,
    text: loc.onChainSecurity.analysingApp,
    type: 'info',
  });

  const url = proposal?.verifyContext?.verified?.origin ?? proposal.params.proposer.metadata.url;
  const wallets = getWalletsForMutations(realm, unencryptedRealm);
  const { requestedNetworkIDs, requiresWrongSolanaID } = getRequestedNetworkIDs(proposal);
  const matchedWallets = getMatchedWallets(wallets, requestedNetworkIDs);
  const accounts = await getAccountsFromMatchedWallets(matchedWallets, requiresWrongSolanaID);
  const allAccounts = [...accounts.eip155, ...accounts.solana];
  const analyseUrlResult = await analyseUrl(url, allAccounts);

  return new Promise(resolve => {
    dispatch(
      CommonActions.navigate({
        name: 'ConnectWalletConnectApp',
        params: {
          onDone: () => {
            resolve();
          },
          walletConnectV2: { proposal },
          verified: proposal.verifyContext.verified,
          isMalicious: analyseUrlResult.isMalicious,
        },
      }),
    );
  });
}
