import { useCallback } from 'react';
import Realm from 'realm';

import { Currency } from '@/screens/Settings/currency';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useWalletsMutations } from '../wallets';

import { REALM_TYPE_SETTINGS, RealmSettings, RealmSettingsKey, SettingsType } from './schema';

export const useSettingsMutations = () => {
  const { runInTransaction } = useRealmTransaction();
  const { enableTestnetWallets, disableTestnetWallets } = useWalletsMutations();
  const { getSeed } = useSecuredKeychain();
  const setSettings = useCallback(
    <T extends keyof SettingsType>(name: T, value: SettingsType[T]) => {
      runInTransaction(realm => {
        realm.create<RealmSettings>(
          REALM_TYPE_SETTINGS,
          {
            name,
            value,
          },
          Realm.UpdateMode.Modified,
        );
      });
    },
    [runInTransaction],
  );

  const setAccountNumber = useCallback(
    (value: number) => {
      setSettings(RealmSettingsKey.accountNumber, value);
    },
    [setSettings],
  );

  const setIsTestnetEnabled = useCallback(
    async (value: boolean) => {
      if (value) {
        const seed = await getSeed('createWallet', true);
        enableTestnetWallets(seed);
      } else {
        disableTestnetWallets();
      }
      setSettings(RealmSettingsKey.isTestnetEnabled, value);
    },
    [disableTestnetWallets, enableTestnetWallets, getSeed, setSettings],
  );

  const setPushPromptNeeded = useCallback(
    (value: boolean) => {
      setSettings(RealmSettingsKey.isPushPromptNeeded, value);
    },
    [setSettings],
  );

  const setWalletConnectExplainerNeeded = useCallback(
    (value: boolean) => {
      setSettings(RealmSettingsKey.walletConnectExplainerNeeded, value);
    },
    [setSettings],
  );

  const setAppCurrency = useCallback(
    (value: Currency) => {
      setSettings(RealmSettingsKey.currency, value);
    },
    [setSettings],
  );

  return {
    setSettings,
    setAccountNumber,
    setIsTestnetEnabled,
    setPushPromptNeeded,
    setAppCurrency,
    setWalletConnectExplainerNeeded,
  };
};
