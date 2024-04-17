import React, { useEffect, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import calculateLevel from 'react-native-password-strength-meter/src/utils/calculate-level';
import scorePassword from 'react-native-password-strength-meter/src/utils/score-password';

import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { ColorName, useTheme } from '@/theme/themes';

import { MIN_PASSWORD_CHARS } from './consts';

import loc from '/loc';

type Props = {
  password: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const patterns = {
  digits: /\d/,
  lower: /[a-z]/,
  upper: /[A-Z]/,
  letter: /[a-zA-Z]/,
  nonWords: /\W/,
};

const levels: { bars: number; label: string; color: ColorName }[] = [
  {
    bars: 1,
    label: loc.passwordProtection.passwordStrengthVeryWeak,
    color: 'red400',
  },
  {
    bars: 2,
    label: loc.passwordProtection.passwordStrengthWeak,
    color: 'red400',
  },
  {
    bars: 3,
    label: loc.passwordProtection.passwordStrengthAverage,
    color: 'yellow500',
  },
  {
    bars: 4,
    label: loc.passwordProtection.passwordStrengthStrong,
    color: 'green400',
  },
  {
    bars: 5,
    label: loc.passwordProtection.passwordStrengthSecure,
    color: 'green400',
  },
];

export const PasswordStrengthMeter: React.FC<Props> = ({ password, containerStyle }) => {
  const { colors } = useTheme();

  const currentLevel = calculateLevel(scorePassword(password, MIN_PASSWORD_CHARS, 100, patterns), levels);

  const renderLevels = () => (
    <View style={styles.row}>
      {levels.map((l, i) => (
        <LevelBar
          isActive={l.bars <= currentLevel.bars}
          isFirst={i === 0}
          isLast={i === levels.length - 1}
          inactiveColor={colors.light15}
          activeColor={colors[currentLevel.color]}
        />
      ))}
    </View>
  );

  const hint = useMemo(() => {
    if (password.length < MIN_PASSWORD_CHARS) {
      return loc.passwordProtection.passwordLengthError;
    }
    if (!(patterns.upper.test(password) && patterns.lower.test(password))) {
      return loc.passwordProtection.passwordHintLetters;
    }
    if (!patterns.digits.test(password)) {
      return loc.passwordProtection.passwordHintNumbers;
    }
    if (!patterns.nonWords.test(password)) {
      return loc.passwordProtection.passwordHintSpecialChars;
    }
    return loc.passwordProtection.passwordHintLonger;
  }, [password]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, containerStyle]}>
      <View style={[styles.row, styles.text]}>
        <Label type="regularBody" color="light75">
          {loc.passwordProtection.passwordStrength}
        </Label>
        <Label type="mediumBody" color={currentLevel.color} style={styles.levelMessage}>
          {currentLevel.label}
        </Label>
      </View>
      {renderLevels()}
      {currentLevel.bars < levels.length && (
        <Label type="regularBody" color="light50" style={styles.text}>
          {hint}
        </Label>
      )}
    </Animated.View>
  );
};

const LevelBar: React.FC<{
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
}> = ({ isActive, isFirst, isLast, activeColor, inactiveColor }) => {
  const active = useSharedValue(isActive);

  useEffect(() => {
    active.value = isActive;
  }, [active, isActive]);

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(active.value ? activeColor : inactiveColor),
  }));

  return <Animated.View style={[styles.levelBar, isFirst && styles.levelFirstBar, isLast && styles.levelLastBar, backgroundStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
  },
  levelMessage: {
    marginLeft: 12,
  },
  levelBar: {
    flex: 1,
    height: 7,
    marginHorizontal: 2.5,
  },
  levelFirstBar: {
    marginLeft: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  levelLastBar: {
    marginRight: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  text: {
    marginLeft: 4,
  },
});
