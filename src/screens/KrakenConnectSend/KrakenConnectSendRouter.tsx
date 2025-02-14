import { type NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';

import { DefaultBackButton } from '@/components/BackButton';
import type { RouteProps } from '@/Routes';

import { type KrakenConnectSendConfirmParams, KrakenConnectSendConfirmScreen } from '@/screens/KrakenConnectSend/KrakenConnectSendConfirmScreen';
import { KrakenConnectSendScreen, type KrakenConnectSendScreenNavigationParams } from '@/screens/KrakenConnectSend/KrakenConnectSendScreen';
import { useTheme } from '@/theme/themes';

import { navigationStyle } from '@/utils/navigationStyle';

import { KrakenConnectSendContextProvider } from './KrakenConnectContext';

import type { CompositeScreenProps } from '@react-navigation/native';

export type KrakenConnectSendStackParams = {
  KrakenConnectSend: KrakenConnectSendScreenNavigationParams;
  KrakenConnectSendConfirm: KrakenConnectSendConfirmParams;
};

const KrakenConnectSendStack = createNativeStackNavigator<KrakenConnectSendStackParams>();

export const KrakenConnectSendRouter = () => {
  const theme = useTheme();

  return (
    <KrakenConnectSendContextProvider>
      <KrakenConnectSendStack.Navigator
        initialRouteName="KrakenConnectSend"
        screenOptions={{
          headerLeft: DefaultBackButton,
          headerShadowVisible: false,
          headerTransparent: true,
        }}>
        <KrakenConnectSendStack.Screen
          name="KrakenConnectSend"
          component={KrakenConnectSendScreen}
          options={KrakenConnectSendScreen.navigationOptions(theme)}
        />
        <KrakenConnectSendStack.Screen
          name="KrakenConnectSendConfirm"
          component={KrakenConnectSendConfirmScreen}
          options={KrakenConnectSendConfirmScreen.navigationOptions(theme)}
        />
      </KrakenConnectSendStack.Navigator>
    </KrakenConnectSendContextProvider>
  );
};

KrakenConnectSendRouter.navigationOptions = navigationStyle({
  headerTransparent: true,
  headerShown: false,
  presentation: 'containedTransparentModal',
  contentStyle: {
    backgroundColor: 'transparent',
  },
  animation: 'slide_from_bottom',
});

export type KrakenConnectSendNavigationProps<T extends keyof KrakenConnectSendStackParams> = CompositeScreenProps<
  NativeStackScreenProps<KrakenConnectSendStackParams, T>,
  NativeStackScreenProps<RouteProps>
>;
