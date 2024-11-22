import { View } from 'react-native';

import { Toggle } from '@/components/Toggle';

import type { Meta, StoryObj } from '@storybook/react';

const ToggleMeta: Meta<typeof Toggle> = {
  title: 'Toggle',
  component: Toggle,
  args: {
    leftText: 'Left',
    rightText: 'Right',
    disabled: false,
    onChange: value => console.debug(`Toggle clicked and returned value: ${value}`),
  },
};

export default ToggleMeta;

export const Basic: StoryObj<typeof Toggle> = {
  args: {},
  decorators: [
    Story => {
      return (
        <View
          style={{
            padding: 30,
          }}>
          <Story />
        </View>
      );
    },
  ],
};
