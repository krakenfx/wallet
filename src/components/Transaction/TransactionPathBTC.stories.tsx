import React from 'react';
import { View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { TransactionPathBTC } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TransactionPathBTCMeta: Meta<typeof TransactionPathBTC> = {
  title: 'Transaction/TransactionPathBTC',
  component: TransactionPathBTC,
  decorators: [
    Story => (
      <View style={baseViewStyle.view}>
        <Story />
      </View>
    ),
  ],
};

export default TransactionPathBTCMeta;

type Story = StoryObj<typeof TransactionPathBTC>;

export const Basic: Story = {
  args: {
    to: '1uQ6ioTaM6ujDMKrqUvP3x5SVOYAmDdAGK',
  },
};
