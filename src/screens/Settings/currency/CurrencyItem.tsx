import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';

import { CurrencyIcon } from './CurrencyIcon';

import { getCurrencyInfo, getLocalizedCurrencyName } from './types';

import type { Currency } from './types';

interface Props {
  currency: Currency;
  isHighlighted?: boolean;
  onPress: (currency: Currency) => void;
}

export const CurrencyItem = ({ currency, isHighlighted, onPress }: Props) => {
  const currencyInfo = getCurrencyInfo(currency);

  const handleOnPress = () => {
    onPress(currency);
  };

  return (
    <Touchable style={styles.container} onPress={handleOnPress}>
      {isHighlighted && <GradientItemBackground />}

      <CurrencyIcon sign={currencyInfo.sign} />
      <View>
        <Label type="boldTitle2" style={styles.label}>
          {getLocalizedCurrencyName(currency)}
        </Label>
        <Label type="regularMonospace" color="light75">
          {currencyInfo.symbol}
        </Label>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    padding: 12,
    marginBottom: 1,
    overflow: 'hidden',
    borderRadius: 16,
  },
  label: {
    flexGrow: 1,
  },
  spaceElement: {
    marginRight: 12,
  },
});
