import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { type AnimatedStyle, FadeIn, FadeOut } from 'react-native-reanimated';

import { KeyboardDoneInputAccessoryView } from '@/components/Keyboard';
import type { LabelProps, TypographyKey } from '@/components/Label';
import { Label, Typography } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { useInputBackground } from '@/hooks/useInputBackground';
import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  autoFocus?: boolean;
  editable?: boolean;
  value?: string;
  left?: React.ReactElement;
  right?: React.ReactElement;
  footerLeft?: LocalizedString;
  footerRight?: LocalizedString;
  footerLeftProps?: LabelProps;
  footerRightProps?: LabelProps;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
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
  errorInside?: boolean;
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

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

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
      errorInside,
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

    const error = props.errorText && (
      <Animated.View style={styles.error} entering={FadeIn} exiting={FadeOut} testID={props.errorMessageTestID ?? 'InputErrorMessage'}>
        <SvgIcon name="warning-filled" color="red400" size={16} />
        <Label type="regularCaption1" color="red400">
          {props.errorText}
        </Label>
      </Animated.View>
    );

    let input = (
      <AnimatedInput
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
          <Animated.View style={[styles.container, style, backgroundStyle, props.backgroundStyle]}>
            {input}
            {(!!footerLeft || !!footerRight) && (
              <Animated.View style={styles.footerContainer} testID={`Footer-${testID}`}>
                {footerLeft && (
                  <Label entering={FadeIn} exiting={FadeOut} type="regularBody" style={[!!footerRight && styles.footerLeft]} {...props.footerLeftProps}>
                    {footerLeft}
                  </Label>
                )}
                <Label type="mediumBody" color="light50" style={styles.footerRight} testID={`FooterRight-${testID}`} {...props.footerRightProps}>
                  {footerRight}
                </Label>
              </Animated.View>
            )}
            {!!errorInside && error}
          </Animated.View>
        </TouchableWithoutFeedback>
        {!errorInside && error}
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
