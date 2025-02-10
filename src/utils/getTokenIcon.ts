import type React from 'react';
import type { SvgProps } from 'react-native-svg';

import memoize from 'lodash/memoize';

import type { WalletType } from '@/onChain/wallets/registry';

import { icons } from '/generated/assetIcons';

const mapNetworkNameToTokenSymbol: Partial<Record<WalletType, string>> = {
  arbitrum: 'arb',
  avalanche: 'avax',
  dogecoin: 'doge',
  ethereum: 'eth',
  ethereumTestnetSepolia: 'eth',
  HDsegwitBech32: 'btc',
  optimism: 'op',
  polygon: 'pol',
  solana: 'sol',
  solanaDevnet: 'sol',
};

export const getTokenIconFromNetworkName = (networkName: WalletType): React.FC<SvgProps> | undefined =>
  getTokenIcon(mapNetworkNameToTokenSymbol[networkName], networkName ?? '');

export const getTokenIcon = (symbol?: string, networkName?: string): React.FC<SvgProps> | undefined => {
  const key = `${symbol?.toLowerCase()}-${networkName?.toLowerCase()}`;
  return icons[key as keyof typeof icons];
};

const backgroundColors = ['#179B93', '#7D46C3', '#C15894', '#C9614A', '#2A9BE5', '#799836', '#C84B69', '#B08F3B', '#56AA64', '#307DA8', '#9F3AAF', '#5140B9'];

export const getTokenIconFallbackProps = memoize((tokenSymbol: string) => {
  const randomBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  return {
    backgroundColor: randomBackgroundColor,
    label: tokenSymbol.slice(0, 4).toUpperCase(),
  };
});
