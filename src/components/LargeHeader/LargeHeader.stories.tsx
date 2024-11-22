import { Text, View } from 'react-native';

import { LargeHeader } from '../LargeHeader/LargeHeader';

import type { Meta, StoryObj } from '@storybook/react';

const LargeHeaderMeta: Meta<typeof LargeHeader> = {
  title: 'LargeHeader',
  component: LargeHeader,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default LargeHeaderMeta;

type Story = StoryObj<typeof LargeHeader>;

export const Basic: Story = {
  args: {
    title: 'This is a large header',
  },
};

export const WithChildren: Story = {
  args: {
    title: 'This is a large header with children',
  },
  render: function Render(args) {
    return (
      <LargeHeader {...args}>
        <Text style={{ color: 'white', marginTop: 5 }}>Children component text</Text>
      </LargeHeader>
    );
  },
};
