import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

import { useCurrentAccountNumber } from '@/realm/accounts';
import { useRealm } from '@/realm/RealmContext';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { initWalletConnectWeb3Wallet } from '/modules/wallet-connect';

export const useInitWalletConnect = () => {
  const currentAccountNumber = useCurrentAccountNumber();
  const { dispatch } = useNavigation();
  const realm = useRealm();
  const { getSeed } = useSecuredKeychain();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      initWalletConnectWeb3Wallet(realm, dispatch, getSeed);
    });
  }, [currentAccountNumber, dispatch, realm, getSeed]);
};
