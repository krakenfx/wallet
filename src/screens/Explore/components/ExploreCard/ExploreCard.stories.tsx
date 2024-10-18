import React from 'react';

import { ExploreRow } from '../ExploreRow';

import { ExploreCard } from './ExploreCard';

import type { Meta, StoryObj } from '@storybook/react';

const ExploreCardMeta: Meta<typeof ExploreCard> = {
  title: 'Explore/ExploreCard',
  component: ExploreCard,
  args: {
    size: 'Large',
    buttonLink: 'https://www.kraken.com',
    background: 'https://placehold.co/342x409@2x/orange/orange/png?text=Large+Card',
  },
  decorators: [
    Story => (
      <ExploreRow>
        <Story />
      </ExploreRow>
    ),
  ],
};

export default ExploreCardMeta;

export const LargeCard: StoryObj<typeof ExploreCard> = {
  args: {
    title: 'This is a large card',
    body: 'This is the body of the card',
    buttonText: 'Open',
    background: 'https://placehold.co/342x409@2x/orange/orange/png?text=Large+Card',
  },
};

export const MediumCard: StoryObj<typeof ExploreCard> = {
  args: {
    size: 'Medium',
    title: 'This is a medium card',
    body: 'This is the body of the card',
    buttonText: 'Open',
    background: 'https://placehold.co/342x246@2x/orange/orange/png?text=Medium+Card',
  },
};

export const SmallCard: StoryObj<typeof ExploreCard> = {
  args: {
    size: 'Small',
    title: 'This is a small card',
    body: 'This is the body of the card',
    buttonText: 'Open',
    background: 'https://placehold.co/342x161@2x/orange/orange/png?text=Small+Card',
  },
};

export const SmallCardWithBleed: StoryObj<typeof ExploreCard> = {
  args: {
    size: 'Small',
    title: 'This is a small card with bleed',
    buttonText: 'Open',
    background: 'https://placehold.co/342x161@2x/orange/orange/png?text=Small+Card',
    floatingIcon: 'https://placehold.co/131x164@2x/pink/white/png?text=transparent+PNG',
  },
};
