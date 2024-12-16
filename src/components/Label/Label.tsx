import type { TextProps } from 'react-native';

import type { AnimatedProps } from 'react-native-reanimated';

import { Fragment } from 'react';
import { Platform } from 'react-native';

import Animated from 'react-native-reanimated';

import type { Theme } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

export type TypographyKey = keyof typeof Typography;

export type LabelProps = AnimatedProps<TextProps> & {
  theme?: Theme;
  color?: keyof Theme['colors'];
  type?: TypographyKey;
  boldType?: TypographyKey;
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
  boldDisplay5: { fontSize: 22, fontFamily: Fonts.Celias.bold, lineHeight: 32 },
  boldTitle0: { fontSize: 20, fontFamily: Fonts.Celias.bold },
  boldTitle1: { fontSize: 18, fontFamily: Fonts.Celias.bold },
  boldTitle2: { fontSize: 16, fontFamily: Fonts.Celias.bold },
  boldBody: { fontSize: 15, fontFamily: Fonts.IBMPlexSans.bold, lineHeight: 22 },
  boldCaption1: { fontSize: 13, fontFamily: Fonts.IBMPlexSans.bold },
  boldCaption2: { fontSize: 11, fontFamily: Fonts.IBMPlexSans.bold, textTransform: 'uppercase', letterSpacing: 1 },
  boldMonospace: { fontSize: 13, fontFamily: Fonts.IBMPlexMono.bold },
  boldLargeMonospace: { fontSize: 15, fontFamily: Fonts.IBMPlexMono.bold },
  mediumBody: { fontSize: 15, fontFamily: Fonts.IBMPlexSans.semiBold, lineHeight: 22 },
  mediumCaption1: { fontSize: 13, fontFamily: Fonts.IBMPlexSans.semiBold, lineHeight: 22 },
  mediumCaption2: { fontSize: 11, fontFamily: Fonts.IBMPlexSans.semiBold },
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
  headerMarketDataPrice: { fontSize: 24, fontFamily: Fonts.IBMPlexSans.bold, lineHeight: 31 },
  boldTitleMarketDataPercentage: { fontSize: 18, fontFamily: Fonts.IBMPlexSans.bold, letterSpacing: -0.5, lineHeight: 25 },
  boldTitleMarketDataPercentageLarge: { fontSize: 28, fontFamily: Fonts.IBMPlexSans.bold, letterSpacing: -0.2 },
} as const;

const boldMapping: Partial<Record<TypographyKey, TypographyKey>> = {
  regularCaption1: 'boldCaption1',
  regularCaption2: 'boldCaption2',
  regularBody: 'boldBody',
  regularTitle1: 'boldTitle1',
  regularTitle2: 'boldTitle2',
  regularMonospace: 'boldMonospace',
  regularLargeMonospace: 'boldLargeMonospace',
};

const parseTextWithBold = (text: string) => {
  const regex = /<b>(.*?)<\/b>/g;
  const parts: (string | { bold: true; text: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ bold: true, text: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.map((part, index) => {
    if (typeof part === 'string') {
      return { key: `${index}-text`, bold: false, text: part };
    }
    return { ...part, key: `${index}-bold` };
  });
};

export const Label = ({ children: _children, color, type = 'boldBody', boldType, style, testID, ...props }: LabelProps) => {
  const { colors } = useTheme();

  const renderParsedChildren = (children: LabelProps['children']): LabelProps['children'] => {
    if (Array.isArray(children)) {
      return <>{children.map(renderParsedChildren)}</>;
    }

    if (typeof children === 'string') {
      const parts = parseTextWithBold(children);
      return parts.map(part => {
        if (part.bold) {
          return (
            <Animated.Text {...props} style={Typography[boldType || boldMapping[type] || type]} key={part.key}>
              {part.text}
            </Animated.Text>
          );
        }
        return <Fragment key={part.key}>{part.text}</Fragment>;
      });
    }

    return children;
  };

  const parsedChildren = renderParsedChildren(_children);

  return (
    <Animated.Text {...props} style={[Typography[type], style, { color: colors[color || 'light100'] }]} testID={testID}>
      {parsedChildren}
    </Animated.Text>
  );
};
