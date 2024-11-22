import { View } from 'react-native';

import { baseViewStyle, networkControl } from '@/utils/storybook';

import { TransactionAmount } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TransactionAmountMeta: Meta<typeof TransactionAmount> = {
  title: 'Transaction/TransactionAmount',
  component: TransactionAmount,
  argTypes: {
    assetNetwork: networkControl,
  },
  decorators: [
    Story => (
      <View style={baseViewStyle.view}>
        <Story />
      </View>
    ),
  ],
};

export default TransactionAmountMeta;

type Story = StoryObj<typeof TransactionAmount>;

export const Basic: Story = {
  args: {
    attached: false,
    label: '',
    assetAmount: '6 ETH',
    assetFiatAmount: '$12,000',
    assetNetwork: 'ethereum',
    assetSymbol: 'ETH',
    tokenIconProps: {
      forceOmitNetworkIcon: false,
      networkName: 'optimism',
      size: 50,
      tokenId: '1',
      tokenSymbol: 'eth',
    },
  },
};
