import React from 'react';
import { View } from 'react-native';

import { Label } from '../Label';

import { Tooltip } from './';

import type { Meta, StoryObj } from '@storybook/react';

const Content = () => {
  return (
    <Label type="regularTitle1" color="light75">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio itaque, quae sequi quod maxime dolorem facere.
    </Label>
  );
};

const TooltipMeta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  decorators: [
    Story => (
      <View>
        <Story />
      </View>
    ),
  ],
  args: {
    containerStyle: { margin: 16 },
    style: {},
    delayMs: 0,
  },
  render: function Render(args) {
    return (
      <Tooltip {...args}>
        <Content />
      </Tooltip>
    );
  },
};

export default TooltipMeta;

type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {};
