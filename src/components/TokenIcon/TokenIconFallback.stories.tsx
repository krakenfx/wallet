import React from 'react';
import { View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { TokenIconFallback } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TokenIconFallbackMeta: Meta<typeof TokenIconFallback> = {
  title: 'TokenIcon/TokenIconFallback',
  component: TokenIconFallback,
  decorators: [
    Story => (
      <View style={[baseViewStyle.view, { alignItems: 'center' }]}>
        <Story />
      </View>
    ),
  ],
};

export default TokenIconFallbackMeta;

type Story = StoryObj<typeof TokenIconFallback>;

export const Basic: Story = {
  args: {
    size: 50,
    tokenSymbol: 'eth',
  },
};
