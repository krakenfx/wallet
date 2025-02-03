import { useCallback } from 'react';
import Realm from 'realm';

import type { Currency } from '@/screens/Settings/currency';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { useAssetMarketDataMutations } from '../assetMarketData';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useWalletsMutations } from '../wallets';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from './schema';

import type { RealmSettings, SettingsType } from './schema';

export const useSettingsMutations = () => {
  const { runInTransaction } = useRealmTransaction();
  const { enableTestnetWallets, disableTestnetWallets } = useWalletsMutations();
  const { deleteAllAssetMarketData } = useAssetMarketDataMutations();
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

  const removeSettings = useCallback(
    <T extends keyof SettingsType>(name: T) => {
      runInTransaction(realm => {
        const settings = realm.objectForPrimaryKey(REALM_TYPE_SETTINGS, name);
        if (settings) {
          realm.delete(settings);
        }
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

  const setWalletConnectExplainerTaskCompleted = useCallback(() => {
    setSettings(RealmSettingsKey.walletConnectTaskCompleted, true);
  }, [setSettings]);

  const setAppCurrency = useCallback(
    (value: Currency) => {
      setSettings(RealmSettingsKey.currency, value);
      deleteAllAssetMarketData();
    },
    [deleteAllAssetMarketData, setSettings],
  );

  const setHasViewedWalletBackupPrompt = useCallback(
    (value: boolean) => {
      setSettings(RealmSettingsKey.hasViewedWalletBackupPrompt, value);
    },
    [setSettings],
  );

  const setHasAcceptedExploreWarning = useCallback(
    (value: boolean) => {
      setSettings(RealmSettingsKey.hasAcceptedExploreWarning, value);
    },
    [setSettings],
  );

  const setCloudBackupCompleted = useCallback(
    (credentialID: string) => {
      setSettings(RealmSettingsKey.cloudBackupCredentialID, credentialID);
    },
    [setSettings],
  );

  const removeCloudBackup = useCallback(() => {
    runInTransaction(() => {
      removeSettings(RealmSettingsKey.cloudBackupCredentialID);
      removeSettings(RealmSettingsKey.isCloudBackupDismissed);
    });
  }, [removeSettings, runInTransaction]);

  const setCloudBackupDismissed = useCallback(() => {
    setSettings(RealmSettingsKey.isCloudBackupDismissed, true);
  }, [setSettings]);

  const setManualBackupDismissed = useCallback(() => {
    setSettings(RealmSettingsKey.isManualBackupDismissed, true);
  }, [setSettings]);

  const setManualBackupCompleted = useCallback(() => {
    setSettings(RealmSettingsKey.isWalletBackupDone, true);
  }, [setSettings]);

  const setHideBalances = useCallback(
    (value: boolean) => {
      setSettings(RealmSettingsKey.hideBalances, value);
    },
    [setSettings],
  );

  return {
    setSettings,
    setAccountNumber,
    setIsTestnetEnabled,
    setPushPromptNeeded,
    setAppCurrency,
    setWalletConnectExplainerTaskCompleted,
    setHasViewedWalletBackupPrompt,
    setHasAcceptedExploreWarning,
    setHideBalances,
    setCloudBackupCompleted,
    setCloudBackupDismissed,
    setManualBackupDismissed,
    setManualBackupCompleted,
    removeCloudBackup,
    removeSettings,
  };
};
