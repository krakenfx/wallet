import { useMemo } from 'react';
import Realm from 'realm';

import { Currency, CurrencyInfo, getCurrencyInfo } from '@/screens/Settings/currency';

import { REALM_TYPE_SETTINGS, RealmSettings, RealmSettingsKey, SettingsType } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

type AppCurrency = {
  currency: Currency;
  currencyInfo: CurrencyInfo;
};

export const useAppCurrency = (): AppCurrency => {
  const appCurrency = useSettingsByKey(RealmSettingsKey.currency);

  return useMemo(() => {
    const currency = appCurrency ? appCurrency : Currency.USD;
    const currencyInfo = getCurrencyInfo(currency);
    return {
      currency,
      currencyInfo,
    };
  }, [appCurrency]);
};

export const getAppCurrency = (realm: Realm) => {
  const results = realm.objects<RealmSettings>(REALM_TYPE_SETTINGS).filtered(`name = "${RealmSettingsKey.currency}"`);
  if (results.isEmpty()) {
    return Currency.USD;
  }
  return results[0].value as SettingsType[RealmSettingsKey.currency];
};
