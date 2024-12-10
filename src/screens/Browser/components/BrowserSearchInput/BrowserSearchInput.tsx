import { useState } from 'react';

import { type NativeSyntheticEvent, Platform, StyleSheet, type TextInputFocusEventData } from 'react-native';

import Animated from 'react-native-reanimated';

import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';

import { Touchable } from '@/components/Touchable';

import { useBrowserAnimationContext } from '../../context/BrowserAnimationContext';
import { useSearchContext } from '../../context/SearchContext';

import loc from '/loc';

const INPUT_HEIGHT = 45;

interface Selection {
  start: number;
  end: number;
}

interface BrowserSearchInputProps {
  url: string | null;
  onRefreshPage: () => void;
}

export const BrowserSearchInput: React.FC<BrowserSearchInputProps> = ({ url, onRefreshPage }) => {
  const { searchValue, hideSearch, handleSearch, changeSearchValue, clearSearch } = useSearchContext();
  const [selection, setSelection] = useState<Selection | undefined>();

  const { inputRef, animatedButtonStyle, animatedPlaceholderStyle, animatedInputStyle, onInputContainerLayout } = useBrowserAnimationContext();

  const onChangeText = (text: string) => {
    if (Platform.OS === 'android' && selection) {
      setSelection(undefined);
    }

    changeSearchValue(text);
  };

  const selectTextOnFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (Platform.OS === 'android') {
      setSelection({ start: 0, end: searchValue?.length });
    } else {
      event.currentTarget.setNativeProps({
        selection: { start: 0, end: searchValue?.length },
      });
    }
  };

  const handleRefresh = () => {
    hideSearch();
    onRefreshPage();
  };

  return (
    <Animated.View style={animatedInputStyle} onLayout={onInputContainerLayout}>
      <Input
        ref={inputRef}
        autoFocus
        autoCapitalize="none"
        selection={selection}
        placeholder={loc.browser.searchOnChain}
        placeholderStyle={animatedPlaceholderStyle}
        value={searchValue}
        onFocus={selectTextOnFocus}
        onChangeText={onChangeText}
        onEndEditing={handleSearch}
        onSubmitEditing={handleSearch}
        testID="BrowserSearchBarInput"
        left={
          <Animated.View style={animatedPlaceholderStyle}>
            {url === null ? (
              <SvgIcon name="search" size={18} color="light50" style={styles.icon} />
            ) : (
              <SvgIcon name="redo" size={20} color="light100" style={styles.icon} onPress={handleRefresh} />
            )}
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
