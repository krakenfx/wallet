import { View } from 'react-native';

import { useSharedValue } from 'react-native-reanimated';

import { iconsControl } from '@/utils/storybook';

import { Toast, ToastState } from './';

import type { Meta, StoryObj } from '@storybook/react';

const ToastMeta: Meta<typeof Toast> = {
  title: 'Toast',
  component: Toast,
  decorators: [
    Story => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ToastMeta;

type Story = StoryObj<typeof Toast>;

export const Basic: Story = {
  args: {
    text: 'Lorem ipsum dolor',
    icon: 'kraken',
    type: 'success',
    topOffset: 0,
    noIcon: false,
  },
  argTypes: {
    icon: iconsControl,
    type: {
      options: ['success', 'info', 'error'],
      control: { type: 'select' },
    },
  },
  render: function Render(args) {
    const visibility = useSharedValue(0);
    visibility.value = ToastState.IN;

    const onDismiss = () => {
      'worklet';
    };

    return <Toast {...args} dismissMode="preventManual" visibility={visibility} onDismiss={onDismiss} />;
  },
};
