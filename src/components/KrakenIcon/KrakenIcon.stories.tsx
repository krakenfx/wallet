import { View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { KrakenIcon } from './KrakenIcon';

import type { Meta, StoryObj } from '@storybook/react';

const KrakenIconMeta: Meta<typeof KrakenIcon> = {
  title: 'Label',
  component: KrakenIcon,
  argTypes: {
    size: {
      control: { type: 'number', min: 8, max: 50, step: 2 },
    },
    iconSize: {
      control: { type: 'number', min: 8, max: 50, step: 2 },
    },
  },
  decorators: [
    Story => (
      <View style={[baseViewStyle.view, { alignItems: 'center' }]}>
        <Story />
      </View>
    ),
  ],
};

export default KrakenIconMeta;

export const Basic: StoryObj<typeof KrakenIcon> = {
  args: {
    size: 16,
    iconSize: 10,
  },
};
