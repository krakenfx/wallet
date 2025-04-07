import { useCallback } from 'react';

import { deleteFundingAddresses } from '@/api/krakenConnect/deleteFundingAddresses';
import { useCurrentAccountNumber } from '@/realm/accounts';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';
import { useKrakenConnectMutations } from '@/realm/krakenConnect/useKrakenConnectMutation';
import { useKrakenConnectSettingsMutations } from '@/realm/krakenConnect/useKrakenConnectSettingsMutations';

export const useKrakenConnectClear = () => {
  const { API_KEY, API_SECRET } = useKrakenConnectCredentials();
  const { deleteExchangeCredentials } = useKrakenConnectMutations();
  const currentAccountNumber = useCurrentAccountNumber();
  const { clearKrakenConnectedAccounts, getKrakenConnectSetting, setKrakenConnectSetting } = useKrakenConnectSettingsMutations();

  const clearKrakenConnect = useCallback(async () => {
    await deleteFundingAddresses({ apiKey: API_KEY, privateKey: API_SECRET, deleteAll: true });
    clearKrakenConnectedAccounts();
    deleteExchangeCredentials();
  }, [API_KEY, API_SECRET, deleteExchangeCredentials, clearKrakenConnectedAccounts]);

  const removeExchangeConnectForAccount = useCallback(
    async (selectedAccount = currentAccountNumber) => {
      const exchangeAccounts = getKrakenConnectSetting('accountsConnected');
      const ids = new Set(exchangeAccounts.filter(id => id !== selectedAccount));

      if (ids.size === 0) {
        clearKrakenConnect();
      } else {
        setKrakenConnectSetting('accountsConnected', Array.from(ids));
      }
    },
    [currentAccountNumber, getKrakenConnectSetting, clearKrakenConnect, setKrakenConnectSetting],
  );

  return {
    clearKrakenConnect,
    removeExchangeConnectForAccount,
  };
};
