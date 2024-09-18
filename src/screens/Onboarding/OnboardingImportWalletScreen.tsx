import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, NativeSyntheticEvent, ScrollView, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import Animated, { FadeIn, FadeOut, SequencedTransition, runOnJS } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { KeyboardAvoider, KeyboardDoneInputAccessoryView } from '@/components/Keyboard';
import { Label, Typography } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { usePreventScreenCaptureLong } from '@/hooks/usePreventScreenCaptureLong';
import { Routes } from '@/Routes';
import { useValidationState } from '@/screens/Onboarding/hooks/useValidationState';
import { useTheme } from '@/theme/themes';
import { navigationStyle } from '@/utils/navigationStyle';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingWordButton } from './components/OnboardingWordButton';
import { useImportScreenAnimatedValues } from './hooks/useImportScreenAnimatedValues';
import { useImportWallet } from './hooks/useImportWallet';
import { OnboardingNavigationProps } from './OnboardingRouter';
import { getSeedWordIndex } from './utils/getSeedWordIndex';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

const validSeedLengths = new Set([12, 18, 24]);

export const OnboardingImportWalletScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingImportWallet'>) => {
  const { colors } = useTheme();
  const [words, setWords] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string>();
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [importing, setImporting] = useState(false);
  const [failedAttempt, setFailedAttempt] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [canDeleteWord, setCanDeleteWord] = useState(false);
  const validator = useValidationState({ resetWhenInvalid: false });
  usePreventScreenCaptureLong();

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const { importWallet } = useImportWallet();

  const wordIndex = useMemo(getSeedWordIndex, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd();
  }, [words]);

  const { suggestedWordsStyle, inputAreaStyle, layoutHandlers } = useImportScreenAnimatedValues();

  const currentSuggestedWords = wordIndex[inputValue.toLowerCase()];

  useDebounceEffect(() => setSuggestedWords(currentSuggestedWords), [currentSuggestedWords], 200);

  const hasInputBubble = !!inputValue || !words.length;

  const buttonDisabled = !validSeedLengths.has(words.length) || !!inputValue.length || failedAttempt || importing;

  const focusInput = () => inputRef.current?.focus();

  const clearAllErrors = useCallback(() => {
    if (failedAttempt) {
      setFailedAttempt(false);
      validator.setState(undefined);
    }
  }, [failedAttempt, validator]);

  const handlePaste = (text: string) => {
    const newWords = text
      ?.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .split(' ');

    if (validSeedLengths.has(newWords.length)) {
      setWords(newWords);
      Keyboard.dismiss();
    }
  };

  
  useDebounceEffect(() => setCanDeleteWord(!inputValue), [words, inputValue], 0);

  const onPastePress = useCallback(async () => {
    clearAllErrors();
    handlePaste(await Clipboard.getString());
  }, [clearAllErrors]);

  const onImport = useCallback(async () => {
    if (validator.state !== undefined) {
      return;
    }
    setImporting(true);
    try {
      if (await runAfterUISync(() => importWallet(words))) {
        validator.setState('valid', () => {
          navigation.replace(Routes.OnboardingSecureWallet);
        });
      } else {
        validator.setState('invalid', () => {
          focusInput();
          setFailedAttempt(true);
        });
      }
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.onboarding.import_error });
    } finally {
      setImporting(false);
    }
  }, [importWallet, navigation, validator, words]);

  const addWord = useCallback((word: string) => {
    setInputValue('');
    setSuggestion(undefined);
    setWords(currentWords => [...currentWords, word]);
  }, []);

  const applySuggestion = useCallback(() => {
    if (suggestion) {
      addWord(suggestion);
    }
  }, [addWord, suggestion]);

  const onChangeText = useCallback(
    (text: string) => {
      clearAllErrors();
      
      if (text.length > inputValue.length + 1) {
        const pastedValue = text.replace(inputValue, '');
        handlePaste(pastedValue);
        setInputValue('');
        return;
      }
      if (text.endsWith(' ')) {
        if (suggestion) {
          addWord(suggestion);
        } else if (text.trimEnd().length) {
          
          addWord(text.trimEnd());
        }
        return;
      }

      const newSuggestedWords = wordIndex[text.toLowerCase()];
      if (newSuggestedWords?.length === 1) {
        if (newSuggestedWords[0] === text) {
          addWord(text);
          return;
        }
        setSuggestion(newSuggestedWords[0]);
      } else {
        setSuggestion(undefined);
      }
      setInputValue(text);
    },
    [addWord, clearAllErrors, inputValue, suggestion, wordIndex],
  );

  const onBlur = () => {
    setIsFocused(false);
    if (suggestion) {
      addWord(suggestion);
    } else if (inputValue) {
      addWord(inputValue);
    }
  };

  const onFocus = () => setIsFocused(true);

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    switch (e.nativeEvent.key) {
      case 'Backspace': {
        if (canDeleteWord) {
          setWords(currentWords => currentWords.slice(0, -1));
        }
        break;
      }
    }
  };

  const buttonText = useMemo(() => {
    switch (validator.state) {
      case 'valid':
        return loc.onboardingImportWallet.valid;
      case 'invalid':
        return loc.onboardingImportWallet.invalid;
      default:
        return loc.onboardingImportWallet.import;
    }
  }, [validator.state]);

  const suggestedWordsList = (
    <Animated.ScrollView
      horizontal
      keyboardShouldPersistTaps="always"
      style={[suggestedWordsStyle, styles.suggestedWordScrollContainer]}
      contentContainerStyle={styles.suggestedWords}>
      {suggestedWords?.slice(0, 10).map(word => (
        <Animated.View key={word} entering={FadeIn} exiting={FadeOut} layout={SequencedTransition}>
          <OnboardingWordButton
            word={word}
            onPress={addWord}
            containerStyle={styles.suggestedWordContainer}
            buttonStyle={[styles.suggestedWordButton, { backgroundColor: colors.light15 }]}
            testID={`Suggestion-${word}`}
          />
        </Animated.View>
      ))}
    </Animated.ScrollView>
  );

  const prefix = <Label type="boldMonospace" color="light50" style={[styles.numberPrefix, styles.bubbleTextVerticalAlign]}>{`${words.length + 1}.`}</Label>;

  const tap = Gesture.Tap().onEnd(() => {
    if (!isFocused) {
      runOnJS(focusInput)();
    }
  });

  return (
    <GradientScreenView>
      <View style={styles.container} onLayout={layoutHandlers.container}>
        <OnboardingHeader
          title={validator.wasInvalid ? loc.onboardingImportWallet.headerInvalid : loc.onboardingImportWallet.header}
          caption={loc.onboardingImportWallet.caption}
          onLayout={layoutHandlers.header}
        />
        <Animated.View style={[styles.inputArea, { backgroundColor: colors.dark25 }, inputAreaStyle, validator.borderStyle]}>
          <GestureDetector gesture={tap}>
            <ScrollView keyboardShouldPersistTaps="handled" ref={scrollRef} contentContainerStyle={styles.wordsScrollContainer}>
              <View style={styles.wordsListWrapper}>
                {words.map((word, index) => (
                  <OnboardingWordButton key={`${word}_${index}`} word={word} prefix={`${index + 1}.`} containerStyle={styles.word} />
                ))}
                <View style={[styles.textInputWrapper, hasInputBubble && [styles.textInputWrapperFirst, { backgroundColor: colors.dark50 }]]}>
                  {hasInputBubble && prefix}
                  {!!suggestion && (
                    <View style={styles.suggestionShadow}>
                      {prefix}
                      <Label type="boldMonospace" style={styles.bubbleTextVerticalAlign}>
                        {suggestion}
                      </Label>
                    </View>
                  )}
                  <TextInput
                    ref={inputRef}
                    autoFocus={isFocused}
                    value={inputValue}
                    onChangeText={onChangeText}
                    inputAccessoryViewID={KeyboardDoneInputAccessoryView.InputAccessoryViewID}
                    style={[styles.textInput, { color: colors.light100 }, !hasInputBubble && styles.transparentInput]}
                    onKeyPress={onKeyPress}
                    autoCapitalize="none"
                    testID="ImportWalletInput"
                    spellCheck={false}
                    autoCorrect={false}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    importantForAutofill="no"
                    textContentType="none"
                    keyboardType="visible-password"
                    autoComplete="off"
                  />
                  {!!suggestion && <Touchable testID="InputSuggestionButton" onPress={applySuggestion} style={StyleSheet.absoluteFill} />}
                </View>
              </View>
            </ScrollView>
          </GestureDetector>
          <Touchable onPress={onPastePress} style={styles.pasteWrapper}>
            <Label type="regularCaption1" color="light50">
              {loc.onboardingImportWallet.paste}
            </Label>
          </Touchable>
        </Animated.View>
        <KeyboardAvoider style={styles.keyboardAvoider}>{suggestedWords?.length > 0 && suggestedWordsList}</KeyboardAvoider>
        <FloatingBottomButtons
          primary={{
            disabled: buttonDisabled,
            text: buttonText,
            loading: importing,
            loadingText: loc.onboardingImportWallet.loading,
            onPress: onImport,
            color: validator.color ?? 'kraken',
            testID: 'ImportButton',
            testIDModifier: validator.state ? (validator.state === 'valid' ? 'positive' : 'negative') : undefined,
          }}
        />
        <KeyboardDoneInputAccessoryView />
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    paddingHorizontal: 0,
    paddingVertical: 8,
    maxHeight: 34,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  textInputWrapperFirst: {
    paddingHorizontal: 12,
  },
  textInput: {
    ...Typography.boldMonospace,
    height: 34,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    minWidth: 60,
  },
  transparentInput: {
    color: 'transparent',
  },
  inputArea: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  wordsScrollContainer: {
    paddingBottom: 32,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  wordsListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    marginHorizontal: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  pasteWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  numberPrefix: {
    marginRight: 3,
  },
  keyboardAvoider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  suggestionShadow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 12,
    opacity: 0.75,
  },
  bubbleTextVerticalAlign: {
    height: 34,
    lineHeight: 34,
  },
  suggestedWords: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  suggestedWordContainer: {
    marginHorizontal: 4,
  },
  suggestedWordScrollContainer: {
    paddingVertical: 4,
  },
  suggestedWordButton: {
    paddingHorizontal: 20,
  },
});

OnboardingImportWalletScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
