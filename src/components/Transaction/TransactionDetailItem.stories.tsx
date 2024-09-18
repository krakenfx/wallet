import React from 'react';
import { Text, View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { TransactionDetailItem } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TransactionDetailItemMeta: Meta<typeof TransactionDetailItem> = {
  title: 'Transaction/TransactionDetailItem',
  component: TransactionDetailItem,
  decorators: [
    Story => (
      <View style={baseViewStyle.view}>
        <Story />
      </View>
    ),
  ],
  render: function Render(args) {
    return (
      <TransactionDetailItem {...args}>
        <View>
          <Text style={{ color: 'white' }}>Dolor sit amet</Text>
        </View>
      </TransactionDetailItem>
    );
  },
};

export default TransactionDetailItemMeta;

type Story = StoryObj<typeof TransactionDetailItem>;

export const Basic: Story = {
  args: {
    title: 'Lorem Ipsum',
  },
};
