import { View } from 'react-native';

import { NetworkIcon } from '../NetworkIcon';

import { OverlappingCollection } from './OverlappingCollection';

import type { Meta, StoryObj } from '@storybook/react';

const OverlappingCollectionMeta: Meta<typeof OverlappingCollection> = {
  title: 'OverlappingCollection',
  component: OverlappingCollection,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default OverlappingCollectionMeta;

export const Basic: StoryObj<typeof OverlappingCollection> = {
  args: {
    maskedItemOffset: 18,
    itemSize: 40,
    borderRadius: 20,
    items: [
      <NetworkIcon networkName="ethereum" size={40} />,
      <NetworkIcon networkName="blast" size={40} />,
      <NetworkIcon networkName="base" size={40} />,
      <NetworkIcon networkName="ethereum" size={40} />,
      <NetworkIcon networkName="blast" size={40} />,
      <NetworkIcon networkName="base" size={40} />,
    ],
  },
};
