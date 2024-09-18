import React, { useState } from 'react';
import { View } from 'react-native';

import { colorsControl, typographyControl } from '@/utils/storybook';

import { SearchInput } from './SearchInput';

import type { Meta, StoryObj } from '@storybook/react';

const SearchInputMeta: Meta<typeof SearchInput> = {
  title: 'SearchInput',
  component: SearchInput,
  argTypes: {
    type: typographyControl,
    placeholderType: typographyControl,
    borderColorOnFocus: colorsControl,
    borderColorOnBlur: colorsControl,
    backgroundColor: colorsControl,
  },
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render(args) {
    const [text, setText] = useState('');

    return <SearchInput {...args} onChangeText={setText} value={text} />;
  },
};

export default SearchInputMeta;

type Story = StoryObj<typeof SearchInput>;

export const Basic: Story = {
  args: {
    placeholder: 'Search for a coin',
    editable: true,
    shrinkInput: false,
    type: 'regularBody',
    placeholderType: 'regularBody',
    hideDoneAccessoryView: false,
    errorText: '',
    transparent: false,
    borderColorOnFocus: 'kraken',
    borderColorOnBlur: 'kraken',
    backgroundColor: 'background',
  },
};
