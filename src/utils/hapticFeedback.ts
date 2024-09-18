import { fromPairs } from 'lodash';
import { Platform, Vibration } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const supportedFeedbackTypes = ['impactLight', 'impactHeavy', 'soft', 'notificationSuccess', 'notificationError'] as const;

export type SupportedFeedbackType = (typeof supportedFeedbackTypes)[number];


const vibrationFeedback: Record<SupportedFeedbackType, number[]> = {
  soft: [0, 4],
  impactLight: [0, 3],
  impactHeavy: [0, 8],
  notificationError: [0, 4, 100, 4, 100, 4, 100, 10],
  notificationSuccess: [0, 10, 150, 5],
};

export const triggerHapticFeedback = Platform.select({
  ios: (type: SupportedFeedbackType) => ReactNativeHapticFeedback.trigger(type),
  default: (type: SupportedFeedbackType) => Vibration.vibrate(vibrationFeedback[type]),
});


export const hapticFeedback = fromPairs(supportedFeedbackTypes.map(type => [type, () => triggerHapticFeedback(type)])) as Record<
  SupportedFeedbackType,
  () => void
>;
