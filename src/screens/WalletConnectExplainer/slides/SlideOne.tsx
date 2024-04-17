import React from 'react';
import { FadeIn } from 'react-native-reanimated';

import { SimpleSlide } from '@/components/AnimatedSlides';
import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  onContinue: () => void;
};

export const SlideOne = ({ onContinue }: Props) => {
  return (
    <SimpleSlide
      onButtonPress={onContinue}
      buttonText={loc.walletConnectExplainer.firstPage.buttonText}
      animation={require('@/assets/lottie/walletConnect-tutorial-slide1.json')}
      title={loc.walletConnectExplainer.firstPage.title}>
      <Label type="regularTitle1" color="light75" entering={FadeIn.duration(500).delay(500)}>
        {loc.formatString(loc.walletConnectExplainer.firstPage.description, {
          boldDescription: <Label type="boldTitle1">{loc.walletConnectExplainer.firstPage.boldDescription}</Label>,
        })}
      </Label>
    </SimpleSlide>
  );
};
