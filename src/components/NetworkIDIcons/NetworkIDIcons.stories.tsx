import { View } from 'react-native';

import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

import { NetworkIDIcons } from './NetworkIDIcons';

import type { Meta, StoryObj } from '@storybook/react';

const NetworkIDIconsMeta: Meta<typeof NetworkIDIcons> = {
  title: 'NetworkIDIcons',
  component: NetworkIDIcons,
  argTypes: {
    align: {
      options: ['left', 'right'],
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

export default NetworkIDIconsMeta;

type Story = StoryObj<typeof NetworkIDIcons>;

export const Basic: Story = {
  args: {
    align: 'left',
    networkIDs: [
      ChainAgnostic.NETWORK_ARBITRUM,
      ChainAgnostic.NETWORK_BASE,
      ChainAgnostic.NETWORK_BITCOIN,
      ChainAgnostic.NETWORK_BLAST,
      ChainAgnostic.NETWORK_ETHEREUM,
      ChainAgnostic.NETWORK_OPTIMISM,
      ChainAgnostic.NETWORK_POLYGON,
      ChainAgnostic.NETWORK_SOLANA,
      ChainAgnostic.NETWORK_SOLANA_DEVNET,
      ChainAgnostic.NETWORK_DOGECOIN,
      ChainAgnostic.NETWORK_TEZOS,
    ],
  },
};
