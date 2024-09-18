import React from 'react';
import { Text, View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { FadingElement } from './FadingElement';

import type { Meta, StoryObj } from '@storybook/react';

const FadingElementMeta: Meta<typeof FadingElement> = {
  title: 'FadingElement',
  component: FadingElement,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default FadingElementMeta;

type Story = StoryObj<typeof FadingElement>;

export const Basic: Story = {
  args: {
    x1: '0%',
    x2: '0%',
    y1: '0%',
    y2: '8%',
  },
  render: function Render(args) {
    return (
      <FadingElement {...args}>
        <Text style={{ color: 'white', backgroundColor: SuperDarkTheme.colors.purple_40, paddingHorizontal: 10 }}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium culpa quos porro facere, suscipit enim placeat hic expedita est odit,
          repellendus nobis ratione quisquam sapiente natus, inventore similique ad aspernatur!
        </Text>
      </FadingElement>
    );
  },
};
