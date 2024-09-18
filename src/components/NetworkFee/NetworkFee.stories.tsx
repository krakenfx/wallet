import React from 'react';
import { View } from 'react-native';

import { Networks } from '@/onChain/wallets/registry';

import { NetworkFee } from './NetworkFee';

import type { Meta, StoryObj } from '@storybook/react';

const NetworkFeeMeta: Meta<typeof NetworkFee> = {
  title: 'NetworkFee',
  component: NetworkFee,
  argTypes: {
    networkName: {
      options: Object.keys(Networks),
      control: { type: 'select' },
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default NetworkFeeMeta;

type Story = StoryObj<typeof NetworkFee>;

export const Basic: Story = {
  args: {
    detached: true,
    networkName: 'ethereum',
    networkFee: '0.001',
    networkFeeInCurrency: '$3.30',
  },
};
