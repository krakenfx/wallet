import { noop } from 'lodash';

import { View } from 'react-native';

import { ActionButtons } from './ActionButtons';

import type { Meta, StoryObj } from '@storybook/react';

const ActionButtonsMeta: Meta<typeof ActionButtons> = {
  title: 'ActionButtons',
  component: ActionButtons,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ActionButtonsMeta;

type Story = StoryObj<typeof ActionButtons>;

export const Basic: Story = {
  args: {
    onReceivePress: noop,
    onSendPress: noop,
  },
};
