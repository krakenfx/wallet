import React from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from './ActivityIndicator';

import type { Meta, StoryObj } from '@storybook/react';

const ActivityIndicatorMeta: Meta<typeof ActivityIndicator> = {
  title: 'ActivityIndicator',
  component: ActivityIndicator,
  args: {
    size: 36,
  },
  decorators: [
    Story => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ActivityIndicatorMeta;

export const Basic: StoryObj<typeof ActivityIndicator> = {};
