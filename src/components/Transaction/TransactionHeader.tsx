import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimateStyle } from 'react-native-reanimated';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import { SvgIcon } from '@/components/SvgIcon';
import type { WalletType } from '@/onChain/wallets/registry';
import { useTheme } from '@/theme/themes';

import { TransactionBadge } from './TransactionBadge';

type Props = {
  collapsibleSectionStyle?: StyleProp<AnimateStyle<StyleProp<ViewStyle>>>;
  heading: string | string[];
  asset?: {
    uri: string;
    network: WalletType;
    size?: number;
  };
  useFallbackIcon?: boolean;
  date?: string | undefined;
  name?: string;
  url?: string;
  badge?: ComponentProps<typeof TransactionBadge>['type'] | undefined;
  testID?: string;
};

export const TransactionHeader = ({ collapsibleSectionStyle, useFallbackIcon, url, asset, name, heading, date, badge, testID }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.header} testID={testID}>
      {}
      <Animated.View style={[styles.collapsibleSection, collapsibleSectionStyle]}>
        {!!useFallbackIcon && (
          <MaskedElementWithCoin
            size={64}
            maskShape="rounded-square"
            coinSize={0}
            coinType={'walletTypeUnknown'}
            maskedElement={<SvgIcon name="sheet" color="light100" size={40} style={[styles.fallbackIcon, { backgroundColor: colors.light15 }]} />}
          />
        )}
        {!useFallbackIcon && !!asset && (
          <MaskedElementWithCoin
            size={64}
            maskShape="rounded-square"
            coinSize={20}
            coinType={asset.network}
            maskedElement={<ImageSvg uri={asset.uri} width={64} height={64} />}
          />
        )}
        {!!name && (
          <Label type="boldTitle1" style={styles.headerName}>
            {name}
          </Label>
        )}
        {!!url && (
          <Label type="regularCaption1" color="light75" style={styles.url} numberOfLines={1}>
            {url}
          </Label>
        )}
      </Animated.View>

      <Label type="boldDisplay4" style={styles.heading} numberOfLines={1}>
        {heading}
      </Label>
      {!!date && (
        <Label type="regularCaption1" color="light75" style={styles.date}>
          {date}
        </Label>
      )}
      {!!badge && <TransactionBadge type={badge} />}
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackIcon: {
    width: 64,
    height: 64,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 8,
    marginBottom: 10,
  },
  collapsibleSection: {
    alignItems: 'center',
  },
  headerName: {
    marginTop: 8,
    marginBottom: 4,
  },
  url: {
    marginBottom: 12,
  },
  heading: {
    marginTop: 12,
  },
  date: {
    marginVertical: 4,
  },
});
