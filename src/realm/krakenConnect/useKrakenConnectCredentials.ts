import { RealmSettingsKey, useSettingsByKey } from '@/realm/settings';

export const useKrakenConnectCredentials = () => {
  const apiKey = useSettingsByKey(RealmSettingsKey.krakenConnectApiKey);
  const apiSecret = useSettingsByKey(RealmSettingsKey.krakenConnectApiSecretKey);
  return {
    API_KEY: apiKey as string,
    API_SECRET: apiSecret as string,
  };
};
