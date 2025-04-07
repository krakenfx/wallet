import type { ReactElement } from 'react';

import { StyleSheet, type TextStyle, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';

interface MarketDataItemProps {
  label: string;
  onPress?: () => void;
  prefix?: ReactElement;
  value?: string | number;
  style?: TextStyle;
  testID?: string;
}
export const DefiDetailsInfoItem = ({ label, onPress, prefix, value, style, testID }: MarketDataItemProps) => {
  return (
    <Touchable style={styles.container} onPress={onPress} disabled={!onPress} testID={testID}>
      <Label type="regularCaption1" color="light50" numberOfLines={1}>
        {label}
      </Label>
      {value ? (
        <View style={styles.value}>
          {!!prefix && <View>{prefix}</View>}
          <Label entering={FadeIn.duration(800)} type="boldBody" color="light100" style={style} numberOfLines={1}>
            {value}
            {!!onPress && <SvgIcon name="chevron-right" size={16} color="light75" />}
          </Label>
        </View>
      ) : (
        <Label key="empty" type="boldBody" color="light100">
          {'-'}
        </Label>
      )}
    </Touchable>
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
