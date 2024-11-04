import { StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';

import { useTheme } from '@/theme/themes';

import { useSwapContext } from '../SwapContext';

import loc from '/loc';

export const TargetAssetBlockEmpty: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  const {
    amountInputFocusState: [isAmountInputFocused],
  } = useSwapContext();

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isAmountInputFocused ? 0.75 : 1),
  }));

  const { colors } = useTheme();

  return (
    <Animated.View style={[styles.container, opacityStyle]}>
      <GradientItemBackground key="placeholder" backgroundType="modal" />
      <Label color="light15" type="boldDisplay5">
        0
      </Label>
      <Touchable onPress={onChange} style={[styles.selector, { backgroundColor: colors.purple_60 }]}>
        <View style={styles.icon}>
          <GradientItemBackground backgroundType="modalLight" />
          <SvgIcon size={24} name="plus" />
        </View>
        <Label>{loc.swap.selectAsset}</Label>
        <SvgIcon size={16} name="chevron-down" style={styles.chevron} />
      </Touchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    marginTop: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 4,
    borderRadius: 100,
    paddingRight: 12,
    overflow: 'hidden',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chevron: {
    marginLeft: -2,
  },
});
