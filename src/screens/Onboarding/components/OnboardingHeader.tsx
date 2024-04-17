import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

interface OnboardingHeaderProps {
  title: React.ReactNode;
  caption: React.ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
  testID?: string;
}

export const OnboardingHeader = ({ title, caption, onLayout, testID = 'OnboardingViewHeader' }: OnboardingHeaderProps) => {
  return (
    <View style={styles.wrapper} testID={testID} onLayout={onLayout}>
      <Label type="boldDisplay4" style={styles.title}>
        {title}
      </Label>

      <Label type="regularTitle1" color="light50" style={styles.caption}>
        {caption}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 24,
  },
  title: {
    marginTop: 12,
  },
  caption: {
    marginTop: 8,
  },
});
