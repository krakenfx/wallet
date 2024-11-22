import type { PropsWithChildren } from 'react';

import type React from 'react';
import type { StyleProp, TextProps, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Label } from '@/components/Label';
import { LargeHeader } from '@/components/LargeHeader';

interface Props {
  title: string;
  subtitle: string;
  text?: TextProps['children'];
  caption?: TextProps['children'];
  testID?: string;
  style?: StyleProp<ViewStyle>;
  largeHeaderStyle?: StyleProp<ViewStyle>;
}

export const LargeHeaderPage: React.FC<PropsWithChildren<Props>> = ({ title, subtitle, text, caption, children, testID, style, largeHeaderStyle }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { marginTop: insets.top }, style]} testID={testID}>
      <LargeHeader title={title} style={largeHeaderStyle}>
        <Label style={styles.subtitle} adjustsFontSizeToFit type="boldDisplay1" numberOfLines={1}>
          {subtitle}
        </Label>
        <Label type="regularTitle1" style={styles.title} color="light75">
          {text}
        </Label>
        {!!caption && (
          <Label type="regularCaption1" style={styles.title} color="light75">
            {caption}
          </Label>
        )}
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
