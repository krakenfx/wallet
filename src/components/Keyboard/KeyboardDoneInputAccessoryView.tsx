import { InputAccessoryView, Keyboard, Platform, StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme/themes';

import { ButtonLink } from './ButtonLink';

import loc from '/loc';

export const DONE_BUTTON_MAX_HEIGHT = 44;

export const KeyboardDoneInputAccessoryView = () => {
  const { colors } = useTheme();

  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <InputAccessoryView nativeID={KeyboardDoneInputAccessoryView.InputAccessoryViewID}>
      <View style={[styles.view, { backgroundColor: colors.iOSKeyboardAccessoryBg }]}>
        <ButtonLink title={loc._.done} testID="KeyboardDoneButton" onPress={Keyboard.dismiss} />
      </View>
    </InputAccessoryView>
  );
};

KeyboardDoneInputAccessoryView.InputAccessoryViewID = 'KeyboardDoneInputAccessoryView';

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxHeight: DONE_BUTTON_MAX_HEIGHT,
    width: '100%',
  },
});
