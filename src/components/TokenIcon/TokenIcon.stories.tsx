import { View } from 'react-native';

import { baseViewStyle, networkControl } from '@/utils/storybook';

import { TokenIcon } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TokenIconMeta: Meta<typeof TokenIcon> = {
  title: 'TokenIcon/TokenIcon',
  component: TokenIcon,
  argTypes: {
    networkName: networkControl,
  },
  decorators: [
    Story => (
      <View style={[baseViewStyle.view, { alignItems: 'center' }]}>
        <Story />
      </View>
    ),
  ],
};

export default TokenIconMeta;

type Story = StoryObj<typeof TokenIcon>;

export const WithWallet: Story = {
  args: {
    forceOmitNetworkIcon: false,
    networkName: 'ethereum',
    size: 50,
    tokenId: '1',
    tokenSymbol: 'eth',
    wallet: {
      type: 'HDsegwitBech32',
      nativeTokenLabel: 'btc',
    },
  },
};

export const WithoutWallet: Story = {
  args: {
    forceOmitNetworkIcon: false,
    networkName: 'optimism',
    size: 50,
    tokenId: '1',
    tokenSymbol: 'eth',
  },
};
