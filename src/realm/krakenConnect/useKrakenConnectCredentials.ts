import { RealmSettingsKey, useSettingsByKey } from '@/realm/settings';

import { useObject } from '../RealmContext';

import { KRAKEN_CONNECT_CREDENTIALS_REALM_KEY, type KrakenConnectCredentials, REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS } from './schema';

export const useKrakenConnectCredentials = () => {
  const keys = useObject<KrakenConnectCredentials>(REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS, KRAKEN_CONNECT_CREDENTIALS_REALM_KEY, 'primaryKey');
  const apiKey = keys?.apiKey ?? '';
  const apiPrivateKey = keys?.apiPrivateKey ?? '';

  const manualApiKey = useSettingsByKey(RealmSettingsKey.krakenConnectApiKey);
  const manualApiSecret = useSettingsByKey(RealmSettingsKey.krakenConnectApiSecretKey);

  const cfToken = useSettingsByKey(RealmSettingsKey.krakenConnectCFToken);
  return {
    API_KEY: manualApiKey || apiKey,
    API_SECRET: manualApiSecret || apiPrivateKey,
    CF_TOKEN: cfToken as string,
  };
};
