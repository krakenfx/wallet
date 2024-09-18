import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { BackupCompletionBadge } from './BackupCompletionBadge';

type Props = {
  icon: React.ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
  title: string;
  subtitle: string;
  centerIcon?: boolean;
  completed?: boolean;
  rightElement?: React.ReactNode;
  highlighted?: boolean;
  highlighDelayMs?: number;
  onPress: () => void;
} & (
  | {
      showCompletionState?: false | never;
      completionIconSize?: never;
      subtitleShort?: never;
    }
  | {
      showCompletionState: boolean;
      completionIconSize?: number;
      subtitleShort: string;
    }
);

export const BackupMethodSelector: React.FC<Props> = ({
  icon,
  completionIconSize = 29,
  title,
  subtitle,
  subtitleShort,
  onPress,
  showCompletionState,
  completed,
  centerIcon,
  containerStyle,
  rightElement,
  highlighted,
  highlighDelayMs = 0,
}) => {
  const completionIconStyle = !rightElement && styles.completionState;

  const { colors } = useTheme();

  const touchableStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withDelay(
        highlighDelayMs,
        withTiming(highlighted ? colors.kraken : colors.transparent, {
          duration: 1000,
        }),
      ),
    };
  }, [highlighted]);

  return (
    <Touchable onPress={onPress} style={[styles.container, containerStyle, touchableStyle]} disabled={completed}>
      <GradientItemBackground />
      <View style={[styles.content, centerIcon && styles.centerContent]}>
        {icon}
        <View style={styles.labels}>
          <Label type="boldTitle1">{title}</Label>
          <Label type="regularCaption1" color="light75">
            {showCompletionState && subtitleShort ? subtitleShort : subtitle}
          </Label>
        </View>
        {!!showCompletionState && <BackupCompletionBadge completed={completed} size={completionIconSize} style={completionIconStyle} />}
        {rightElement}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  centerContent: {
    alignItems: 'center',
  },
  labels: {
    gap: 4,
    flex: 1,
    marginLeft: 12,
  },
  completionState: {
    marginRight: 8,
  },
  completionEmpty: {
    borderWidth: 1,
  },
});
