import type React from 'react';

import type { RealmWalletConnectTopics } from '@/realm/walletConnectTopics';
import { REALM_TYPE_WALLET_CONNECT_TOPICS } from '@/realm/walletConnectTopics';
import type { RealmWallet } from '@/realm/wallets';
import type { SessionProposal, _3rdPartyData } from '@/screens/ConnectApp/types';
import { UI_STATE } from '@/screens/ConnectApp/types';
import type { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { buildSessionNamespace } from './buildSessionNamespace';
import { getAccountsFromMatchedWallets } from './getAccountsFromMatchedWallets';
import { getMatchedWallets } from './getMatchedWallets';
import { getRequestedNetworkIDs } from './getRequestedNetworkIDs';
import { handleRedirect } from './handleRedirect';

import type Realm from 'realm';

import { handleError } from '/helpers/errorHandler';
import type { ReactNavigationDispatch } from '/modules/wallet-connect';
import { WalletConnectSessionsManager, initWalletConnectWeb3Wallet } from '/modules/wallet-connect';

type Props = {
  dispatch: ReactNavigationDispatch;
  goBack: () => void;
  realm: Realm;
  unencryptedRealm: Realm;
  wallets: RealmResults<RealmWallet>;
  getSeed: SecuredKeychainContext['getSeed'];
  isInAppBrowserOpen?: boolean;
};

export const connectAppWithWalletConnect = async (
  sessionProposal: SessionProposal,
  setUIState: React.Dispatch<React.SetStateAction<UI_STATE>>,
  { dispatch, goBack, realm, unencryptedRealm, wallets, getSeed, isInAppBrowserOpen }: Props,
): Promise<_3rdPartyData> => {
  const deleteProposedSession = (pairingTopic: string) => {
    realm.write(() => {
      const sessionToDelete = realm.objectForPrimaryKey<RealmWalletConnectTopics>(REALM_TYPE_WALLET_CONNECT_TOPICS, pairingTopic);
      if (sessionToDelete) {
        realm.delete(sessionToDelete);
      }
    });
  };

  const result: _3rdPartyData = {};
  setUIState(UI_STATE.loading);

  const web3Wallet = await initWalletConnectWeb3Wallet(realm, unencryptedRealm, dispatch, getSeed);

  setUIState(UI_STATE.none);

  const { requestedNetworkIDs, requestedRequiredNetworkIDs, requiresWrongSolanaID } = getRequestedNetworkIDs(sessionProposal);

  result.networkIDs = [...requestedNetworkIDs];
  result.requiredNetworkIDs = [...requestedRequiredNetworkIDs];

  const matchedWallets = getMatchedWallets(wallets, requestedNetworkIDs);

  result.appMetadata = {
    icon: sessionProposal.params.proposer.metadata?.icons?.[0] ?? '',
    name: sessionProposal.params.proposer.metadata.name ?? '',
    url: sessionProposal.params.proposer.metadata.url ?? '',
  };

  result.rejectSession = async () => {
    deleteProposedSession(sessionProposal.params.pairingTopic);
    web3Wallet?.rejectSession({
      id: sessionProposal!.id,
      reason: {
        code: 1,
        message: 'User rejected',
      },
    });

    goBack();
  };

  result.approveSession = async () => {
    setUIState(UI_STATE.loading);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (matchedWallets.length === 0) {
      setUIState(UI_STATE.none);
      return;
    }

    const accountsFromMatchedWallets = await getAccountsFromMatchedWallets(matchedWallets, requiresWrongSolanaID);
    const sessionNamespace = buildSessionNamespace(sessionProposal, accountsFromMatchedWallets);

    await new Promise<void>(resolveApproveSession => {
      try {
        WalletConnectSessionsManager.approveSession(sessionProposal!.id, sessionNamespace, {
          onError: error => {
            deleteProposedSession(sessionProposal.params.pairingTopic);
            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
            setUIState(UI_STATE.none);
            goBack();
            resolveApproveSession();
          },
          onSuccess: async response => {
            const session = realm.objectForPrimaryKey<RealmWalletConnectTopics>(REALM_TYPE_WALLET_CONNECT_TOPICS, response.pairingTopic);
            if (!session) {
              throw new Error('Realm proposal not found');
            }
            realm.write(() => {
              session.topic = response.topic;
            });
            setUIState(UI_STATE.complete);
            await new Promise(resolve => setTimeout(resolve, 1500));
            goBack();
            resolveApproveSession();

            const isDeepLinked = !isInAppBrowserOpen && session.isDeepLinked;

            await handleRedirect(response, 'connected_to', isDeepLinked);
          },
        });
      } catch (error) {
        deleteProposedSession(sessionProposal.params.pairingTopic);
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
        setUIState(UI_STATE.complete);
        goBack();
        resolveApproveSession();
      }
    });
  };

  return result;
};
