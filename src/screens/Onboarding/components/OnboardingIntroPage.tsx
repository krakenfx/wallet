import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, TextProps, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Label } from '@/components/Label';
import { LargeHeader } from '@/components/LargeHeader';

interface OnboardingIntroPageProps {
  title: string;
  subtitle: string;
  text?: TextProps['children'];
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export const OnboardingIntroPage: React.FC<PropsWithChildren<OnboardingIntroPageProps>> = ({ title, subtitle, text, children, testID, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { marginTop: insets.top }, style]} testID={testID}>
      <LargeHeader title={title}>
        <Label style={styles.subtitle} adjustsFontSizeToFit type="boldDisplay1" numberOfLines={1}>
          {subtitle}
        </Label>
        <Label type="regularTitle1" style={styles.title} color="light75">
          {text}
        </Label>
      </LargeHeader>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  subtitle: {
    marginTop: -8,
  },
  title: {
    marginTop: 18,
  },
});
