import type { ReactElement } from 'react';

import { StyleSheet, type TextStyle, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';

interface MarketDataItemProps {
  label: string;
  prefix?: ReactElement;
  value?: string | number;
  style?: TextStyle;
}
export const DefiDetailsInfoItem = ({ label, prefix, value, style }: MarketDataItemProps) => {
  return (
    <View style={styles.container}>
      <Label type="regularCaption1" color="light50" numberOfLines={1}>
        {label}
      </Label>
      {value ? (
        <View style={styles.value}>
          <View>{prefix}</View>
          <Label entering={FadeIn.duration(800)} type="boldBody" color="light100" style={style} numberOfLines={1}>
            {value}
          </Label>
        </View>
      ) : (
        <Label key="empty" type="boldBody" color="light100">
          {'-'}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  value: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
});
