import type React from 'react';

import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ActivityIndicator } from '@/components/ActivityIndicator';

import { Label } from '@/components/Label';

import { type ColorName, useTheme } from '@/theme/themes';

import loc from '/loc';

type Props = {
  backgroundColor?: ColorName;
  containerStyle?: StyleProp<ViewStyle>;
};

export const LoadingBlock: React.FC<Props> = ({ backgroundColor = 'purple_20', containerStyle }) => {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, { backgroundColor: colors[backgroundColor] }, containerStyle]}>
      <ActivityIndicator />
      <Label type="boldTitle2" color="light75">
        {loc.swap.findingBestRote}
      </Label>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
});
