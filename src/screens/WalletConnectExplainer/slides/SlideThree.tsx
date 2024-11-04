import React, { useMemo } from 'react';

import type { AnimationMarkers, LoopSlide } from '@/components/AnimatedSlides';
import { LoopSlides } from '@/components/AnimatedSlides';

import loc from '/loc';

type Props = {
  onContinue: () => void;
};

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

export const SlideThree: React.FC<Props> = ({ onContinue }) => {
  const slides: LoopSlide[] = useMemo(
    () => [
      {
        title: loc.walletConnectExplainer.thirdPage.description1,
        icon: 'walletconnect',
      },
      {
        title: loc.walletConnectExplainer.thirdPage.description2,
        icon: 'kraken',
      },
    ],
    [],
  );
  return (
    <LoopSlides
      title={loc.walletConnectExplainer.thirdPage.title}
      subtitle={loc.walletConnectExplainer.thirdPage.subtitle}
      slides={slides}
      animationMarkers={animationMarkers}
      animation={require('@/assets/lottie/walletConnect-tutorial-slide3.json')}
      buttonText={loc.walletConnectExplainer.thirdPage.buttonText}
      onButtonPress={onContinue}
    />
  );
};
