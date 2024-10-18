import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Typography } from '@/components/Label';
import { IconName } from '@/components/SvgIcon';
import { Networks } from '@/onChain/wallets/registry';
import { SuperDarkTheme } from '@/theme/themes';

export const baseViewStyle = StyleSheet.create({
  view: {
    padding: 30,
    justifyContent: 'center',
    flex: 1,
  },
});

export const colorsControl = {
  options: Object.keys(SuperDarkTheme.colors),
  control: { type: 'select' },
};

export const typographyControl = {
  options: Object.keys(Typography),
  control: { type: 'select' },
};

export const networkControl = {
  options: Object.keys(Networks),
  control: { type: 'select' },
};

export const ICON_OPTIONS: IconName[] = [
  'wallet',
  'shield-tick',
  'notification',
  'lock',
  'lock-unlocked',
  'clock',
  'shield',
  'key',
  'eye',
  'eye-off',
  'gear',
  'settings-slider',
  'user',
  'share',
  'download',
  'dollar',
  'bank',
  'buy',
  'gift',
  'fire',
  'redo',
  'repeat',
  'archive',
  'open-external',
  'recovery-phrase',
  'language',
  'filter',
  'sort',
  'home',
  'expand',
  'shrink',
  'search',
  'deposit',
  'swap',
  'receive',
  'send',
  'moving-up',
  'moving-down',
  'at-symbol',
  'copy',
  'paste',
  'pencil',
  'support',
  'hammer',
  'asset-list',
  'credit-card',
  'tool',
  'image',
  'camera',
  'line-chart',
  'candle-chart',
  'trash',
  'star',
  'x-circle',
  'info-circle',
  'check-circle',
  'warning',
  'sheet',
  'terms',
  'heart',
  'comment',
  'kraken',
  'star-filled',
  'no-internet',
  'error',
  'check-circle-filled',
  'warning-filled',
  'plug-disconnected',
  'plug-connected',
  'heart-filled',
  'comment-filled',
  'verified',
  'etherscan',
  'opensea',
  'ens',
  'magic-eden',
  'solscan',
  'polygonscan',
  'optimistic-etherscan',
  'arbiscan',
  'basescan',
  'blastscan',
  'mempool',
  'ethplorer',
  'dexguru',
  'blockscout',
  'solanafm',
  'threexpl',
  'zora-superscan',
  'placeholder-explorer',
  'walletconnect',
  'face-ID',
  'scan-walletConnect',
  'scan',
  'qr-code',
  'chevron-down',
  'chevron-up',
  'chevron-right',
  'chevron-left',
  'close',
  'checkmark',
  'plus',
  'apps',
  'more',
  'nft',
  'gas-fee',
  'tensor-trade',
  'web3-globe',
  'bitcoin-currency',
  'ethereum-currency',
  'connect-device',
  'help',
  'mail',
  'transfer',
  'link-x-social',
  'link-farcaster',
  'link-discord',
  'link-telegram',
  'link-reddit',
  'link-instagram',
  'link-facebook',
  'link-bitcointalk',
  'link-medium',
  'link-substack',
  'link-github',
  'link-bitbucket',
  'link-zealy',
  'asset-coin',
  'un-archive',
  'compass'
];

export const iconsControl = {
  options: ICON_OPTIONS.sort(),
  control: { type: 'select' },
};

interface SpecificPlatformOnlyStoryProps {
  platform: 'ios' | 'android';
}

export const SpecificPlatformOnlyStory: React.FC<SpecificPlatformOnlyStoryProps> = ({ platform }) => {
  return (
    <View style={[baseViewStyle.view, { alignItems: 'center' }]}>
      <Text style={{ color: 'white' }}>This component is an {platform === 'ios' ? 'iOS' : 'android'} component only</Text>
    </View>
  );
};

interface RectangleViewProps {
  description?: string;
  style?: ViewStyle;
}

export const RectangleView: React.FC<RectangleViewProps> = ({ description, style }) => {
  return <View style={[commonComponentsStyles.rectangleView, style]}>{description && <Text style={{ color: 'white' }}>{description}</Text>}</View>;
};

const commonComponentsStyles = StyleSheet.create({
  rectangleView: {
    width: '100%',
    padding: 10,
    backgroundColor: SuperDarkTheme.colors.kraken,
  },
});
