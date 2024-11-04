import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';

interface Props {
  text: string;
  isCircle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const BADGE_SIZE = 28;
export const SettingsTextBadge = ({ text, isCircle, containerStyle }: Props) => {
  const { colors } = useTheme();

  const style = isCircle ? { width: BADGE_SIZE } : { paddingHorizontal: 14 };

  return (
    <View style={[styles.badge, { backgroundColor: colors.light15 }, style, containerStyle]}>
      <Label type="boldCaption1" color="light100" style={styles.text}>
        {text}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 18,
    height: BADGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    lineHeight: 17,
  },
});
