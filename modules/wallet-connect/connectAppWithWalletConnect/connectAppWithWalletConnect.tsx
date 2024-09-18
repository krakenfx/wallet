import React from 'react';
import Realm from 'realm';

import { showToast } from '@/components/Toast';
import { RealmWallet } from '@/realm/wallets';
import { SessionProposal, UI_STATE, _3rdPartyData } from '@/screens/ConnectApp/types';
import { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { buildSessionNamespace } from './buildSessionNamespace';
import { getAccountsFromMatchedWallets } from './getAccountsFromMatchedWallets';
import { getMatchedWallets } from './getMatchedWallets';
import { getRequestedNetworkIDs } from './getRequestedNetworkIDs';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { ReactNavigationDispatch, WalletConnectSessionsManager, initWalletConnectWeb3Wallet } from '/modules/wallet-connect';

type Props = {
  dispatch: ReactNavigationDispatch;
  goBack: () => void;
  realm: Realm;
  wallets: RealmResults<RealmWallet>;
  getSeed: SecuredKeychainContext['getSeed'];
};



export const connectAppWithWalletConnect = async (
  sessionProposal: SessionProposal,
  setUIState: React.Dispatch<React.SetStateAction<UI_STATE>>,
  { dispatch, goBack, realm, wallets, getSeed }: Props,
): Promise<_3rdPartyData> => {
  const result: _3rdPartyData = {};
  setUIState(UI_STATE.loading);

  
  const web3Wallet = await initWalletConnectWeb3Wallet(realm, dispatch, getSeed);

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
            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
            setUIState(UI_STATE.none);
            goBack();
            resolveApproveSession();
          },
          onSuccess: async () => {
            setUIState(UI_STATE.complete);
            await new Promise(resolve => setTimeout(resolve, 1500));
            goBack();
            resolveApproveSession();

            showToast({
              type: 'success',
              icon: 'plug-connected',
              text: loc.formatString(loc.scan.connected_to, { appName: result.appMetadata?.name ?? '' }).toString(),
            });
          },
        });
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
        setUIState(UI_STATE.complete);
        goBack();
        resolveApproveSession();
      }
    });
  };

  return result;
};
