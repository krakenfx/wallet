import React from 'react';
import { InputAccessoryView, Keyboard, Platform, View } from 'react-native';

import loc from '../../../loc';
import { useTheme } from '../../theme/themes';

import { ButtonLink } from './ButtonLink';

export const DONE_BUTTON_MAX_HEIGHT = 44;

export const KeyboardDoneInputAccessoryView = () => {
  const { colors } = useTheme();

  if (Platform.OS !== 'ios') {
    return null;
  }

  const inputView = (
    <View
      style={{
        backgroundColor: colors.iOSKeyboardAccessoryBg,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        maxHeight: DONE_BUTTON_MAX_HEIGHT,
        width: '100%',
      }}>
      <ButtonLink title={loc._.done} testID="KeyboardDoneButton" onPress={Keyboard.dismiss} />
    </View>
  );

  return <InputAccessoryView nativeID={KeyboardDoneInputAccessoryView.InputAccessoryViewID}>{inputView}</InputAccessoryView>;
};

KeyboardDoneInputAccessoryView.InputAccessoryViewID = 'KeyboardDoneInputAccessoryView';
