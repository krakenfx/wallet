import { useArgs } from '@storybook/preview-api';
import React from 'react';
import { View } from 'react-native';

import { CheckBox } from '@/components/CheckBox';

import type { Meta, StoryObj } from '@storybook/react';

const CheckBoxMeta: Meta<typeof CheckBox> = {
  title: 'CheckBox',
  component: CheckBox,
  args: {
    checked: false,
    title: 'CheckBox Story',
  },
};

export default CheckBoxMeta;

export const Basic: StoryObj<typeof CheckBox> = {
  args: {
    checked: false,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  },
  decorators: [
    (Story, { args: { title } }) => {
      const [{ checked }, updateArgs] = useArgs();

      const onToggle = () => {
        updateArgs({ checked: !checked });
      };

      return (
        <View
          style={{
            padding: 30,
          }}>
          <CheckBox checked={checked} title={title} onPress={onToggle} />
        </View>
      );
    },
  ],
};
