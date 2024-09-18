import React from 'react';
import { Text, View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { baseViewStyle } from '@/utils/storybook';

import { Label, Typography } from './Label';

import type { Meta, StoryObj } from '@storybook/react';

const TYPOGRAPHY_OPTIONS = Object.keys(Typography);

const LabelMeta: Meta<typeof Label> = {
  title: 'Label',
  component: Label,
  argTypes: {
    color: {
      options: Object.keys(SuperDarkTheme.colors),
      control: { type: 'select' },
    },
    type: {
      options: TYPOGRAPHY_OPTIONS,
      control: { type: 'select' },
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

export default LabelMeta;

type Story = StoryObj<typeof Label>;

export const Basic: Story = {
  args: {
    color: 'light100',
    type: 'boldBody',
    children: <Text>Lorem ipsum dolor sit amet, consectetur adipisicing it.</Text>,
  },
};
