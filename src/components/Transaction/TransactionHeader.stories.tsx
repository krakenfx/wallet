import React from 'react';
import { View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { TransactionHeader } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TransactionHeaderMeta: Meta<typeof TransactionHeader> = {
  title: 'Transaction/TransactionHeader',
  component: TransactionHeader,
  argTypes: {
    badge: {
      control: { type: 'select' },
      options: ['pending', 'failed', undefined],
    },
  },
  decorators: [
    Story => (
      <View style={baseViewStyle.view}>
        <Story />
      </View>
    ),
  ],
};

export default TransactionHeaderMeta;

type Story = StoryObj<typeof TransactionHeader>;

export const Basic: Story = {
  args: {
    heading: 'Lorem Ipsum',
    asset: {
      uri: 'https://assets-dynamic.kraken.com/media1%2F80aa21bbd3a24852fa38dbd42b708d684544d5a242a80a9cb384ff0883ea2698.png',
      network: 'ethereum',
      size: 20,
    },
    useFallbackIcon: false,
    date: '2 August 2024 ・10:20pm',
    name: 'Dolor sit amet',
    url: undefined,
    badge: 'pending',
  },
};
