import React from 'react';

import { AnimationMarkers, SequenceSlide, SequenceSlides } from '@/components/AnimatedSlides';

import loc from '/loc';

export type Props = {
  onContinue: () => void;
};

const animationMarkers: AnimationMarkers = {
  'part-1': { start: 0, end: 129 },
  'part-2': { start: 130, end: 404 },
  'part-3': { start: 405, end: 612 },
  'part-4': { start: 613, end: 839 },
  'part-5': { start: 840, end: 978 },
  'part-6': { start: 979, end: 1020 },
};

const titles: SequenceSlide[] = [
  { title: loc.walletConnectExplainer.secondPage.titlePart1 },
  { title: loc.walletConnectExplainer.secondPage.titlePart2 },
  { title: loc.walletConnectExplainer.secondPage.titlePart3, icon: 'scan-walletConnect' },
  { title: loc.walletConnectExplainer.secondPage.titlePart4 },
];

const steps: SequenceSlide[] = [
  { title: loc.walletConnectExplainer.secondPage.part1 },
  { title: loc.walletConnectExplainer.secondPage.part2 },
  { title: loc.walletConnectExplainer.secondPage.part3, icon: 'scan-walletConnect' },
  { title: loc.walletConnectExplainer.secondPage.part4 },
];

export const SlideTwo: React.FC<Props> = ({ onContinue }) => (
  <SequenceSlides
    title={loc.walletConnectExplainer.secondPage.titleWithEllipsis}
    animation={require('@/assets/lottie/walletConnect-tutorial-slide2.json')}
    slides={titles}
    summaryTitle={loc.walletConnectExplainer.secondPage.title}
    slidesSummary={steps}
    animationMarkers={animationMarkers}
    onButtonPress={onContinue}
    buttonText={loc.walletConnectExplainer.secondPage.buttonText}
  />
);
