import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';

interface Props {
  isFirst?: boolean;
  isLast?: boolean;
  isHighlighted?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SettingsBox: FC<Props> = ({ isFirst, isHighlighted, isLast, children, style }) => {
  const borderTopRadius = isFirst ? { borderTopLeftRadius: 16, borderTopRightRadius: 16 } : {};
  const borderBottomRadius = isLast ? { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 } : {};
  const containerStyle = [styles.container, borderTopRadius, borderBottomRadius, style];

  return (
    <View style={containerStyle}>
      {isHighlighted && <GradientItemBackground />}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 12,
    marginBottom: 1,
  },
});
