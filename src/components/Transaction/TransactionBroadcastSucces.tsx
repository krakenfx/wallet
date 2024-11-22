import LottieView from 'lottie-react-native';

import { StyleSheet } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  estimatedTime?: string;
};

export const TransactionBroadcastSuccess = ({ estimatedTime }: Props) => {
  return (
    <Animated.View entering={FadeIn} style={styles.success}>
      <LottieView source={require('@/assets/lottie/successCheckmark.json')} style={styles.lottie} autoPlay loop={false} />
      <Label type="boldDisplay4">{loc.send.successLabel}</Label>
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
