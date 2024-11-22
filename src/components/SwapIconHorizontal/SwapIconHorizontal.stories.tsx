import { View } from 'react-native';

import { SwapIconHorizontal } from './';

import type { Meta, StoryObj } from '@storybook/react';

const SwapIconHorizontalMeta: Meta<typeof SwapIconHorizontal> = {
  title: 'SwapIconHorizontal',
  component: SwapIconHorizontal,
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default SwapIconHorizontalMeta;

export const Basic: StoryObj<typeof SwapIconHorizontal> = {
  args: {
    sentAssetSymbol: 'eth',
    receivedAssetSymbol: 'doge',
    size: 30,
  },
};
