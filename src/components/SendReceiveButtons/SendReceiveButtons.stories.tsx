import { noop } from 'lodash';
import React from 'react';
import { View } from 'react-native';

import { SendReceiveButtons } from './SendReceiveButtons';

import type { Meta, StoryObj } from '@storybook/react';

const SendReceiveButtonsMeta: Meta<typeof SendReceiveButtons> = {
  title: 'SendReceiveButtons',
  component: SendReceiveButtons,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default SendReceiveButtonsMeta;

type Story = StoryObj<typeof SendReceiveButtons>;

export const Basic: Story = {
  args: {
    onReceivePress: noop,
    onSendPress: noop,
  },
};
