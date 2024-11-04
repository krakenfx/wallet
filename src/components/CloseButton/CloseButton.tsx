import type { StyleProp, ViewStyle } from 'react-native';

import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';

import { IconButton } from '@/components/IconButton';
import { Routes } from '@/Routes';
import type { Theme } from '@/theme/themes';

export interface CloseButtonProps {
  goBackOnly?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => boolean | undefined | void;
  backgroundColor?: keyof Theme['colors'];
}

export const CloseButton = ({ goBackOnly, onPress, style, backgroundColor }: CloseButtonProps) => {
  const navigation = useNavigation();

  const onButtonPress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      if (!goBackOnly) {
        navigation.dispatch(StackActions.popToTop());
      }
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate(Routes.Home);
      }
    }
  }, [goBackOnly, navigation, onPress]);

  return <IconButton name="close" onPress={onButtonPress} testID="CloseButton" style={style} backgroundColor={backgroundColor} />;
};
