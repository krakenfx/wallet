import React from 'react';

import { StyleSheet, View } from 'react-native';

import { CoinHeader } from '@/components/CoinHeader';

import type { Meta, StoryObj } from '@storybook/react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
});

const CoinHeaderMeta: Meta<Partial<typeof CoinHeader>> = {
  title: 'CoinHeader',
  component: CoinHeader,
  argTypes: {
    wallet: { control: { type: 'object' } },
    token: { control: { type: 'object' } },
  },
  args: {
    text: '',
    wallet: {
      nativeTokenSymbol: 'ETH',
      type: 'ethereum',
    },
    token: {
      assetId: 'eip155:1/slip44:60',
      metadata: {
        label: 'Ethereum',
        symbol: 'ETH',
      },
    },
  },
  decorators: [
    Story => {
      return (
        <View style={styles.container}>
          <Story />
        </View>
      );
    },
  ],
};

export default CoinHeaderMeta;

export const Basic: StoryObj<typeof CoinHeaderMeta> = {
  args: {
    text: '',
  },
};

export const WithNetworkIcon: StoryObj<typeof CoinHeaderMeta> = {
  args: {
    wallet: {
      nativeTokenSymbol: 'ETH',
      type: 'optimism',
    },
    token: {
      assetId: 'eip155:10/slip44:60',
      metadata: {
        label: 'Ethereum',
        symbol: 'ETH',
      },
    },
  },
};

export const WithCustomText: StoryObj<typeof CoinHeaderMeta> = {
  args: {
    text: 'Send {ticker}',
  },
};
