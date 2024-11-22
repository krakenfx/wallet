import type React from 'react';

import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';

import { useTheme } from '@/theme/themes';

import loc from '/loc';

export const UnsupportedRoute: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.light8 }]}>
      <SvgIcon size={20} name="error" color="light50" />
      <View style={styles.text}>
        <Label type="regularCaption1" color="light75">
          {loc.swap.route.unsupportedRoute.title}
        </Label>
        <Label type="regularCaption1" color="light75">
          {loc.swap.route.unsupportedRoute.desc}
        </Label>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
  text: {
    gap: 24,
    flex: 1,
  },
});
