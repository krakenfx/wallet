import { View } from 'react-native';

import { CardWarning } from './CardWarning';

import type { Meta, StoryObj } from '@storybook/react';

const CardWarningMeta: Meta<typeof CardWarning> = {
  title: 'CardWarning',
  component: CardWarning,
  argTypes: {
    type: {
      options: ['normal', 'warning', 'negative', 'info'],
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

export default CardWarningMeta;

type Story = StoryObj<typeof CardWarning>;

export const Basic: Story = {
  args: {
    title: 'This is a card warning',
    buttonText: 'Example button',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus minus quas consectetur.',
    type: 'warning',
    hideLeftIcon: false,
    numberOfLines: 5,
    iconSize: 20,
  },
};
