import React from 'react';
import { View } from 'react-native';

import { colorsControl, iconsControl } from '@/utils/storybook';

import { SvgIcon } from './SvgIcon';

import type { Meta, StoryObj } from '@storybook/react';

const SvgIconMeta: Meta<typeof SvgIcon> = {
  title: 'SvgIcon',
  component: SvgIcon,
  argTypes: {
    name: iconsControl,
    color: colorsControl,
    bgColor: colorsControl,
  },
  decorators: [
    Story => {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Story />
        </View>
      );
    },
  ],
};

export default SvgIconMeta;

export const Basic: StoryObj<typeof SvgIcon> = {
  args: {
    name: 'verified',
    color: 'kraken',
    bgColor: 'light100',
    size: 48,
    label: '',
    disabled: false,
    gradientIconBackground: false,
  },
};
