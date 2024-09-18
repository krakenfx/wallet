import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '../Button';

import { ListAnimatedItem } from './ListAnimatedItem';

import type { Meta, StoryObj } from '@storybook/react';

const ListAnimatedItemMeta: Meta<typeof ListAnimatedItem> = {
  title: 'ListAnimatedItem',
  component: ListAnimatedItem,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ListAnimatedItemMeta;

type Story = StoryObj<typeof ListAnimatedItem>;

export const Basic: Story = {
  render: function Render() {
    const [show, setShow] = useState(true);

    return (
      <View>
        <View style={{ height: 30 }}>
          {show && (
            <ListAnimatedItem>
              <Text style={{ color: 'white' }}>This is some text</Text>
            </ListAnimatedItem>
          )}
        </View>

        <Button onPress={() => setShow(!show)} text={`${show ? 'Hide' : 'Show'} element`} />
      </View>
    );
  },
};
