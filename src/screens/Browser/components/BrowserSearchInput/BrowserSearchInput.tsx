import React from 'react';

import { Platform, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';

import { Touchable } from '@/components/Touchable';

import { useBrowserAnimationContext } from '../../context/BrowserAnimationContext';
import { useSearchContext } from '../../context/SearchContext';

import loc from '/loc';

const INPUT_HEIGHT = 45;

export const BrowserSearchInput = () => {
  const { searchValue, handleSearch, changeSearchValue, clearSearch } = useSearchContext();

  const { inputRef, animatedButtonStyle, animatedPlaceholderStyle, animatedInputStyle, onInputContainerLayout } = useBrowserAnimationContext();

  const onChangeText = (text: string) => changeSearchValue(text);

  return (
    <Animated.View style={animatedInputStyle} onLayout={onInputContainerLayout}>
      <Input
        ref={inputRef}
        autoFocus
        autoCapitalize="none"
        placeholder={loc.browser.searchOnChain}
        placeholderStyle={animatedPlaceholderStyle}
        value={searchValue}
        onChangeText={onChangeText}
        
        onEndEditing={handleSearch}
        onSubmitEditing={handleSearch}
        testID="BrowserSearchBarInput"
        left={
          <Animated.View style={animatedPlaceholderStyle}>
            <SvgIcon name="search" size={18} color="light50" style={styles.icon} />
          </Animated.View>
        }
        right={
          searchValue !== '' ? (
            <Animated.View style={[styles.inputRight, animatedButtonStyle]}>
              <Touchable onPress={clearSearch}>
                <Label type="boldCaption1" color="light50">
                  {loc.browser.clearSearch}
                </Label>
              </Touchable>
            </Animated.View>
          ) : undefined
        }
        style={styles.input}
        inputStyle={styles.inputComponent}
        inputWrapperStyle={styles.inputWrapper}
        containerStyle={styles.container}
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="search"
        clearButtonMode="never"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: INPUT_HEIGHT,
  },
  inputWrapper: {
    height: INPUT_HEIGHT,
  },
  input: {
    paddingVertical: 0,
  },
  inputComponent: {
    lineHeight: 20,
    marginTop: Platform.select({ android: 2 }),
  },
  icon: {
    marginRight: 8,
  },
  inputHeight: {
    height: INPUT_HEIGHT,
  },
  inputRight: {
    marginLeft: 10,
  },
});
