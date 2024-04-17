import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { DefaultBackButton } from '@/components/BackButton';
import { RouteProps } from '@/Routes';
import { useTheme } from '@/theme/themes';

import { SendConfirmRouteParams, SendConfirmScreen } from './SendConfirmScreen';
import { SendQRScanRouteParams, SendQRScanScreen } from './SendQRScanScreen';
import { SendRouteParams, SendScreen, navigationOptions as sendScreenOptions } from './SendScreen';

export type SendStackParams = {
  Send: SendRouteParams;
  SendConfirm: SendConfirmRouteParams;
  SendQRScan: SendQRScanRouteParams;
};

const SendSimpleStack = createNativeStackNavigator<SendStackParams>();
export const SendRouter = () => {
  const theme = useTheme();

  return (
    <SendSimpleStack.Navigator
      initialRouteName="Send"
      screenOptions={{
        headerLeft: DefaultBackButton,
        headerShadowVisible: false,
        headerTransparent: true,
      }}>
      <SendSimpleStack.Screen name="Send" component={SendScreen} options={sendScreenOptions} />
      <SendSimpleStack.Screen name="SendConfirm" component={SendConfirmScreen} options={SendConfirmScreen.navigationOptions(theme)} />
      <SendSimpleStack.Screen name="SendQRScan" component={SendQRScanScreen} options={SendQRScanScreen.navigationOptions(theme)} />
    </SendSimpleStack.Navigator>
  );
};

SendRouter.navigationOptions = {
  headerTransparent: true,
};

export type SendNavigationProps<T extends keyof SendStackParams> = CompositeScreenProps<
  NativeStackScreenProps<SendStackParams, T>,
  NativeStackScreenProps<RouteProps>
>;
