import LottieView from 'lottie-react-native';

import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  estimatedTime?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export const TransactionBroadcastSuccess = ({ label, estimatedTime, style }: Props) => {
  return (
    <Animated.View entering={FadeIn} style={[styles.success, style]}>
      <LottieView source={require('@/assets/lottie/successCheckmark.json')} style={styles.lottie} autoPlay loop={false} />
      <Label type="boldDisplay4">{label ?? loc.send.successLabel}</Label>
      {!!estimatedTime && (
        <Label type="regularBody" color="light50" style={styles.estimation}>
          {loc.formatString(loc.send.successEstimation, { time: estimatedTime })}
        </Label>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  estimation: {
    marginTop: 4,
  },
  success: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  lottie: {
    flex: 1,
    width: '35%',
  },
});
