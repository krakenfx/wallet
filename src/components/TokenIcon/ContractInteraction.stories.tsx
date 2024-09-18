import React from 'react';
import { View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { ContractInteraction } from './';

import type { Meta, StoryObj } from '@storybook/react';

const ContractInteractionMeta: Meta<typeof ContractInteraction> = {
  title: 'TokenIcon/ContractInteraction',
  component: ContractInteraction,
  decorators: [
    Story => (
      <View style={[baseViewStyle.view, { alignItems: 'center' }]}>
        <Story />
      </View>
    ),
  ],
};

export default ContractInteractionMeta;

type Story = StoryObj<typeof ContractInteraction>;

export const Basic: Story = {
  args: {
    forceOmitNetworkIcon: false,
    wallet: {
      type: 'ethereum',
      nativeTokenLabel: 'base',
    },
  },
};
