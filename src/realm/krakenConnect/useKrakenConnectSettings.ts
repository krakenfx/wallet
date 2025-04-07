import { useMemo } from 'react';

import { type KrakenConnectSettings, type KrakenConnectSettingsType, REALM_TYPE_KRAKEN_CONNECT_SETTINGS } from '@/realm/krakenConnect/schema';
import { useObject } from '@/realm/RealmContext';

const useKrakenConnectSettings = (type: KrakenConnectSettingsType) => {
  const settingsObj = useObject<KrakenConnectSettings>(REALM_TYPE_KRAKEN_CONNECT_SETTINGS, type, 'name');
  return useMemo(() => (settingsObj ? settingsObj.value : []), [settingsObj]);
};

export const useKrakenConnectAccountsConnected = () => useKrakenConnectSettings('accountsConnected');
export const useKrakenConnectDismissedCta = () => useKrakenConnectSettings('dismissedCta');
