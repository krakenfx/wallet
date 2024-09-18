import { noop } from 'lodash';
import React from 'react';
import { View } from 'react-native';

import { NonSmallIconName } from '../SvgIcon';

import { LoopSlides } from './LoopSlides';
import { AnimationMarkers } from './types';

import type { Meta, StoryObj } from '@storybook/react';

const LoopSlidesMeta: Meta<typeof LoopSlides> = {
  title: 'AnimatedSlides/LoopSlides',
  component: LoopSlides,
  decorators: [
    Story => (
      <View style={{ height: '100%' }}>
        <Story />
      </View>
    ),
  ],
};

export default LoopSlidesMeta;

type Story = StoryObj<typeof LoopSlides>;

const animationMarkers: AnimationMarkers = {
  'part-1': {
    start: 0,
    end: 340,
  },
  'part-2': {
    start: 341,
    end: 609,
  },
};

interface Args {
  title: string;
  subtitle: string;
  slides: Array<{ title: string; icon: NonSmallIconName }>;
  buttonText: string;
}

const RenderedSlides = (args: Args) => {
  return (
    <LoopSlides {...args} animationMarkers={animationMarkers} animation={require('@/assets/lottie/walletConnect-tutorial-slide2.json')} onButtonPress={noop} />
  );
};

export const Basic: Story = {
  render: RenderedSlides,
  args: {
    title: 'When using Web3 apps on your phone',
    subtitle: 'Instead of scanning:',
    slides: [
      {
        title: 'Tap on WalletConnect',
        icon: 'walletconnect',
      },
      {
        title: 'Select Kraken Wallet',
        icon: 'kraken',
      },
    ],
    buttonText: 'Continue',
  },
};
