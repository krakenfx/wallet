import { StyleSheet, View } from 'react-native';

import { SecuredRealmProvider } from '@/realm/SecuredRealmProvider';

import { DefiProtocolPositions } from './DefiProtocolPositions';

import type { Position } from './DefiProtocolPositions.types';

import type { Meta, StoryObj } from '@storybook/react';

const DefiProtocolPositionsMeta: Meta<typeof DefiProtocolPositions> = {
  title: 'DefiProtocolPositions',
  component: DefiProtocolPositions,
  decorators: [
    Story => (
      <SecuredRealmProvider>
        <View style={styles.main}>
          <Story />
        </View>
      </SecuredRealmProvider>
    ),
  ],
};

export default DefiProtocolPositionsMeta;

export const Basic: StoryObj<typeof DefiProtocolPositions> = {
  args: {
    protocol: {
      id: 'aave',
      protocolName: 'Aave',
      protocolIcon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/68bae8aca68bd3a7d021f8f6b8a3120169544fe5-80x80.png',
      totalValue: 2500,
      positions: [
        {
          id: 'a',
          token: {
            assetId: 'eip155:42161/erc20:0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            balance: '940002950',
          },
          apr: 3.51,
          isDebt: false,
        },
        {
          id: 'b',
          token: {
            assetId: 'eip155:42161/erc20:0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
            balance: '700009426',
          } as const,
          apr: 4.2,
          isDebt: false,
        },
        {
          id: 'c',
          token: {
            assetId: 'eip155:10/erc20:0x4200000000000000000000000000000000000042',
            balance: '400423624465151607661',
          },
          apr: 0.5,
          isDebt: true,
        },
      ] as Position[],
    },
  },
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
});
