import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';

interface MarketDataItemProps {
  label: string;
  value?: string;
  isRow?: boolean;
}
export const GeneralMarketDataItem = ({ label, value, isRow }: MarketDataItemProps) => {
  const displayValue = value ?? '-';
  return (
    <View style={[isRow ? styles.rowContainer : styles.columnContainer]}>
      <Label type="regularCaption1" color={isRow ? 'light50' : 'light75'} numberOfLines={1} style={[!isRow && styles.labelColumn]}>
        {label}
      </Label>
      {value ? (
        <Label entering={FadeIn.duration(800)} type="boldCaption1" color="light100" style={[isRow && styles.alignRight]} numberOfLines={1}>
          {displayValue}
        </Label>
      ) : (
        <Label key="empty" type="boldCaption1" color="light100" style={[isRow && styles.alignRight]}>
          {displayValue}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    flexBasis: '50%',
  },
  labelColumn: {
    marginBottom: 2,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignRight: {
    textAlign: 'right',
    flexGrow: 1,
  },
});
