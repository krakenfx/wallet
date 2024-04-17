import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Switch } from '@/components/Switch';
import { useTheme } from '@/theme/themes';

type Props = { content: ReactElement; value: boolean; onToggle: (newValue: boolean) => void };

export const ReputationFilterItem = ({ content, value, onToggle }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <GradientItemBackground />
      {content}
      <Switch trackColor={{ true: colors.kraken }} value={value} onValueChange={onToggle} accessible accessibilityRole="switch" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});
