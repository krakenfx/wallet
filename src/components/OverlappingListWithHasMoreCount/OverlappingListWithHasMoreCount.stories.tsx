import React from 'react';
import { View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { NetworkIcon } from '../NetworkIcon';

import { OverlappingListWithHasMoreCount } from './OverlappingListWithHasMoreCount';

import type { Meta, StoryObj } from '@storybook/react';

const OverlappingListWithHasMoreCountMeta: Meta<typeof OverlappingListWithHasMoreCount> = {
  title: 'OverlappingListWithHasMoreCount',
  component: OverlappingListWithHasMoreCount,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default OverlappingListWithHasMoreCountMeta;

type Story = StoryObj<typeof OverlappingListWithHasMoreCount>;

export const Basic: Story = {
  args: {
    offsetSize: 5,
    hasMoreCount: {
      backgroundColor: SuperDarkTheme.colors.martinique,
      circleSize: 20,
      fontSize: 15,
      count: 5,
    },
  },
  render: function Render(args) {
    return (
      <OverlappingListWithHasMoreCount
        {...args}
        items={[
          <View>
            <NetworkIcon networkName="ethereum" size={20} />
          </View>,
          <View>
            <NetworkIcon networkName="blast" size={20} />
          </View>,
          <View>
            <NetworkIcon networkName="base" size={20} />
          </View>,
        ]}
      />
    );
  },
};
