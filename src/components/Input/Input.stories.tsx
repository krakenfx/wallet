import React, { useState } from 'react';
import { View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { SvgIcon } from '../SvgIcon';

import { Input } from './Input';

import type { Meta, StoryObj } from '@storybook/react';

type InputPropsAndCustomArgs = React.ComponentProps<typeof Input> & { showLeftIcon: boolean; showRightIcon: boolean };

const InputMeta: Meta<InputPropsAndCustomArgs> = {
  title: 'Input',
  component: Input,
  argTypes: {
    backgroundColor: {
      options: Object.keys(SuperDarkTheme.colors),
      control: { type: 'select' },
    },
    borderColorOnFocus: {
      options: Object.keys(SuperDarkTheme.colors),
      control: { type: 'select' },
    },
    borderColorOnBlur: {
      options: Object.keys(SuperDarkTheme.colors),
      control: { type: 'select' },
    },
    textAlign: {
      options: ['left', 'center', 'right', undefined],
      control: { type: 'select' },
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render({ showLeftIcon, showRightIcon, ...args }) {
    const [value, setValue] = useState('');

    return (
      <Input
        {...args}
        value={value}
        onChangeText={setValue}
        left={showLeftIcon ? <SvgIcon name="search" /> : undefined}
        right={showRightIcon ? <SvgIcon name="search" /> : undefined}
      />
    );
  },
};

export default InputMeta;

type Story = StoryObj<InputPropsAndCustomArgs>;

export const Basic: Story = {
  args: {
    editable: true,
    textAlign: undefined,
    showLeftIcon: false,
    showRightIcon: false,
    shrinkInput: false,
    type: 'regularBody',
    placeholderType: 'regularBody',
    placeholder: 'Type something',
    hideDoneAccessoryView: false,
    errorText: '',
    borderColorOnFocus: 'kraken',
    borderColorOnBlur: 'kraken',
    backgroundColor: 'background',
  },
};

export const WithRightAndLeftFooter: Story = {
  args: {
    editable: true,
    showLeftIcon: false,
    showRightIcon: false,
    textAlign: undefined,
    footerLeft: 'Left footer',
    footerRight: 'Right footer',
    shrinkInput: false,
    type: 'regularBody',
    placeholderType: 'regularBody',
    placeholder: 'Type something',
    hideDoneAccessoryView: false,
    errorText: '',
    borderColorOnFocus: 'kraken',
    borderColorOnBlur: 'kraken',
    backgroundColor: 'background',
  },
};
