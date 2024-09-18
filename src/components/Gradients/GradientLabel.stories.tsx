import React from 'react';

import { View } from 'react-native';

import { GradientLabel } from './GradientLabel';

import type { Meta, StoryObj } from '@storybook/react';

const GradientLabelMeta: Meta<typeof GradientLabel> = {
  title: 'Gradients/GradientLabel',
  component: GradientLabel,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default GradientLabelMeta;

export const Basic: StoryObj<typeof GradientLabel> = {
  args: {
    type: 'boldDisplay2',
    numberOfLines: 3,
    adjustsFontSizeToFit: true,
  },
  render: function Render(args) {
    return (
      <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
        <GradientLabel {...args}>Lorem ipsum dolor sit amet</GradientLabel>
      </View>
    );
  },
};
