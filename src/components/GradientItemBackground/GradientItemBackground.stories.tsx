import { Text, View } from 'react-native';

import { GradientItemBackground } from './GradientItemBackground';

import type { Meta, StoryObj } from '@storybook/react';

const GradientItemBackgroundMeta: Meta<typeof GradientItemBackground> = {
  title: 'GradientItemBackground',
  component: GradientItemBackground,
  argTypes: {
    backgroundType: {
      options: ['modal', 'fullscreen', 'modalLight'],
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
};

export default GradientItemBackgroundMeta;

type Story = StoryObj<typeof GradientItemBackground>;

export const Basic: Story = {
  args: {
    backgroundType: 'modal',
  },
  render: function Render(args) {
    return (
      <View
        style={{
          overflow: 'hidden',
          padding: 24,
          height: 280,
          borderRadius: 30,
          gap: 8,
          marginBottom: 1,
        }}>
        <GradientItemBackground {...args} />
        <Text style={{ color: 'white' }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam illo ea blanditiis recusandae nesciunt excepturi minus accusantium veniam, voluptates
          temporibus culpa repudiandae, sed assumenda! Quaerat omnis in hic vel incidunt.
        </Text>
      </View>
    );
  },
};
