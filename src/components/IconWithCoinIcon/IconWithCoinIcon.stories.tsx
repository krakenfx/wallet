import React from 'react';
import { View } from 'react-native';

import { WalletType } from '@/onChain/wallets/registry';

import { SvgIcon } from '../SvgIcon';

import { IconWithCoinIcon } from './IconWithCoinIcon';

import type { Meta, StoryObj } from '@storybook/react';

const COIN_TYPE: WalletType[] = [
  'base',
  'blast',
  'HDsegwitBech32',
  'ethereum',
  'arbitrum',
  'optimism',
  'polygon',
  'solana',
  'dogecoin',
  'ethereumTestnetSepolia',
  'solanaDevnet',
];

const IconWithCoinIconMeta: Meta<typeof IconWithCoinIcon> = {
  title: 'IconWithCoinIcon',
  component: IconWithCoinIcon,
  argTypes: {
    coinType: {
      options: COIN_TYPE,
      control: { type: 'select' },
    },
    maskShape: {
      options: ['circle', 'rounded-square'],
      control: { type: 'select' },
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default IconWithCoinIconMeta;

type Story = StoryObj<typeof IconWithCoinIcon>;

export const Basic: Story = {
  args: {
    coinType: 'ethereum',
    maskPositionXYNudge: 4,
    maskShape: 'rounded-square',
    size: 76,
    coinSize: 20,
    icon: <SvgIcon name="kraken" size={46} />,
  },
};
