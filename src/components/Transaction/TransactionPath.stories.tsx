import React from 'react';
import { View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { TransactionPath } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TransactionPathMeta: Meta<typeof TransactionPath> = {
  title: 'Transaction/TransactionPath',
  component: TransactionPath,
  decorators: [
    Story => (
      <View style={baseViewStyle.view}>
        <Story />
      </View>
    ),
  ],
};

export default TransactionPathMeta;

type Story = StoryObj<typeof TransactionPath>;

export const Basic: Story = {
  args: {
    from: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
    to: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
  },
};
