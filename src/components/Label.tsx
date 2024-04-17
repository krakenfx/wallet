import React from 'react';
import { Platform, TextProps } from 'react-native';
import Animated, { AnimateProps } from 'react-native-reanimated';

import { Theme, useTheme } from '@/theme/themes';

export type TypographyKey = keyof typeof Typography;

export type LabelProps = AnimateProps<TextProps> & {
  theme?: Theme;
  color?: keyof Theme['colors'];
  type?: TypographyKey;
};

const Fonts = {
  Celias: {
    regular: 'Celias',
    light: 'Celias-Light',
    medium: 'Celias-Medium',
    bold: 'Celias-Bold',
  },
  IBMPlexSans: Platform.select({
    ios: {
      regular: 'IBMPlexSans',
      semiBold: 'IBMPlexSans-SmBld',
      bold: 'IBMPlexSans-Bold',
    },
    android: {
      regular: 'IBM-Plex-Sans-Regular',
      semiBold: 'IBM-Plex-Sans-SemiBold',
      bold: 'IBM-Plex-Sans-Bold',
    },
  })!,
  IBMPlexMono: Platform.select({
    ios: {
      regular: 'IBMPlexMono',
      semiBold: 'IBMPlexMono-SmBld',
      bold: 'IBMPlexMono-Bold',
    },
    android: {
      regular: 'IBM-Plex-Mono-Regular',
      semiBold: 'IBM-Plex-Mono-SemiBold',
      bold: 'IBM-Plex-Mono-Bold',
    },
  })!,
};

export const Typography = {
  boldDisplay1: { fontSize: 56, fontFamily: Fonts.Celias.bold },
  boldDisplay2: { fontSize: 36, fontFamily: Fonts.Celias.bold },
  boldDisplay3: { fontSize: 28, fontFamily: Fonts.Celias.bold },
  boldDisplay4: { fontSize: 24, fontFamily: Fonts.Celias.bold },
  boldTitle0: { fontSize: 20, fontFamily: Fonts.Celias.bold },
  boldTitle1: { fontSize: 18, fontFamily: Fonts.Celias.bold },
  boldTitle2: { fontSize: 16, fontFamily: Fonts.Celias.bold },
  boldBody: { fontSize: 15, fontFamily: Fonts.IBMPlexSans.bold, lineHeight: 22 },
  boldCaption1: { fontSize: 13, fontFamily: Fonts.IBMPlexSans.bold },
  boldCaption2: { fontSize: 11, fontFamily: Fonts.IBMPlexSans.bold, textTransform: 'uppercase', letterSpacing: 1 },
  boldMonospace: { fontSize: 13, fontFamily: Fonts.IBMPlexMono.bold },
  boldLargeMonospace: { fontSize: 15, fontFamily: Fonts.IBMPlexMono.bold },
  mediumBody: { fontSize: 15, fontFamily: Fonts.IBMPlexSans.semiBold, lineHeight: 22 },
  regularTitle1: { fontSize: 18, fontFamily: Fonts.Celias.regular, lineHeight: 26 },
  regularTitle2: { fontSize: 16, fontFamily: Fonts.Celias.regular },
  regularBody: { fontSize: 15, fontFamily: Fonts.IBMPlexSans.regular, lineHeight: 22 },
  regularCaption1: { fontSize: 13, fontFamily: Fonts.IBMPlexSans.regular },
  regularCaption2: { fontSize: 12, fontFamily: Fonts.IBMPlexSans.regular, textTransform: 'uppercase', letterSpacing: 1 },
  regularMonospace: { fontSize: 13, fontFamily: Fonts.IBMPlexMono.regular },
  regularLargeMonospace: { fontSize: 16, fontFamily: Fonts.IBMPlexMono.regular },

  headerBalance: { fontSize: 56, fontFamily: Fonts.IBMPlexSans.bold },
  headerWalletConnectTutorial: { fontSize: 36, fontFamily: Fonts.IBMPlexSans.bold, lineHeight: 42 },
  headerBalanceTicker: { fontSize: 24, fontFamily: Fonts.Celias.medium },
};

export const Label = ({ children, color, type, style, testID, ...props }: LabelProps) => {
  const { colors } = useTheme();

  return (
    <Animated.Text {...props} style={[Typography[type || 'boldBody'], style, { color: colors[color || 'light100'] }]} testID={testID}>
      {children}
    </Animated.Text>
  );
};
