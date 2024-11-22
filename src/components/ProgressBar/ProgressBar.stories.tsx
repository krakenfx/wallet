import { View } from 'react-native';

import { colorsControl } from '@/utils/storybook';

import { ProgressBar } from './';

import type { Meta, StoryObj } from '@storybook/react';

const TooltipMeta: Meta<typeof ProgressBar> = {
  title: 'ProgressBar',
  component: ProgressBar,
  decorators: [
    Story => (
      <View>
        <Story />
      </View>
    ),
  ],
  args: {
    containerStyle: { margin: 16 },
    totalBars: 5,
    currentBar: 2,
    activeColor: 'green400',
  },
  argTypes: {
    activeColor: colorsControl,
  },
  render: function Render(args) {
    return <ProgressBar {...args} />;
  },
};

export default TooltipMeta;

type Story = StoryObj<typeof ProgressBar>;

export const Basic: Story = {};
