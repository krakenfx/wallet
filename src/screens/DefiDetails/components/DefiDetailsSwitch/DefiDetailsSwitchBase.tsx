import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { type ColorName, useTheme } from '@/theme/themes';

import loc from '/loc';

const GAP = 8;

type Props = {
  unset: boolean;
  animatedstyle?: {
    transform: {
      translateX: number;
    }[];
  };
  containerWidth?: React.MutableRefObject<number>;
  onLayout?: (event: LayoutChangeEvent) => void;
  handle0?: () => void;
  handle1?: () => void;
  apy: string;
  apyColor: ColorName;
  tvl: string;
  tvlColor: ColorName;
};

export const DefiDetailsSwitchBase = ({ unset, animatedstyle, containerWidth, onLayout, handle0, handle1, apy, apyColor, tvl, tvlColor }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Touchable style={[styles.cell, unset && { backgroundColor: colors.dark15 }]} onPress={handle0} disabled={!handle0}>
        <Label type="boldCaption1" color="light50">
          {loc.earn.apy}
        </Label>
        <Label type="headerMarketDataPrice" color={apyColor} numberOfLines={1} adjustsFontSizeToFit>
          {apy}
        </Label>
      </Touchable>
      <Touchable style={[styles.cell, unset && { backgroundColor: colors.dark15 }]} onPress={handle1} disabled={!handle1}>
        <Label type="boldCaption1" color="light50">
          {loc.earn.tvl}
        </Label>
        <Label type="headerMarketDataPrice" color={tvlColor} numberOfLines={1} adjustsFontSizeToFit>
          {tvl}
        </Label>
      </Touchable>
      {!unset && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            animatedstyle,
            styles.slider,
            {
              backgroundColor: colors.purple_20,
              width: containerWidth ? containerWidth.current / 2 - GAP : 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    alignSelf: 'center',
    gap: GAP,
  },
  cell: {
    flex: 1,
    width: '50%',
    height: 70,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  slider: {
    position: 'absolute',
    height: '100%',
    width: '50%',
    minWidth: '50%',
    borderRadius: 16,
  },
});
