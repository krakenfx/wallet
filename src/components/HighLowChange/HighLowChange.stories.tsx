import { View } from 'react-native';

import { HighLowChange } from '@/components/HighLowChange';

import type { Meta, StoryObj } from '@storybook/react';

const HighLowChangeMeta: Meta<typeof HighLowChange> = {
  title: 'HighLowChange',
  component: HighLowChange,
  decorators: [
    Story => (
      <View
        style={{
          padding: 30,
          justifyContent: 'center',
          flex: 1,
        }}>
        <Story />
      </View>
    ),
  ],
};

export default HighLowChangeMeta;

export const Basic: StoryObj<typeof HighLowChange> = {
  args: {
    color: 'kraken',
    currentValue: 4,
    high: 6,
    highLabel: '6',
    low: 0,
    lowLabel: '0',
  },
};
