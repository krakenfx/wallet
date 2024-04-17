import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useLocalStateUpdate } from '@/hooks/useLocalStateUpdate';
import { useSettingsMutations } from '@/realm/settings';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';

import { CurrencyItem } from './currency/CurrencyItem';
import { Currency, getCurrencyInfo } from './currency/types';

import loc from '/loc';

export const CurrencyScreen = () => {
  useHeaderTitle(loc.settings.currency);
  const insets = useSafeAreaInsets();
  const currencies = Object.values(Currency);
  const { setAppCurrency } = useSettingsMutations();
  const { currency: appCurrency } = useAppCurrency();
  const [currency, onCurrencyChange] = useLocalStateUpdate(appCurrency, setAppCurrency);

  return (
    <GradientScreenView>
      <ScrollView testID="Settings" style={styles.scroll} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {currencies.map(curr => (
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
