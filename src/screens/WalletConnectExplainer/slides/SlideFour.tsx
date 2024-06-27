import React, { useMemo } from 'react';

import { SimpleSlide } from '@/components/AnimatedSlides';

import { AppProps, ExampleAppList } from '../components/ExampleAppList';

import loc from '/loc';

type Props = {
  onClose: () => void;
};

export const SlideFour: React.FC<Props> = ({ onClose }) => {
  const apps: AppProps[] = useMemo(
    () => [
      {
        description: loc.walletConnectExplainer.fourthPage.mintDescription,
        url: 'mint.fun',
        image: require('../assets/mintIcon.png'),
        formatDescriptionWithUrl: true,
      },
      {
        description: loc.walletConnectExplainer.fourthPage.ensDescription,
        url: 'app.ens.domains',
        image: require('../assets/ensIcon.png'),
      },
      {
        description: loc.walletConnectExplainer.fourthPage.aaveDescription,
        url: 'app.aave.com',
        image: require('../assets/aaveIcon.png'),
      },
    ],
    [],
  );

  return (
    <SimpleSlide
      onButtonPress={onClose}
      buttonText={loc.walletConnectExplainer.fourthPage.buttonText}
      animation={require('@/assets/lottie/walletConnect-tutorial-slide1.json')}
      title={loc.walletConnectExplainer.fourthPage.title}>
      <ExampleAppList apps={apps} />
    </SimpleSlide>
  );
};
