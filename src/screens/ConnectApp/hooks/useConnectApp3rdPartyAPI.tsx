import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { useCurrentAccountNumber } from '@/realm/accounts';
import { useRealm } from '@/realm/RealmContext';

import { useRealmWallets } from '@/realm/wallets';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { ConnectAppParams } from '../ConnectAppScreen';
import { UI_STATE, _3rdPartyData } from '../types';

import { connectAppWithWalletConnect } from '/modules/wallet-connect/connectAppWithWalletConnect';

export const useConnectApp3rdPartyAPI = (_3rdPartyAPI: ConnectAppParams, setUIState: React.Dispatch<React.SetStateAction<UI_STATE>>): _3rdPartyData => {
  const [_3rdPartyAPIData, set3rdPartyAPIData] = useState<_3rdPartyData>({});
  const allWalletsForCurrentAccount = useRealmWallets();
  const currentAccountNumber = useCurrentAccountNumber();
  const realm = useRealm();
  const { getSeed } = useSecuredKeychain();
  const { dispatch, goBack } = useNavigation();

  useEffect(() => {
    (async () => {
      if ('walletConnectV2' in _3rdPartyAPI) {
        const __3rdPartyAPIData = await connectAppWithWalletConnect(_3rdPartyAPI.walletConnectV2.proposal, setUIState, {
          dispatch,
          goBack,
          realm,
          wallets: allWalletsForCurrentAccount,
          getSeed,
        });

        set3rdPartyAPIData(__3rdPartyAPIData);
        return;
      }

      
    })();

    return () => {
      
    };
  }, [allWalletsForCurrentAccount, currentAccountNumber, dispatch, goBack, realm, setUIState, _3rdPartyAPI, getSeed]);

  return _3rdPartyAPIData;
};
