import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

import { useCurrentAccountNumber } from '@/realm/accounts';
import { useRealm } from '@/realm/RealmContext';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { useUnencryptedRealm } from '@/unencrypted-realm/RealmContext';

import { initWalletConnectWeb3Wallet } from '/modules/wallet-connect';

export const useInitWalletConnect = () => {
  const currentAccountNumber = useCurrentAccountNumber();
  const { dispatch } = useNavigation();
  const realm = useRealm();
  const unencryptedRealm = useUnencryptedRealm();
  const { getSeed } = useSecuredKeychain();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      initWalletConnectWeb3Wallet(realm, unencryptedRealm, dispatch, getSeed);
    });
  }, [currentAccountNumber, dispatch, realm, unencryptedRealm, getSeed]);
};
