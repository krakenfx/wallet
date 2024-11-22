import { View } from 'react-native';

import { Networks } from '@/onChain/wallets/registry';

import { NetworkIcon } from './NetworkIcon';

import type { Meta, StoryObj } from '@storybook/react';

const NetworkIconMeta: Meta<typeof NetworkIcon> = {
  title: 'NetworkIcon',
  component: NetworkIcon,
  argTypes: {
    networkName: {
      options: Object.keys(Networks),
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

export default NetworkIconMeta;

type Story = StoryObj<typeof NetworkIcon>;

export const Basic: Story = {
  args: {
    networkName: 'ethereum',
    size: 40,
  },
};
