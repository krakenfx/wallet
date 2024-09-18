import React from 'react';
import { View } from 'react-native';

import { ColorName } from '@/theme/themes';

import { IconName } from '../SvgIcon';

import { IconButton } from './IconButton';

import type { Meta, StoryObj } from '@storybook/react';

const COLOR_OPTIONS: ColorName[] = [
  'kraken',
  'background',
  'green500',
  'green400',
  'red500',
  'red400',
  'yellow600',
  'yellow500',
  'grey500',
  'light100',
  'light75',
  'dark100',
  'purple_40',
  'transparent',
  'martinique',
  'iOSKeyboardAccessoryBg',
  'androidDarkBlurBg',
  'androidToastBlur',
  'swapIconBg',
  'coreBackground',
  'blurBackgroundAndroid',
  'lavenderIndigo',
];

const ICON_OPTIONS: IconName[] = ['download', 'wallet', 'shield-tick', 'notification', 'lock', 'lock-unlocked', 'clock', 'shield', 'key', 'eye'];

const IconButtonMeta: Meta<typeof IconButton> = {
  title: 'IconButton',
  component: IconButton,
  argTypes: {
    backgroundColor: {
      options: COLOR_OPTIONS,
      control: { type: 'select' },
    },
    name: {
      options: ICON_OPTIONS,
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

export default IconButtonMeta;

export const Basic: StoryObj<typeof IconButton> = {
  args: {
    name: 'download',
    size: 20,
    blurred: false,
    backgroundColor: 'kraken',
  },
};
