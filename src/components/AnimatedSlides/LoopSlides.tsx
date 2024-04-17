import LottieView, { LottieViewProps } from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { IconName, SvgIcon } from '@/components/SvgIcon';
import { AnimatedStepItem } from '@/screens/WalletConnectExplainer/components/AnimatedStepItem';

import { AnimationMarkers } from './types';

export type LoopSlide = {
  title: string;
  icon: IconName;
};

type Props = {
  onButtonPress: () => void;
  animation: LottieViewProps['source'];
  animationMarkers: AnimationMarkers;
  buttonText: string;
  title: string;
  subtitle: string;
  slides: LoopSlide[];
};

export const LoopSlides: React.FC<Props> = ({ animation, title, subtitle, onButtonPress, animationMarkers, slides, buttonText }) => {
  const [slide, setSlide] = useState(1);

  const lottieRef = useRef<LottieView>(null);

  const runAnimationPart = useCallback(
    (index: number) => {
      setSlide(index);
      const markers = animationMarkers[`part-${index}`];
      lottieRef.current?.play(markers.start, markers.end);
    },
    [animationMarkers],
  );

  const switchToSlide = useCallback(
    (index: number) => {
      if (index > slides.length) {
        switchToSlide(1);
        return;
      }
      setSlide(index);
      runAnimationPart(index);
    },
    [runAnimationPart, slides.length],
  );

  const onAnimationFinish = useCallback(
    (isCancelled: boolean) => {
      if (isCancelled) {
        return;
      }
      switchToSlide(slide + 1);
    },
    [slide, switchToSlide],
  );

  useEffect(() => {
    switchToSlide(1);
  }, [switchToSlide]);

  return (
    <Animated.View style={styles.flex} entering={FadeIn.duration(500).delay(200)}>
      <View style={styles.flex}>
        <LottieView ref={lottieRef} source={animation} loop={false} style={StyleSheet.absoluteFill} onAnimationFinish={onAnimationFinish} resizeMode="cover" />
      </View>
      <View style={styles.body}>
        <Label style={styles.title} type="boldDisplay3">
          {title}
        </Label>
        <View>
          <Label style={styles.subtitle} type="boldTitle2" color="light75">
            {subtitle}
          </Label>
          {slides.map((s, i) => (
            <AnimatedStepItem key={i} isActive={i === slide - 1} circleElement={<SvgIcon name={s.icon} size={18} />} text={s.title} />
          ))}
        </View>
      </View>
      <FloatingBottomButtons
        primary={{
          text: buttonText,
          onPress: onButtonPress,
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
  },
  title: {
    marginBottom: 21,
    lineHeight: 40,
  },
  subtitle: {
    marginBottom: 21,
  },
});
