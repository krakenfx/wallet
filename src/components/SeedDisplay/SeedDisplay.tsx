import { useIsFocused } from '@react-navigation/native';
import { times } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeOut, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePreventScreenCaptureLong } from '@/hooks/usePreventScreenCaptureLong';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';
import { useAppState } from '@/utils/useAppState';

import { Label } from '../Label';
import { SvgIcon } from '../SvgIcon';

import blurImage from './images/BlurredWords.png';

import loc from '/loc';

interface SeedDisplayProps {
  initiallyRevealed?: boolean;
  style?: StyleProp<ViewStyle>;
  footer?: (seedVisible: boolean, seed?: string) => React.ReactElement;
  header?: () => React.ReactElement;
  testID?: string;
}

const PLACEHOLDER = times(12, String).join(' ');

export const SeedDisplay = ({ style, header, footer, initiallyRevealed, testID }: SeedDisplayProps) => {
  const { colors } = useTheme();
  const [seedVisible, setSeedVisible] = useState(!!initiallyRevealed);
  const insets = useSafeAreaInsets();

  usePreventScreenCaptureLong();

  const isFocused = useIsFocused();

  const [seedToShow, setSeedToShow] = useState<string>();

  const { getMnemonic } = useSecuredKeychain();

  const appState = useAppState();

  useEffect(() => {
    if (appState !== 'active') {
      setSeedVisible(false);
      setSeedToShow(undefined);
    }
  }, [appState]);

  const fetchSeed = useCallback(async () => {
    const seed = await getMnemonic();
    if (seed) {
      setSeedToShow(seed);
    }
  }, [getMnemonic]);

  useEffect(() => {
    (async function () {
      if (initiallyRevealed && !seedToShow && isFocused) {
        await fetchSeed();
        setSeedVisible(true);
      }
    })();
  }, [fetchSeed, initiallyRevealed, isFocused, seedToShow]);

  const onBlurPress = async () => {
    if (!seedToShow) {
      await fetchSeed();
    }
    setSeedVisible(true);
  };

  const [wordsLeft, wordsRight] = useMemo(() => {
    const component = [];
    for (const [index, word] of (seedToShow || PLACEHOLDER)?.split(/\s/)?.entries()) {
      const text = ` ${word}`;
      component.push(
        <View style={[styles.word, { backgroundColor: colors.light8 }]} key={index}>
          <Label testID={`Word-${index}`} type="boldMonospace">
            <Label type="boldMonospace" color="light50">
              {index + 1}.
            </Label>
            {text}
          </Label>
        </View>,
      );
    }

    const splitPoint = Math.ceil(component.length / 2);

    return [component.slice(0, splitPoint), component.slice(splitPoint)];
  }, [colors.light8, seedToShow]);

  const wordsHidden = !seedVisible || !seedToShow;

  return (
    <View style={styles.flex} testID={testID}>
      {!!header && header()}
      <ScrollView style={style} contentContainerStyle={[styles.scroll, !footer && { paddingBottom: insets.bottom }]}>
        <View style={styles.container}>
          {!seedVisible && (
            <GestureDetector
              gesture={Gesture.Tap().onEnd(() => {
                runOnJS(hapticFeedback.impactLight)();
                runOnJS(onBlurPress)();
              })}>
              <View style={styles.blurOverlay}>
                <Animated.View exiting={FadeOut} style={styles.blur}>
                  <Image resizeMode="stretch" source={blurImage} style={styles.image} />
                </Animated.View>
                <View style={styles.tapInfo} testID="TapHereToView">
                  <SvgIcon name="eye" />
                  <Label color="light50">{loc.walletBackup.tapHereToView}</Label>
                </View>
              </View>
            </GestureDetector>
          )}
          <View style={[styles.listLeft, wordsHidden && styles.hidden]}>{wordsLeft}</View>
          <View style={[styles.listRight, wordsHidden && styles.hidden]}>{wordsRight}</View>
        </View>
      </ScrollView>
      {!!footer && footer(seedVisible, seedToShow)}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
  },
  tapInfo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    top: -8,
    bottom: 0,
    right: -8,
    left: -8,
    overflow: 'hidden',
    borderRadius: 24,
  },
  scroll: {
    paddingTop: 12,
  },
  container: {
    flexDirection: 'row',
    marginHorizontal: 12,
  },
  listLeft: {
    flex: 1,
    marginRight: 12,
  },
  listRight: {
    flex: 1,
  },
  word: {
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 100,
  },
});
