import { View } from 'react-native';

import { SwapIcon } from './';

import type { Meta, StoryObj } from '@storybook/react';

const SwapIconMeta: Meta<typeof SwapIcon> = {
  title: 'SwapIcon',
  component: SwapIcon,
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default SwapIconMeta;

export const Basic: StoryObj<typeof SwapIcon> = {
  args: {
    sentAsset: {
      logoUrl: null,
      assetId: '1',
      symbol: 'eth',
    },
    receivedAsset: {
      logoUrl: null,
      assetId: '2',
      symbol: 'doge',
    },
  },
};
