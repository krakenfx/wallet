import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { times } from 'lodash';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeOut, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { usePreventScreenCaptureLong } from '@/hooks/usePreventScreenCaptureLong';
import { useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';

import blurImage from './images/BlurredWords.png';

import loc from '/loc';

const PLACEHOLDER = times(12, String).join(' ');
interface SeedDisplayProps {
  compact?: boolean;
  seed?: string;
  isSeedVisible: boolean;
  onSeedReveal: () => Promise<void>;
  stickyHeader?: React.ReactNode;
  stickyFooter?: React.ElementType<{
    seedVisible: boolean;
    seed?: string;
  }>;
  scrollHeader?: React.ReactNode;
  scrollFooter?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const SeedDisplay = ({
  testID,
  compact,
  seed,
  isSeedVisible,
  style,
  stickyFooter: StickyFooter,
  stickyHeader,
  scrollFooter,
  scrollHeader,
  onSeedReveal,
}: SeedDisplayProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  usePreventScreenCaptureLong();

  const collapsed = compact && !isSeedVisible;

  const [leftWords, rightWords] = splitSeedIntoWords(seed || null, collapsed || false);

  const wordsHidden = !isSeedVisible || !seed;

  return (
    <View style={styles.flex} testID={testID}>
      {stickyHeader}

      <ScrollView style={style} contentContainerStyle={[!StickyFooter && { paddingBottom: insets.bottom }]}>
        {scrollHeader}
        <View style={styles.container}>
          <View style={[styles.listLeft, wordsHidden && styles.hidden]}>
            {leftWords.map(({ word, index }) => (
              <WordPill key={index} word={word} index={index} backgroundColor={colors.light8} />
            ))}
          </View>

          <View style={[styles.listRight, wordsHidden && styles.hidden]}>
            {rightWords.map(({ word, index }) => (
              <WordPill key={index} word={word} index={index} backgroundColor={colors.light8} />
            ))}
          </View>

          {!isSeedVisible && (
            <GestureDetector
              gesture={Gesture.Tap().onEnd(() => {
                runOnJS(hapticFeedback.impactLight)();
                runOnJS(onSeedReveal)();
              })}>
              <Animated.View style={styles.blurOverlay} exiting={collapsed ? undefined : FadeOut}>
                <Image
                  resizeMode={collapsed ? 'cover' : 'contain'}
                  source={blurImage}
                  style={[collapsed ? styles.blurImageCollapsed : styles.blurImageFullHeight]}
                />
                <View style={styles.tapInfo} testID="TapHereToView">
                  <SvgIcon name="eye" />
                  <Label color="light50">{loc.walletBackup.tapHereToView}</Label>
                </View>
              </Animated.View>
            </GestureDetector>
          )}
        </View>

        {scrollFooter}
      </ScrollView>

      {StickyFooter && <StickyFooter seedVisible={isSeedVisible} seed={seed} />}
    </View>
  );
};

interface WordPillProps {
  index: number;
  word: string;
  backgroundColor: string;
}

const WordPill: React.FC<WordPillProps> = ({ index, word, backgroundColor }) => {
  return (
    <View style={[styles.word, { backgroundColor }]}>
      <Label testID={`Word-${index}`} type="boldMonospace">
        <Label type="boldMonospace" color="light50">
          {index + 1}.
        </Label>{' '}
        {word}
      </Label>
    </View>
  );
};

function splitSeedIntoWords(seed: string | null, collapsed: boolean) {
  const wordsWithIndex = (seed || PLACEHOLDER).split(/\s/).map((word, index) => ({ word, index }));

  const splitPoint = Math.ceil(wordsWithIndex.length / 2);
  const left = wordsWithIndex.slice(0, splitPoint);
  const right = wordsWithIndex.slice(splitPoint);

  if (collapsed) {
    return [left.slice(0, 3), right.slice(0, 3)] as const;
  }

  return [left, right];
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 24,
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
  blurImageCollapsed: {
    width: '100%',
    maxHeight: 260,
  },
  blurImageFullHeight: {
    height: '100%',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
  },
  listLeft: {
    flex: 1,
    marginRight: 6,
    marginLeft: 12,
    marginTop: 12,
  },
  listRight: {
    flex: 1,
    marginLeft: 6,
    marginRight: 12,
    marginTop: 12,
  },
  word: {
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 100,
  },
});
