import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackNavigationOptions, NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { RouteProps } from '@/Routes';
import { useTheme } from '@/theme/themes';

import { DeleteAccountConfirmParams, DeleteAccountConfirmScreen } from './DeleteAccountConfirmScreen';
import { DeleteAccountVerifyBalanceParams, DeleteAccountVerifyBalanceScreen } from './DeleteAccountVerifyBalanceScreen';
import { EditAccountParams, EditAccountScreen } from './EditAccountScreen';

export type AccountStackParams = {
  DeleteAccountConfirm: DeleteAccountConfirmParams;
  DeleteAccountVerifyBalance: DeleteAccountVerifyBalanceParams;
  EditAccount: EditAccountParams;
};

const AccountStack = createNativeStackNavigator<AccountStackParams>();

export const AccountRouter = () => {
  const theme = useTheme();
  return (
    <AccountStack.Navigator initialRouteName="DeleteAccountConfirm">
      <AccountStack.Screen name="DeleteAccountConfirm" component={DeleteAccountConfirmScreen} options={DeleteAccountConfirmScreen.navigationOptions(theme)} />
      <AccountStack.Screen
        name="DeleteAccountVerifyBalance"
        component={DeleteAccountVerifyBalanceScreen}
        options={DeleteAccountVerifyBalanceScreen.navigationOptions(theme)}
      />
      <AccountStack.Screen name="EditAccount" component={EditAccountScreen} options={EditAccountScreen.navigationOptions(theme)} />
    </AccountStack.Navigator>
  );
};

const navigationOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'none',
  presentation: 'transparentModal',
  contentStyle: {
    backgroundColor: 'transparent',
  },
};

AccountRouter.navigationOptions = navigationOptions;

export type AccountNavigationProps<T extends keyof AccountStackParams> = CompositeScreenProps<
  NativeStackScreenProps<AccountStackParams, T>,
  NativeStackScreenProps<RouteProps>
>;
