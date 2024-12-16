import { View } from 'react-native';

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
    boldType: {
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

export const Basic: StoryObj<typeof Label> = {
  args: {
    color: 'light100',
    type: 'boldBody',
    children: 'Lorem ipsum dolor sit amet, consectetur adipisicing it',
  },
};

export const Formatted: StoryObj<typeof Label> = {
  args: {
    color: 'light100',
    type: 'regularBody',
    children: '<b>bold prefix</b> Lorem ipsum dolor sit amet, <b>bold intermission</b> consectetur adipisicing it <b>bold suffix</b>',
  },
};
