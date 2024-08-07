import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';

import { CloseButton } from '@/components/CloseButton';
import { Typography } from '@/components/Label';

import { Theme } from '@/theme/themes';

export type NavigationOptionsGetter = (theme: Theme) => () => NativeStackNavigationOptions;

export const navigationStyle = ({
  closeButton = false,
  ...opts
}: NativeStackNavigationOptions & {
  closeButton?: boolean;
}): NavigationOptionsGetter => {
  return theme => () => {
    let headerRight;
    if (closeButton) {
      headerRight = () => <CloseButton />;
    }

    let options: NativeStackNavigationOptions = {
      headerStyle: {
        backgroundColor: opts.headerTransparent ? undefined : theme.colors.background,
      },
      headerTitleStyle: {
        ...Typography.boldTitle1,
        color: theme.colors.light100,
      },
      headerRight: headerRight,
      headerBackTitleVisible: false,
      headerTintColor: theme.colors.light100,
      ...opts,
    };

    return options;
  };
};
