import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { useGlobalState } from '@/components/GlobalState';
import { useCurrentAccountNumber } from '@/realm/accounts';
import { useRealm } from '@/realm/RealmContext';

import { useRealmWallets } from '@/realm/wallets';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { useUnencryptedRealm } from '@/unencrypted-realm/RealmContext';

import type { ConnectWalletConnectAppParams } from '../ConnectWalletConnectAppScreen';
import type { UI_STATE, _3rdPartyData } from '../types';

import { connectAppWithWalletConnect } from '/modules/wallet-connect/connectAppWithWalletConnect';

export const useConnectApp3rdPartyAPI = (
  _3rdPartyAPI: ConnectWalletConnectAppParams,
  setUIState: React.Dispatch<React.SetStateAction<UI_STATE>>,
): _3rdPartyData => {
  const [_3rdPartyAPIData, set3rdPartyAPIData] = useState<_3rdPartyData>({});
  const allWalletsForCurrentAccount = useRealmWallets();
  const currentAccountNumber = useCurrentAccountNumber();
  const realm = useRealm();
  const unencryptedRealm = useUnencryptedRealm();
  const { getSeed } = useSecuredKeychain();
  const { dispatch, goBack } = useNavigation();
  const [isInAppBrowserOpen] = useGlobalState('isInAppBrowserOpen');

  useEffect(() => {
    (async () => {
      if ('walletConnectV2' in _3rdPartyAPI) {
        const __3rdPartyAPIData = await connectAppWithWalletConnect(_3rdPartyAPI.walletConnectV2.proposal, setUIState, {
          dispatch,
          goBack,
          realm,
          unencryptedRealm,
          wallets: allWalletsForCurrentAccount,
          getSeed,
          isInAppBrowserOpen,
        });

        set3rdPartyAPIData(__3rdPartyAPIData);
        return;
      }
    })();
  }, [allWalletsForCurrentAccount, currentAccountNumber, dispatch, goBack, realm, unencryptedRealm, setUIState, _3rdPartyAPI, getSeed, isInAppBrowserOpen]);

  return _3rdPartyAPIData;
};
