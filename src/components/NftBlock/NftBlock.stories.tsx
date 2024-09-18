import React from 'react';
import { View } from 'react-native';

import type { RealmNft } from '@/realm/nfts';

import { NftBlock } from './NftBlock';

import type { Meta, StoryObj } from '@storybook/react';

const NftBlockMeta: Meta<typeof NftBlock> = {
  title: 'NftBlock',
  component: NftBlock,
  args: {
    currentAccount: 0,
    nft: {
      metadata: {
        assetId: 'asd',
        name: 'Cat the Sailor',
        collectionName: 'OpenSea Collections',
        imageUrl:
          'https://superwalletcdn.com/?image=https%3A%2F%2Fnft-cdn.alchemy.com%2Fmatic-mainnet%2F6fffc58b409ca885f706f2abd9c54226&signature=75646a4f16ed919926a6dd8f873c9f70c62329a5c5b582ffb4ccfc0d12694c94',
        contentType: 'image/png',
      },
      wallet: {
        accountIdx: 0,
      },
    } as unknown as RealmNft,

    omitSecondaryLabel: false,
    allowNavigationToNft: false,
    containerStyle: {},
  },
  argTypes: {
    containerStyle: { control: { type: 'object' } },
  },
};

export default NftBlockMeta;

export const Basic: StoryObj<typeof NftBlock> = {
  args: {},
  decorators: [
    Story => (
      <View
        style={{
          padding: 30,
        }}>
        <Story />
      </View>
    ),
  ],
};

export const WithoutMetadata: StoryObj<typeof NftBlock> = {
  args: {
    currentAccount: 0,
    nft: undefined,
    omitSecondaryLabel: false,
    allowNavigationToNft: false,
    containerStyle: {},
  },
  decorators: [
    Story => (
      <View
        style={{
          padding: 30,
        }}>
        <Story />
      </View>
    ),
  ],
};
