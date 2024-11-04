import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import type { ExploreContentRow } from '@/api/types';

import { Button } from '@/components/Button';

import { ExploreAnimationContextProvider } from '../../context/ExploreAnimationContext';

import { ExploreRow } from '../ExploreRow';

import { ExploreContent } from './ExploreContent';

import type { Meta, StoryObj } from '@storybook/react';

const mockData: ExploreContentRow[] = [
  {
    id: '163f0b7c-4d8d-4e5e-86b9-16f85d7a5bb4',
    variant: 'Hero',
    content: [
      {
        title: 'Hero Explore on-chain',
        body: 'Start your journey, Farcaster is your gateway to a decentralized social network',
        variant: 'Card',
        background: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/0701b38f4b931be180762a314737d4e33a45094e-342x409.png',
        cta: {
          id: '163f0b7c-4d8d-4e5e-86b9-16f85d7a5bb4',
          icon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/39c31cf9b5061093bfdd3a77bd34495cb497a156-40x40.png',
          iconVariant: 'RoudedCorners',
          buttonText: 'Open',
          buttonLink: 'https://www.farcaster.xyz/',
          link: {
            isInternal: false,
            text: 'Open',
            url: 'https://www.farcaster.xyz/',
          },
          title: 'Farcaster',
          body: 'Social network',
        },
        id: '163f0b7c-4d8d-4e5e-86b9-16f85d7a5bb4',
      },
    ],
  },
  {
    id: 'e4082f4f-5b2d-4fb9-8a38-b06578e4f454',
    variant: 'List',
    content: [
      {
        id: 'e4082f4f-5b2d-4fb9-8a38-b06578e4f454',
        title: 'Hot Defi Apps',
        items: [
          {
            id: '1666ff0cac53',
            title: 'Test Page',
            body: 'this goes to a test page',
            icon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/b74464d1a27d32680f9dfe8c98d455a34f4e8504-40x40.png',
            iconVariant: 'RoudedCorners',
            buttonText: 'Open',
            buttonLink: 'test',
            link: {
              isInternal: true,
              text: 'Open',
              slug: 'test',
            },
          },
          {
            id: '1666ff0cac53',
            title: 'Uniswap',
            body: 'Decentralized trading protocol',
            icon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/b74464d1a27d32680f9dfe8c98d455a34f4e8504-40x40.png',
            iconVariant: 'RoudedCorners',
            buttonText: 'Open',
            buttonLink: 'https://app.uniswap.org/swap',
            link: {
              isInternal: false,
              text: 'Open',
              url: 'https://app.uniswap.org/swap',
            },
          },
          {
            icon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/bf0998cbd3974def6716dfee6fe18bebb8a82e5b-40x40.png',
            iconVariant: 'RoudedCorners',
            buttonText: 'Open',
            buttonLink: 'https://jup.ag/',
            link: {
              isInternal: false,
              text: 'Open',
              url: 'https://jup.ag/',
            },
            id: 'e67759ae3b88',
            title: 'Jupiter Exchange',
            body: 'Swap infrastructure & aggregator',
          },
          {
            id: '16885b5acd7a',
            title: 'Aave',
            body: 'Earn and borrow',
            icon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/247cbe4127308ce0e819d0549e9601ba6309efa3-40x40.png',
            iconVariant: 'RoudedCorners',
            buttonText: 'Open',
            buttonLink: 'https://aave.com/',
            link: {
              isInternal: false,
              text: 'Open',
              url: 'https://aave.com/',
            },
          },
          {
            iconVariant: 'RoudedCorners',
            buttonText: 'Open',
            buttonLink: 'https://pump.fun/board',
            link: {
              isInternal: false,
              text: 'Open',
              url: 'https://pump.fun/board',
            },
            id: '3dc9c47b2d2f',
            title: 'Pump.fun',
            body: 'Launchpad and exchange on Sol',
            icon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/33814347ccb4dd09b0be890382231419b1abddb7-40x40.png',
          },
          {
            body: 'Popular bridging platform',
            icon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/6f6275eb86b84c9678799f76caf4deb567418908-40x40.png',
            iconVariant: 'Circle',
            buttonText: 'Open',
            buttonLink: 'https://quickswap.exchange/',
            link: {
              isInternal: false,
              text: 'Open',
              url: 'https://quickswap.exchange/',
            },
            id: '65c6c702f07d',
            title: 'Stargate',
          },
        ],
      },
    ],
  },
  {
    id: '6dd27fea-c419-4505-8791-874613b9aa62',
    variant: 'Card',
    content: [
      {
        buttonLink: 'https://ens.domains/',
        link: {
          isInternal: false,
          text: 'Get your name',
          url: 'https://ens.domains/',
        },
        body: '',
        id: '6dd27fea-c419-4505-8791-874613b9aa62',
        title: 'Register your ENS name',
        size: 'Small',
        background: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/b025d5b7e18992e25e86c1381b1e85cc9a3cebaa-342x161.png',
        floatingIcon: 'https://cdn.sanity.io/images/51n36hrp/web3-explore/dd0ba5a6656dae434de5aaf244d5b6f9c9aec5e4-132x164.png',
        buttonText: 'Get your name',
      },
    ],
  },
];

const ExploreContentMeta: Meta<typeof ExploreContent> = {
  title: 'Explore/ExploreContent',
  component: ExploreContent,
  render: function Render() {
    const [selectedContent, setSelectedContent] = useState<ExploreContentRow>(mockData[0]);
    return (
      <ExploreAnimationContextProvider animateScreenUnmount={() => {}}>
        <View style={StyleSheet.absoluteFill}>
          <ExploreRow>
            <ExploreContent data={selectedContent} />
          </ExploreRow>
          <View style={{ flexDirection: 'row', position: 'absolute', bottom: 16, width: '100%', gap: 16, justifyContent: 'center' }}>
            {mockData.map(item => {
              return (
                <Button text={`${item.variant}`} onPress={() => setSelectedContent(item)} size="small" color="kraken" disabled={item === selectedContent} />
              );
            })}
          </View>
        </View>
      </ExploreAnimationContextProvider>
    );
  },
  decorators: [
    Story => (
      <>
        <Story />
      </>
    ),
  ],
};

export default ExploreContentMeta;

export const Basic: StoryObj<typeof ExploreContent> = {};
