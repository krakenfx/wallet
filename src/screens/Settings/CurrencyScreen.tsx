import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientScreenView } from '@/components/Gradients';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useLocalStateUpdate } from '@/hooks/useLocalStateUpdate';
import { getDeviceCurrency, useAppCurrency, useLanguage, useSettingsMutations } from '@/realm/settings';
import { navigationStyle } from '@/utils/navigationStyle';

import { CurrencyItem } from './currency/CurrencyItem';
import { Currency, getCurrencyInfo, getLocalizedCurrencyName } from './currency/types';

import type { LanguageTag } from '/loc';
import loc from '/loc';

const sortCurrencies = (deviceCurrency: string, language: LanguageTag) => {
  const currencies = Object.values(Currency);

  const sortedCurrencies: Currency[] = [];

  const ALPHABETICAL_ASCENDING_INDEX = 3;

  currencies.forEach(currency => {
    if (deviceCurrency === currency) {
      sortedCurrencies[0] = currency;
      return;
    }

    if (Currency.USD === currency) {
      sortedCurrencies[1] = currency;
      return;
    }

    if (Currency.EUR === currency) {
      sortedCurrencies[2] = currency;
      return;
    }

    if (typeof sortedCurrencies[ALPHABETICAL_ASCENDING_INDEX] === 'undefined') {
      sortedCurrencies[ALPHABETICAL_ASCENDING_INDEX] = currency;
      return;
    }

    const lastSortedCurrencyName = getLocalizedCurrencyName(sortedCurrencies[sortedCurrencies.length - 1]);
    const currencyName = getLocalizedCurrencyName(currency);
    const alphabeticalComparision = currencyName.localeCompare(lastSortedCurrencyName, language);

    if (alphabeticalComparision > 0) {
      sortedCurrencies.push(currency);
      return;
    }

    if (alphabeticalComparision < 0) {
      const alphabetizedCurrencies = sortedCurrencies.slice(ALPHABETICAL_ASCENDING_INDEX);
      alphabetizedCurrencies.push(currency);
      alphabetizedCurrencies.sort((a, b) => getLocalizedCurrencyName(a).localeCompare(getLocalizedCurrencyName(b), language));
      sortedCurrencies.splice(ALPHABETICAL_ASCENDING_INDEX, Infinity, ...alphabetizedCurrencies);
      return;
    }
  });

  return sortedCurrencies;
};

export const CurrencyScreen = () => {
  useHeaderTitle(loc.settings.currency);
  const insets = useSafeAreaInsets();
  const { setAppCurrency } = useSettingsMutations();
  const { currency: appCurrency } = useAppCurrency();
  const [currency, onCurrencyChange] = useLocalStateUpdate(appCurrency, setAppCurrency);
  const language = useLanguage();
  const deviceCurrency = getDeviceCurrency();
  const sortedCurrencies = useMemo(() => sortCurrencies(deviceCurrency, language), [deviceCurrency, language]);

  return (
    <GradientScreenView>
      <ScrollView testID="Settings" style={styles.scroll} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {sortedCurrencies.map(curr => (
          <CurrencyItem key={curr} currency={curr} onPress={onCurrencyChange} isHighlighted={getCurrencyInfo(curr).symbol === currency} />
        ))}
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingHorizontal: 12,
  },
});

CurrencyScreen.navigationOptions = navigationStyle({ title: loc.settings.currency, headerTransparent: true });
