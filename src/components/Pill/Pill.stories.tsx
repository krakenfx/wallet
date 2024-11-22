import { Text, View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { Pill } from './Pill';

import type { Meta, StoryObj } from '@storybook/react';

const PillMeta: Meta<typeof Pill> = {
  title: 'Pill',
  component: Pill,
  argTypes: {
    backgroundColor: {
      options: Object.keys(SuperDarkTheme.colors),
      control: { type: 'select' },
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default PillMeta;

type Story = StoryObj<typeof Pill>;

export const Basic: Story = {
  args: {
    backgroundColor: 'kraken',
  },
  render: function Render(args) {
    return (
      <Pill {...args}>
        <Text style={{ color: 'white' }}>Lorem Ipsum</Text>
      </Pill>
    );
  },
};

export const WithOverridingStyles: Story = {
  args: {
    backgroundColor: 'kraken',
    overrideStyles: {
      justifyContent: 'center',
      width: '100%',
    },
  },
  render: function Render(args) {
    return (
      <Pill {...args}>
        <Text style={{ color: 'white' }}>Lorem Ipsum</Text>
      </Pill>
    );
  },
};
