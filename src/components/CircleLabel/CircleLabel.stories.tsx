import { View } from 'react-native';

import { CircleLabel } from '@/components/CircleLabel';

import { SuperDarkTheme } from '@/theme/themes';

import type { Meta, StoryObj } from '@storybook/react';

const CircleLabelMeta: Meta<typeof CircleLabel> = {
  title: 'CircleLabel',
  component: CircleLabel,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default CircleLabelMeta;

export const Basic: StoryObj<typeof CircleLabelMeta> = {
  args: {
    backgroundColor: SuperDarkTheme.colors.light15,
    circleSize: 32,
    fontSize: 13,
    text: '+5',
  },
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
