import { View } from 'react-native';

import { colorsControl, iconsControl } from '@/utils/storybook';

import { Button } from './Button';

import type { Meta, StoryObj } from '@storybook/react';

const ButtonMeta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  args: {
    color: 'kraken',
    size: 'large',
    loading: false,
    disabled: false,
    disabledOpacity: 0.25,
  },
  argTypes: {
    color: colorsControl,
    size: {
      options: ['small', 'medium', 'large', 'extraLarge'],
      control: { type: 'select' },
    },
  },
  decorators: [
    Story => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ButtonMeta;

export const Basic: StoryObj<typeof Button> = {
  args: {
    text: 'I am a button',
    textColor: 'light100',
    loadingText: 'loading...',
  },
  argTypes: {
    textColor: colorsControl,
  },
};

export const WithTextAndIcon: StoryObj<typeof Button> = {
  args: {
    text: 'I am a button',
    textColor: 'light100',
    icon: 'wallet',
    iconSize: 30,
    iconRight: false,
    iconAbove: false,
    iconColor: 'light100',
  },
  argTypes: {
    textColor: colorsControl,
    icon: iconsControl,
  },
};

export const WithIconOnly: StoryObj<typeof Button> = {
  args: {
    icon: 'wallet',
    iconSize: 40,
    iconColor: 'light100',
  },
  argTypes: {
    icon: iconsControl,
  },
};
