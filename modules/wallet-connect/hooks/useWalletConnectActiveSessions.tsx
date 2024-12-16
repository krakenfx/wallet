import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRealm } from '@/realm/RealmContext';
import { useRealmWallets } from '@/realm/wallets/useWallets';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { useUnencryptedRealm } from '@/unencrypted-realm/RealmContext';

import type { IWalletKit } from '@reown/walletkit';
import type { SessionTypes } from '@walletconnect/types';

import { WalletConnectSessionsManager, deleteStaleSessionsFromRealm, initWalletConnectWeb3Wallet } from '/modules/wallet-connect';

export const useWalletConnectActiveSessions = (
  accountIdx: number,
): [activeSessions: SessionTypes.Struct[], setActiveSessions: React.Dispatch<React.SetStateAction<SessionTypes.Struct[]>>] => {
  const realm = useRealm();
  const unencryptedRealm = useUnencryptedRealm();
  const { dispatch } = useNavigation();
  const { getSeed } = useSecuredKeychain();
  const web3WalletRef = useRef<IWalletKit | null>(null);
  const [activeSessions, setActiveSessions] = useState<SessionTypes.Struct[]>([]);
  const accountWallets = useRealmWallets(false, accountIdx);
  const getAccountSessions = useCallback(
    async () => {
      if (web3WalletRef.current) {
        deleteStaleSessionsFromRealm(realm, web3WalletRef.current);
      }
      setActiveSessions(Object.values(await WalletConnectSessionsManager.getAccountSessions(accountWallets)));
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountWallets],
  );

  useEffect(() => {
    initWalletConnectWeb3Wallet(realm, unencryptedRealm, dispatch, getSeed).then(web3Wallet => {
      web3WalletRef.current = web3Wallet;

      web3WalletRef.current.on('session_delete', getAccountSessions);
      web3WalletRef.current.core.pairing.events.on('pairing_delete', getAccountSessions);
      web3WalletRef.current.core.pairing.events.on('pairing_expire', getAccountSessions);
    });

    return () => {
      web3WalletRef.current?.off('session_delete', getAccountSessions);
      web3WalletRef.current?.core?.pairing?.events?.off('pairing_delete', getAccountSessions);
      web3WalletRef.current?.core?.pairing?.events?.off('pairing_expire', getAccountSessions);
    };
  }, [getAccountSessions, dispatch, realm, unencryptedRealm, getSeed]);

  useFocusEffect(
    useCallback(() => {
      getAccountSessions();
    }, [getAccountSessions]),
  );

  return [activeSessions, setActiveSessions];
};
