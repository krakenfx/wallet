import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { useShakeAnimation } from './hooks';
import globalLock from './images/walletLock.png';

import loc from '/loc';

type Props = {
  onConfirm: (password: string) => void;
  isLoading?: boolean;
  errorTimeout?: number;
  header?: string;
  description?: string;
  buttonText: string;
  buttonTestID?: string;
  headerErrorText?: string;
  descriptionErrorText?: string;
  buttonErrorText?: string;
  isLocked?: boolean;
  disabled?: boolean;
};

export type LockScreenRef = {
  showError: () => void;
};

export const LockScreen = React.forwardRef<LockScreenRef, Props>(
  (
    {
      isLoading,
      onConfirm,
      header,
      headerErrorText,
      descriptionErrorText,
      description,
      buttonErrorText,
      buttonText,
      errorTimeout = 600,
      buttonTestID,
      isLocked,
      disabled,
    },
    ref,
  ) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { colors } = useTheme();
    const { shake, animatedStyle } = useShakeAnimation();

    const window = useWindowDimensions();

    const showError = useCallback(() => {
      setError(true);
      hapticFeedback.notificationError();
      shake(() => {
        setTimeout(() => setError(false), errorTimeout);
      });
    }, [errorTimeout, shake]);

    useImperativeHandle(ref, () => ({ showError }), [showError]);

    const handleChangeText = (text: string) => {
      setPassword(text);
      setError(false);
    };

    const confirm = () => onConfirm(password);

    const inputColor = error ? colors.red400 : colors.light100;

    return (
      <Animated.View style={styles.container}>
        <View style={styles.content}>
          <Image style={[styles.imageWrapper, window.height < 700 && styles.smallImage]} source={globalLock} resizeMode="contain" />
          <Animated.View style={styles.labels} entering={FadeIn}>
            <Label type="boldDisplay4" style={styles.header} testID={`ErrorMessage-${error}`}>
              {error && !isLocked ? headerErrorText : header}
            </Label>
            {isLocked ? (
              <Label type="regularBody" color="light75">
                {loc.passwordProtection.lockout}
              </Label>
            ) : (
              <Label type="regularBody" color="light75" style={styles.desc}>
                {error ? descriptionErrorText : description}
              </Label>
            )}
          </Animated.View>
          {!isLocked && !disabled && (
            <Input
              type="boldDisplay3"
              selectionColor={inputColor}
              inputStyle={{ color: inputColor }}
              autoFocus
              style={[styles.input, animatedStyle]}
              containerStyle={styles.inputContainer}
              transparent
              secureTextEntry
              textContentType="password"
              onChangeText={handleChangeText}
              value={password}
              hideDoneAccessoryView
              testID="PasswordProtectionInput"
            />
          )}
        </View>
        <FloatingBottomButtons
          avoidKeyboard
          primary={{
            disabled: isLocked || !password || error || isLoading,
            color: error ? 'red400' : undefined,
            testID: buttonTestID,
            text: error && buttonErrorText ? buttonErrorText : buttonText,
            onPress: confirm,
          }}
        />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
  },
  content: {
    alignItems: 'center',
    marginBottom: 16,
    flex: 1,
  },
  desc: {
    textAlign: 'center',
  },
  labels: {
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  imageWrapper: {
    marginTop: 8,
  },
  smallImage: {
    height: 130,
  },
  input: {
    flex: 1,
    paddingVertical: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginVertical: 16,
    paddingTop: 0,
  },
});
