import { noop } from 'lodash';
import React from 'react';
import { View } from 'react-native';

import { ListHeader } from './ListHeader';

import type { Meta, StoryObj } from '@storybook/react';

const ListHeaderMeta: Meta<typeof ListHeader> = {
  title: 'ListHeader',
  component: ListHeader,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ListHeaderMeta;

type Story = StoryObj<typeof ListHeader>;

export const Basic: Story = {
  args: {
    title: 'List header title',
    buttonText: 'Example button',
    disabled: false,
    onButtonPress: noop,
  },
};
