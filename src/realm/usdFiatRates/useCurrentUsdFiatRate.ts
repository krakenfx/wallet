import { useCallback, useMemo } from 'react';

import { useObject, useQuery } from '@/realm/RealmContext';
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

export const useGetFiatRateForCurrency = () => {
  const query = useQuery<RealmFiatRates>(REALM_TYPE_FIAT_RATES);

  const getFiatRateForCurrency = useCallback(
    (currency: Currency) => {
      const results = query.filtered('iso = $0', currency);
      return results.length === 0 ? null : results[0];
    },
    [query],
  );

  return useMemo(
    () => ({
      getFiatRateForCurrency,
    }),
    [getFiatRateForCurrency],
  );
};
