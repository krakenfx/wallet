import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { isEqual, shuffle } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SequencedTransition } from 'react-native-reanimated';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { CheckBoxConfirmationSheet } from '@/components/Sheets';
import { Touchable } from '@/components/Touchable';
import { usePreventScreenCaptureLong } from '@/hooks/usePreventScreenCaptureLong';
import { useSettingsMutations } from '@/realm/settings';
import { OnboardingHeader, OnboardingWordButton } from '@/screens/Onboarding/components';
import { useValidationState } from '@/screens/Onboarding/hooks/useValidationState';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { useTheme } from '@/theme/themes';
import { runAfterUISync } from '@/utils/runAfterUISync';

import loc from '/loc';

interface Props {
  onVerifySuccess: () => void;
}

type WordElement = {
  word: string;
  id: number;
};

export const WalletBackupVerify = ({ onVerifySuccess }: Props) => {
  const { colors } = useTheme();
  const [selectedWords, setSelectedWords] = useState<WordElement[]>([]);
  const [availableWords, setAvailableWords] = useState<WordElement[]>([]);
  const { setManualBackupCompleted } = useSettingsMutations();
  const pasteWarningSheet = useRef<BottomSheetModalRef>(null);
  const [secret, setSecret] = useState('');
  usePreventScreenCaptureLong();

  const { getMnemonic } = useSecuredKeychain();

  const isFocused = useIsFocused();

  useEffect(() => {
    const getSecret = async () => {
      const response = await getMnemonic();
      const mnemonic = typeof response === 'boolean' ? false : response.secret;

      if (mnemonic) {
        setSecret(mnemonic);
      }
    };
    if (isFocused && !secret) {
      getSecret();
    }
  }, [isFocused, secret, getMnemonic]);

  const secretElements = useMemo(
    () =>
      secret.split(/\s/).map((word, id) => ({
        word,
        id,
      })),
    [secret],
  );

  const numberOfWords = secret.split(/\s/).length;

  const validator = useValidationState();

  const resetAvailableWords = useCallback(() => setAvailableWords(shuffle(secretElements)), [secretElements]);

  const onVerify = useCallback(() => {
    if (
      isEqual(
        secretElements.map(e => e.word),
        selectedWords.map(e => e.word),
      )
    ) {
      validator.setState('valid', () => {
        setManualBackupCompleted();
        onVerifySuccess();
      });
    } else {
      validator.setState('invalid');
    }
  }, [onVerifySuccess, secretElements, selectedWords, setManualBackupCompleted, validator]);

  const onPaste = useCallback(async () => {
    const pastedSeed = (await Clipboard.getString())
      ?.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, ' ');

    if (pastedSeed !== secret) {
      return;
    }

    setAvailableWords([]);
    setSelectedWords(pastedSeed.split(/\s/).map((word, id) => ({ word, id })));
    runAfterUISync(() => {
      pasteWarningSheet.current?.present();
    });
  }, [secret]);

  const onSelectedWordPress = useCallback((word: string, id: number) => {
    setAvailableWords(words => [...words, { word, id }]);
    setSelectedWords(words => words.filter(w => w.id !== id));
  }, []);

  const onAvailableWordPress = useCallback((word: string, id: number) => {
    setAvailableWords(words => words.filter(w => w.id !== id));
    setSelectedWords(words => [...words, { word, id }]);
  }, []);

  useEffect(() => {
    resetAvailableWords();
  }, [resetAvailableWords, secret]);

  const buttonText = useMemo(() => {
    switch (validator.state) {
      case 'valid':
        return loc.onboardingBackupVerify.verified;
      case 'invalid':
        return loc.onboardingBackupVerify.failed;
      default:
        return loc.onboardingBackupVerify.verify;
    }
  }, [validator.state]);

  const onPastedPhraseVerified = () => {
    pasteWarningSheet.current?.close();
  };
  const onPastedPhraseCanceled = () => {
    pasteWarningSheet.current?.close();
    setSelectedWords([]);
    resetAvailableWords();
  };

  return (
    <View style={styles.flex} testID="WalletBackupVerifyScreen">
      <OnboardingHeader
        testID={validator.wasInvalid ? 'TryAgainHeader' : 'VerifyBackupHeader'}
        title={validator.wasInvalid ? loc.onboardingBackupVerify.retry : loc.onboardingBackupVerify.title}
        caption={loc.onboardingBackupVerify.caption}
      />
      <View style={styles.container}>
        <Animated.View style={[styles.selectedWordList, { backgroundColor: colors.dark25 }, validator.borderStyle]}>
          <View style={styles.selectedWordsListWrapper}>
            {selectedWords.map(({ word, id }, index) => (
              <Animated.View key={id} layout={SequencedTransition} entering={FadeIn} exiting={FadeOut}>
                <OnboardingWordButton testID={`SelectedWord-${word}`} id={id} word={word} prefix={`${index + 1}.`} onPress={onSelectedWordPress} />
              </Animated.View>
            ))}
          </View>

          <Touchable onPress={onPaste} style={styles.pasteWrapper}>
            <Label type="regularBody" color="light50" testID="PasteButton">
              {loc.onboardingBackupVerify.paste}
            </Label>
          </Touchable>
        </Animated.View>
      </View>

      <ScrollView style={styles.availableWordsScroll}>
        <Animated.View style={styles.availableWordList}>
          {availableWords.map(({ word, id }) => (
            <Animated.View key={id} layout={SequencedTransition} entering={FadeIn} exiting={FadeOut}>
              <OnboardingWordButton word={word} id={id} onPress={onAvailableWordPress} testID={`AvailableWord-${word}`} />
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
      <FloatingBottomButtons
        noAbsolutePosition
        primary={{
          text: buttonText,
          testID: 'VerifyButton',
          testIDModifier: validator.state ? (validator.state === 'valid' ? 'positive' : 'negative') : undefined,
          onPress: onVerify,
          color: validator.color ?? 'kraken',
          disabled: selectedWords.length !== numberOfWords,
        }}
      />
      <CheckBoxConfirmationSheet
        testID="PasteWarning"
        ref={pasteWarningSheet}
        title={loc.onboardingBackupVerify.pasteWarning.title}
        checkBoxLabels={[loc.onboardingBackupVerify.pasteWarning.checkOne, loc.onboardingBackupVerify.pasteWarning.checkTwo]}
        confirmButtonProps={{
          text: loc.onboardingBackupVerify.pasteWarning.confirm,
          onPress: onPastedPhraseVerified,
          testID: 'PasteWarningConfirmButton',
        }}
        cancelButtonProps={{
          text: loc.onboardingBackupVerify.pasteWarning.back,
          onPress: onPastedPhraseCanceled,
          testID: 'PasteWarningBackButton',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    marginHorizontal: 12,
    minHeight: 180,
    flex: 1,
    marginBottom: 24,
    marginTop: 24,
  },
  availableWordsScroll: {
    marginBottom: 16,
  },
  selectedWordList: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 32,
    borderRadius: 16,
    flex: 1,
    borderWidth: 1,
  },
  selectedWordsListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pasteWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 18,
  },
  availableWordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 18,
  },
});
