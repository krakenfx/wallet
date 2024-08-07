import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { CurvedTransition } from 'react-native-reanimated';

import { CardWarning } from '@/components/CardWarning';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { encryptRealmEncryptionKey, encryptSeedWithUserPassword } from '@/secureStore';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsSwitch } from '../components';
import { SettingsBox } from '../components/SettingsBox';
import { SettingsNavigationProps } from '../SettingsRouter';

import { MIN_PASSWORD_CHARS } from './consts';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export const PasswordProtectionFormScreen = ({ navigation: { goBack } }: SettingsNavigationProps<'PasswordProtectionForm'>) => {
  const [usePasswordToOpen, setUsePasswordToOpen] = useState(false);

  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const repeatPasswordInputRef = useRef<TextInput>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [firstInputFocused, setFirstInputFocused] = useState(true);
  const [secondInputFocused, setSecondInputFocused] = useState(false);

  useHeaderTitle(loc.passwordProtection.title);

  const handlePasswordChange = (value: string) => setPassword(value);
  const handleRepeatPasswordChange = (value: string) => setRepeatPassword(value);

  const onFirstInputFocus = () => setFirstInputFocused(true);
  const onFirstInputBlur = () => setFirstInputFocused(false);

  const onSecondInputFocus = () => setSecondInputFocused(true);
  const onSecondInputBlur = () => setSecondInputFocused(false);

  const bringSecondInputToFocus = () => repeatPasswordInputRef.current?.focus();

  const handleConfirmPassword = async () => {
    try {
      setIsLoading(true);
      await encryptSeedWithUserPassword(password);
      if (usePasswordToOpen) {
        await encryptRealmEncryptionKey(password);
      }
      goBack();
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = password.length >= MIN_PASSWORD_CHARS;
  const enabled = isPasswordValid && password === repeatPassword;
  const passwordMismatch = password && repeatPassword && password !== repeatPassword;
  const showMismatchError = passwordMismatch && !firstInputFocused && !secondInputFocused;

  return (
    <GradientScreenView>
      <View style={styles.container}>
        <Label style={styles.label}>{loc.passwordProtection.password}</Label>
        <Input
          style={styles.input}
          placeholder={loc.passwordProtection.typePassword}
          secureTextEntry
          autoFocus
          onFocus={onFirstInputFocus}
          onBlur={onFirstInputBlur}
          onSubmitEditing={bringSecondInputToFocus}
          returnKeyType="next"
          onChangeText={handlePasswordChange}
          value={password}
          borderColorOnFocus="kraken"
        />
        {password && firstInputFocused && <PasswordStrengthMeter password={password} />}
        <Animated.View layout={CurvedTransition}>
          <Input
            editable={isPasswordValid}
            ref={repeatPasswordInputRef}
            style={styles.input}
            placeholder={loc.passwordProtection.confirmPassword}
            testID="ConfirmPasswordInput"
            secureTextEntry
            returnKeyType="done"
            onChangeText={handleRepeatPasswordChange}
            onFocus={onSecondInputFocus}
            onBlur={onSecondInputBlur}
            value={repeatPassword}
            errorText={showMismatchError ? loc.passwordProtection.passwordMatchError : undefined}
            borderColorOnFocus="kraken"
          />
          {!password && (
            <CardWarning style={styles.card} title={loc.passwordProtection.warning} description={loc.passwordProtection.warningDescription} type="warning" />
          )}
          <SettingsBox isHighlighted isFirst style={styles.requireOnOpenBox}>
            <SettingsSwitch
              testID="RequireOnOpen"
              textColor="light50"
              text={loc.passwordProtection.requireOnOpen}
              enabled={usePasswordToOpen}
              onToggle={setUsePasswordToOpen}
            />
          </SettingsBox>
          <SettingsBox isHighlighted isLast style={styles.requireOnOpenDesc}>
            <Label type="regularCaption1" color="light50">
              {loc.passwordProtection.requireOnOpenDesc}
            </Label>
          </SettingsBox>
        </Animated.View>
        <FloatingBottomButtons
          primary={{
            loading: isLoading,
            disabled: !enabled,
            testID: 'ConfirmButton',
            text: loc.passwordProtection.confirm,
            onPress: handleConfirmPassword,
          }}
        />
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  label: {
    marginLeft: 16,
  },
  requireOnOpenBox: {
    marginTop: 24,
  },
  requireOnOpenDesc: {
    padding: 16,
  },
  input: {
    marginTop: 12,
  },
  card: {
    marginTop: 24,
  },
});

PasswordProtectionFormScreen.navigationOptions = navigationStyle({ title: loc.passwordProtection.title, headerTransparent: true });
