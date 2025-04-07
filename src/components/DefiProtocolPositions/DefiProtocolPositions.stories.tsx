import { StyleSheet, View } from 'react-native';

import { RealmQueueProvider } from '@/realm/hooks/useRealmQueue';

import { UnencryptedRealmProvider } from '@/unencrypted-realm/RealmContext';

import { DefiProtocolPositions } from './DefiProtocolPositions';

import type { Meta, StoryObj } from '@storybook/react';

const DefiProtocolPositionsMeta: Meta<typeof DefiProtocolPositions> = {
  title: 'DefiProtocolPositions',
  component: DefiProtocolPositions,
  decorators: [
    Story => (
      <UnencryptedRealmProvider>
        <RealmQueueProvider>
          <View style={styles.main}>
            <Story />
          </View>
        </RealmQueueProvider>
      </UnencryptedRealmProvider>
    ),
  ],
};

export default DefiProtocolPositionsMeta;

export const Basic: StoryObj<typeof DefiProtocolPositions> = {
  args: {
    protocol: {
      id: 'aave-v3',
      protocolName: 'aave',
      protocolIcon: 'https://storage.googleapis.com/zapper-fi-assets/apps/aave-v3.png',
      totalValueInUsd: 190.92627364860942,
      positions: [
        {
          id: 'eip155:10/erc20:0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          positionUsdValue: 27.680131391141956,
          apy: 8.18,
          isDebt: false,
          vaultNetwork: 'ethereum',
          assets: [
            {
              id: 'eip155:10/erc20:0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
              address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
              network: 'eip155:10',
              symbol: 'USDT',
              decimals: 6,
              balanceNative: '27694138',
              balanceUsd: 27.680131391141956,
              portion: 1,
            },
          ],
        },
        {
          id: 'eip155:10/erc20:0x4200000000000000000000000000000000000006',
          positionUsdValue: 31.140956240263936,
          apy: 1.82,
          isDebt: true,
          vaultNetwork: 'ethereum',
          assets: [
            {
              id: 'eip155:10/erc20:0x4200000000000000000000000000000000000006',
              address: '0x4200000000000000000000000000000000000006',
              network: 'eip155:10',
              symbol: 'WETH',
              decimals: 18,
              balanceNative: '9692023834937783',
              balanceUsd: 31.140956240263936,
              portion: 1,
            },
          ],
        },
        {
          id: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          positionUsdValue: 1.0112296209735285,
          apy: 7.83,
          isDebt: false,
          vaultNetwork: 'ethereum',
          assets: [
            {
              id: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
              address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
              network: 'eip155:8453',
              symbol: 'USDC',
              decimals: 6,
              balanceNative: '1011230',
              balanceUsd: 1.0112296209735285,
              portion: 1,
            },
          ],
        },
        {
          id: 'eip155:137/erc20:0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
          positionUsdValue: 131.09395639623,
          isDebt: false,
          vaultNetwork: 'ethereum',
          assets: [
            {
              id: 'eip155:137/erc20:0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
              address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
              network: 'eip155:137',
              symbol: 'USDT',
              decimals: 6,
              balanceNative: '131221241',
              balanceUsd: 131.09395639623,
              portion: 1,
            },
          ],
        },
      ],
    },
  },
};

export const WithMultipleAssets: StoryObj<typeof DefiProtocolPositions> = {
  args: {
    protocol: {
      id: 'sablier',
      protocolName: 'Sablier',
      protocolIcon: 'https://storage.googleapis.com/zapper-fi-assets/apps/sablier.png',
      totalValueInUsd: 3071.6370826108355,
      positions: [
        {
          id: 'eip155:10/erc20:0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          isDebt: false,
          positionUsdValue: 1535.8185413054177,
          vaultNetwork: 'ethereum',
          assets: [
            {
              id: 'eip155:1/erc20:0x075b1bb99792c9e1041ba13afef80c91a1e70fb3',
              address: '0x69457a1c9ec492419344da01daf0df0e0369d5d0',
              network: 'eip155:1',
              symbol: 'crvRenWSBTC',
              decimals: 18,
              balanceNative: '3002125860438248800000',
              balanceUsd: 1535.8185413054177,
              portion: 0.7,
            },
            {
              id: 'eip155:1/erc20:0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6',
              address: '0x69457a1c9ec492419344da01daf0df0e0369d5d0',
              network: 'eip155:1',
              symbol: 'STG',
              decimals: 18,
              balanceNative: '0',
              balanceUsd: 0,
              portion: 0.3,
            },
          ],
        },
        {
          id: 'eip155:1/erc20:0x69457a1c9ec492419344da01daf0df0e0369d5d0-2',
          isDebt: false,
          positionUsdValue: 1535.8185413054177,
          vaultNetwork: 'ethereum',
          assets: [
            {
              id: 'eip155:1/erc20:0x69457a1c9ec492419344da01daf0df0e0369d5d0',
              address: '0x69457a1c9ec492419344da01daf0df0e0369d5d0',
              network: 'eip155:1',
              symbol: 'FJO',
              decimals: 18,
              balanceNative: '2584683727216006400000',
              balanceUsd: 1322.2647471179828,
              portion: 0.8609511550720581,
            },
            {
              id: 'eip155:1/erc20:0x69457a1c9ec492419344da01daf0df0e0369d5d0',
              address: '0x69457a1c9ec492419344da01daf0df0e0369d5d0',
              network: 'eip155:1',
              symbol: 'FJO',
              decimals: 18,
              balanceNative: '417442133222242300000',
              balanceUsd: 213.55379418743505,
              portion: 0.13904884492794195,
            },
          ],
        },
      ],
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
