import type { ExploreListItemContent } from '@/api/types';

import { ExploreAnimationContextProvider } from '../../context/ExploreAnimationContext';
import { ExploreRow } from '../ExploreRow';

import { ExploreHero } from './ExploreHero';

import type { Meta, StoryObj } from '@storybook/react';

const mockCta = (title: string): ExploreListItemContent => {
  return {
    isDynamicContent: false,
    id: 'cta',
    title,
    body: 'This is the body copy on a Hero Component',
    link: {
      isInternal: false,
      text: 'Learn more',
      url: 'https://www.kraken.com',
    },
    buttonText: 'Open',
    buttonLink: 'https://www.kraken.com',
    icon: 'https://placehold.co/80x80@2x/blue/white/png?text=icon',
    iconVariant: 'RoudedCorners',
  };
};

const ExploreHeroMeta: Meta<typeof ExploreHero> = {
  title: 'Explore/ExploreHero',
  component: ExploreHero,
  args: {
    variant: 'Card',
    cta: mockCta('Hero'),
    background: 'https://placehold.co/390x557@2x/orange/orange/png?text=',
  },
  decorators: [
    Story => (
      <ExploreAnimationContextProvider animateScreenUnmount={() => {}}>
        <ExploreRow>
          <Story />
        </ExploreRow>
      </ExploreAnimationContextProvider>
    ),
  ],
};

export default ExploreHeroMeta;

export const HeroCard: StoryObj<typeof ExploreHero> = {
  args: {
    variant: 'Card',
    cta: mockCta('Hero Card'),
  },
};

export const HeroFullBleed: StoryObj<typeof ExploreHero> = {
  args: {
    variant: 'FullBleed',
    cta: mockCta('Hero Full Bleed'),
  },
};
