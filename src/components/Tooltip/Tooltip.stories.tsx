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
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    horizontalAlign: {
      options: ['left', 'right'],
      control: { type: 'select' },
    },
    verticalAlign: {
      options: ['top', 'bottom'],
      control: { type: 'select' },
    },
  },
  args: {
    containerStyle: {},
    horizontalAlign: 'left',
    verticalAlign: 'top',
    horizontalTipOffset: 32,
    style: {},
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
