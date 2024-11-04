import { noop } from 'lodash';
import React from 'react';

import { SequenceSlides } from './SequenceSlides';

import type { AnimationMarkers } from './types';
import type { IconName } from '../SvgIcon';

import type { Meta, StoryObj } from '@storybook/react';

const SequenceSlidesMeta: Meta<typeof SequenceSlides> = {
  title: 'AnimatedSlides/SequenceSlides',
  component: SequenceSlides,
};

export default SequenceSlidesMeta;

type Story = StoryObj<typeof SequenceSlides>;

const animationMarkers: AnimationMarkers = {
  'part-1': { start: 0, end: 129 },
  'part-2': { start: 130, end: 404 },
  'part-3': { start: 405, end: 612 },
  'part-4': { start: 613, end: 839 },
  'part-5': { start: 840, end: 978 },
  'part-6': { start: 979, end: 1020 },
};

interface Args {
  title: string;
  summaryTitle: string;
  slides: Array<{ title: string; icon?: IconName }>;
  slidesSummary: Array<{ title: string }>;
  buttonText: string;
}

const RenderedSlides = (args: Args) => {
  return (
    <SequenceSlides
      {...args}
      animationMarkers={animationMarkers}
      animation={require('@/assets/lottie/walletConnect-tutorial-slide3.json')}
      onButtonPress={noop}
    />
  );
};

export const Basic: Story = {
  render: RenderedSlides,
  args: {
    title: 'To connect your wallet with Web3 apps...',
    summaryTitle: 'To connect your wallet with Web3 apps',
    slides: [
      {
        title: '1. Click Connect Wallet',
      },
      {
        title: '2. Select WalletConnect',
      },
      {
        title: '3. On your phone, tap',
        icon: 'scan-walletConnect',
      },
      {
        title: '4. Scan QR Code',
      },
    ],
    slidesSummary: [
      {
        title: 'Tap Connect Wallet',
      },
      {
        title: 'Select WalletConnect',
      },
      {
        title: 'On your phone, tap',
        icon: 'scan-walletConnect',
      },
      {
        title: 'Scan QR Code',
      },
    ],
    buttonText: 'Continue',
  },
};
