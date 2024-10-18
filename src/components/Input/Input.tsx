import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { KeyboardDoneInputAccessoryView } from '@/components/Keyboard';
import { Label, Typography, TypographyKey } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { useInputBackground } from '@/hooks/useInputBackground';
import { ColorName, useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  autoFocus?: boolean;
  editable?: boolean;
  value?: string;
  left?: React.ReactElement;
  right?: React.ReactElement;
  footerLeft?: LocalizedString;
  footerRight?: LocalizedString;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  shrinkInput?: boolean;
  transparent?: boolean;
  type?: TypographyKey;
  placeholderStyle?: ViewStyle;
  placeholderType?: TypographyKey;
  testID?: string;
  inputTestID?: string;
  hideDoneAccessoryView?: boolean;
  errorText?: string;
  errorMessageTestID?: string;
  borderColorOnFocus?: ColorName;
  borderColorOnBlur?: ColorName;
  backgroundColor?: ColorName;
}

export type InputMethods = {
  focus: () => void;
  blur: () => void;
};

const Placeholder = ({
  type,
  placeholder,
  placeholderType,
  placeholderStyle,
}: Pick<InputProps, 'type' | 'placeholder' | 'placeholderType' | 'placeholderStyle'>) => {
  const actualType = placeholderType || type || 'regularBody';

  return (
    <Animated.View entering={FadeIn} style={[styles.placeholder, placeholderStyle]}>
      <Label type={actualType} color="light50">
        {placeholder}
      </Label>
    </Animated.View>
  );
};

export const Input = React.forwardRef<InputMethods, InputProps>(
  (
    {
      footerLeft,
      footerRight,
      type,
      style,
      inputStyle,
      containerStyle,
      inputWrapperStyle,
      left,
      right,
      testID,
      inputTestID,
      shrinkInput,
      hideDoneAccessoryView,
      placeholderType,
      placeholder,
      placeholderStyle,
      textAlign,
      ...props
    },
    ref,
  ) => {
    const { backgroundStyle, ...inputProps } = useInputBackground(props);

    const { colors } = useTheme();

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (props.errorText) {
        hapticFeedback.notificationError();
      }
    }, [props.errorText]);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
      }),
      [],
    );

    const handlePress = () => inputRef.current?.focus();

    let input = (
      <TextInput
        ref={inputRef}
        style={[styles.inputReset, { color: colors.light100 }, Typography[type || 'regularBody'], { lineHeight: undefined }, inputStyle]}
        selectionColor={colors.kraken}
        cursorColor={colors.kraken}
        autoCorrect={false}
        textAlign={textAlign}
        testID={inputTestID}
        inputAccessoryViewID={!hideDoneAccessoryView ? KeyboardDoneInputAccessoryView.InputAccessoryViewID : undefined}
        {...props}
        {...inputProps}
      />
    );

    input = (
      <View style={[styles.inputWrapper, inputWrapperStyle]} testID={`Wrapper-${testID}`}>
        {left}
        <View style={[!shrinkInput && styles.flex]}>
          {!!placeholder && !props.value && (
            <Placeholder type={type} placeholder={placeholder} placeholderType={placeholderType} placeholderStyle={placeholderStyle} />
          )}
          {input}
        </View>
        {right}
      </View>
    );

    return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback onPress={handlePress} testID={testID}>
          <Animated.View style={[styles.container, style, backgroundStyle]}>
            {input}
            {(!!footerLeft || !!footerRight) && (
              <Animated.View style={styles.footerContainer} testID={`Footer-${testID}`}>
                {footerLeft && (
                  <Label entering={FadeIn} exiting={FadeOut} type="regularBody" style={[!!footerRight && styles.footerLeft]}>
                    {footerLeft}
                  </Label>
                )}
                <Label type="mediumBody" color="light50" style={styles.footerRight} testID={`FooterRight-${testID}`}>
                  {footerRight}
                </Label>
              </Animated.View>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
        {props.errorText && (
          <Animated.View style={styles.error} entering={FadeIn} exiting={FadeOut} testID={props.errorMessageTestID ?? 'InputErrorMessage'}>
            <SvgIcon name="warning-filled" color="red400" size={16} />
            <Label type="regularCaption1" color="red400">
              {props.errorText}
            </Label>
          </Animated.View>
        )}
        {!hideDoneAccessoryView && <KeyboardDoneInputAccessoryView />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
  },
  inputReset: {
    padding: 0,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerRight: {
    textAlign: 'right',
    flex: 1,
  },
  footerLeft: {
    maxWidth: '50%',
    marginRight: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
  },
});
