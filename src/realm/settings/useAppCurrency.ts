import { useMemo } from 'react';
import { Platform } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import type { CurrencyInfo } from '@/screens/Settings/currency';
import { Currency, getCurrencyInfo } from '@/screens/Settings/currency';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

import type { RealmSettings, SettingsType } from './schema';
import type Realm from 'realm';

type AppCurrency = {
  currency: Currency;
  currencyInfo: CurrencyInfo;
};

export const getDeviceCurrency = () => {
  const deviceCurrencies = RNLocalize.getCurrencies();
  let deviceCurrency;

  if (Platform.OS === 'ios') {
    deviceCurrency = [...deviceCurrencies].reverse().find(dc => {
      return dc in Currency;
    });
  } else {
    deviceCurrency = deviceCurrencies[0];
  }

  return Currency[deviceCurrency as Currency] || Currency.USD;
};

export const useAppCurrency = (): AppCurrency => {
  const appCurrency = useSettingsByKey(RealmSettingsKey.currency);

  return useMemo(() => {
    const currency = appCurrency || getDeviceCurrency();
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
    return getDeviceCurrency();
  }

  return results[0].value as SettingsType[RealmSettingsKey.currency];
};
