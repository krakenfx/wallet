import { StyleSheet, View } from 'react-native';

import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { SettingsTextBadge } from '@/screens/Settings/components';

export const CurrencyBadge = () => {
  const { currency, currencyInfo } = useAppCurrency();
  const text = `${currency} (${currencyInfo.sign})`;

  return (
    <View style={styles.container}>
      <SettingsTextBadge text={text} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});
