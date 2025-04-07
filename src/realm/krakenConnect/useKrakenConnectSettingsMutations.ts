import { useCallback } from 'react';
import Realm from 'realm';

import { useCurrentAccountNumber } from '@/realm/accounts';
import { useRealmTransaction } from '@/realm/hooks/useRealmTransaction';
import { type KrakenConnectSettings, type KrakenConnectSettingsType, REALM_TYPE_KRAKEN_CONNECT_SETTINGS } from '@/realm/krakenConnect/schema';
import { useRealm } from '@/realm/RealmContext';

export const useKrakenConnectSettingsMutations = () => {
  const realm = useRealm();
  const currentAccountNumber = useCurrentAccountNumber();
  const { runInTransaction } = useRealmTransaction();

  const getKrakenConnectSetting = useCallback(
    (type: KrakenConnectSettingsType) => {
      const obj = realm.objectForPrimaryKey<KrakenConnectSettings>(REALM_TYPE_KRAKEN_CONNECT_SETTINGS, type);
      return obj ? obj.value : [];
    },
    [realm],
  );

  const setKrakenConnectSetting = useCallback(
    (type: KrakenConnectSettingsType, value: number[]) => {
      runInTransaction(realm => {
        realm.create<KrakenConnectSettings>(
          REALM_TYPE_KRAKEN_CONNECT_SETTINGS,
          {
            name: type,
            value,
          },
          Realm.UpdateMode.Modified,
        );
      });
    },
    [runInTransaction],
  );

  const setExchangeConnectForAccount = useCallback(
    (selectedAccount = currentAccountNumber) => {
      const exchangeAccounts = getKrakenConnectSetting('accountsConnected');
      const ids = new Set([...exchangeAccounts, selectedAccount]);
      setKrakenConnectSetting('accountsConnected', Array.from(ids));
    },
    [currentAccountNumber, getKrakenConnectSetting, setKrakenConnectSetting],
  );

  const setExchangeCtasHidden = useCallback(
    (selectedAccount = currentAccountNumber) => {
      const hiddenOnAccounts = getKrakenConnectSetting('dismissedCta');
      const ids = new Set([...hiddenOnAccounts, selectedAccount]);
      setKrakenConnectSetting('dismissedCta', Array.from(ids));
    },
    [currentAccountNumber, getKrakenConnectSetting, setKrakenConnectSetting],
  );

  const clearKrakenConnectedAccounts = useCallback(() => {
    runInTransaction(() => {
      setKrakenConnectSetting('accountsConnected', []);
    });
  }, [runInTransaction, setKrakenConnectSetting]);

  return {
    setExchangeConnectForAccount,
    setExchangeCtasHidden,
    clearKrakenConnectedAccounts,
    getKrakenConnectSetting,
    setKrakenConnectSetting,
  };
};
