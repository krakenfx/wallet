import { useState } from 'react';
import { View } from 'react-native';

import { Switch } from './';

import type { Meta, StoryObj } from '@storybook/react';

const SwitchMeta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(false);

    const onToggle = (newValue: boolean) => setValue(newValue);

    return <Switch {...args} accessible value={value} onValueChange={onToggle} />;
  },
};

export default SwitchMeta;

type Story = StoryObj<typeof Switch>;

export const Basic: Story = {};
