import { useMemo } from 'react';

import { useObject } from '@/realm/RealmContext';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import type { RealmFiatRates } from '@/realm/usdFiatRates/schema';
import { REALM_TYPE_FIAT_RATES } from '@/realm/usdFiatRates/schema';
import { Currency } from '@/screens/Settings/currency';

export const useCurrentUsdFiatRate = () => {
  const { currency } = useAppCurrency();
  const fiatRate = useObject<RealmFiatRates>(REALM_TYPE_FIAT_RATES, currency, 'iso');
  return useMemo(() => {
    if (currency === Currency.USD || !fiatRate) {
      return 1;
    }
    return parseFloat(fiatRate.value);
  }, [currency, fiatRate]);
};
