import LottieView, { LottieViewProps } from 'lottie-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOutDown, SlideOutLeft } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { IconName } from '@/components/SvgIcon';
import { StepItem } from '@/screens/WalletConnectExplainer/components/StepItem';

import { SvgIcon } from '../SvgIcon';

import { AnimationMarkers } from './types';

import loc from '/loc';

export type SequenceSlide = {
  title: string;
  icon?: IconName;
};

type Props = {
  onButtonPress: () => void;
  animation: LottieViewProps['source'];
  animationMarkers: AnimationMarkers;
  buttonText: string;
  title: string;
  summaryTitle: string;
  slides: SequenceSlide[];
  slidesSummary: SequenceSlide[];
};

export const SequenceSlides: React.FC<Props> = ({ title, animation, summaryTitle, onButtonPress, animationMarkers, slides, slidesSummary }) => {
  const [slide, setSlide] = useState(0);
  const [hasFinishedSlides, setHasFinishedSlides] = useState(false);

  const lottieRef = useRef<LottieView>(null);

  const titles = useMemo(() => [{ title }, ...slides], [slides, title]);

  const runAnimationPart = useCallback(
    (index: number) => {
      setSlide(index);
      const markers = animationMarkers[`part-${index}`];
      setTimeout(() => {
        lottieRef.current?.play(markers.start, markers.end);
      }, 500);
    },
    [animationMarkers],
  );

  const switchToSlide = useCallback(
    (index: number) => {
      if (hasFinishedSlides) {
        return;
      }
      if (index > slides.length + 1) {
        setHasFinishedSlides(true);
        return;
      }
      runAnimationPart(index);
    },
    [hasFinishedSlides, slides.length, runAnimationPart],
  );

  const onAnimationFinish = (isCancelled: boolean) => {
    if (isCancelled) {
      return;
    }
    setTimeout(
      () => {
        switchToSlide(slide + 1);
      },
      slide === 1 ? 300 : 0,
    );
  };

  useEffect(() => {
    runAnimationPart(1);
    setSlide(1);
  }, [runAnimationPart]);

  const onPress = useCallback(() => {
    if (hasFinishedSlides) {
      onButtonPress();
    } else {
      switchToSlide(slide + 1);
    }
  }, [hasFinishedSlides, onButtonPress, slide, switchToSlide]);

  return (
    <Animated.View style={styles.flex} entering={FadeIn.duration(500).delay(300)}>
      <Animated.View style={styles.flex} exiting={SlideOutLeft}>
        <View style={styles.flex}>
          <LottieView
            ref={lottieRef}
            source={animation}
            loop={false}
            autoPlay={false}
            style={StyleSheet.absoluteFill}
            onAnimationFinish={onAnimationFinish}
            resizeMode="cover"
          />
        </View>

        <View style={styles.body}>
          {!hasFinishedSlides &&
            titles.map((s, i) =>
              i === slide - 1 ? (
                <Animated.View key={i} entering={FadeInUp.duration(500).delay(slide === 1 ? 1000 : 0)} exiting={FadeOutDown} style={styles.titleContainer}>
                  <Label type="boldDisplay3" style={styles.title}>
                    {s.title}
                  </Label>
                  {s.icon ? <SvgIcon size={34} style={styles.icon} name={s.icon} /> : undefined}
                </Animated.View>
              ) : null,
            )}

          {hasFinishedSlides && (
            <Animated.View entering={FadeIn.duration(600).delay(300)}>
              <Label type="boldDisplay3" style={styles.title}>
                {summaryTitle}
              </Label>
              <View style={styles.steps}>
                {slidesSummary.map((s, i) => (
                  <StepItem
                    key={i}
                    circleElement={
                      <Label type="boldTitle2" color="light100">
                        {i + 1}
                      </Label>
                    }
                    text={s.title}
                    icon={s.icon}
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.View>
      <FloatingBottomButtons
        primary={{
          text: loc.walletConnectExplainer.secondPage.buttonText,
          color: hasFinishedSlides ? undefined : 'light15',
          onPress,
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    transform: [{ translateY: -65 }],
    marginBottom: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    lineHeight: 40,
  },
  steps: {
    marginTop: 21,
  },
  icon: {
    marginLeft: 12,
  },
});
