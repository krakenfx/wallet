import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { useAnimatedKeyboard } from 'react-native-reanimated';

import { useCheckAndSetFontScale } from '@/hooks/useCheckAndSetFontScale';
import { useDebugInfo } from '@/hooks/useDebugInfo';
import { useMonitorPendingTransactions } from '@/hooks/useMonitorPendingTransactions';
import { useRealm } from '@/realm/RealmContext';
import { useRegisterRefreshManager } from '@/realm/refreshManagerHooks';
import { useLanguage } from '@/realm/settings';
import type { RealmWallet } from '@/realm/wallets';
import { REALM_TYPE_WALLET } from '@/realm/wallets';
import { AccountRouter, AdvancedAccountInfoScreen, ExtendedPublicKeyScreen } from '@/screens/Accounts';
import {
  WalletConnectSignRequest_GenericMessageScreen,
  WalletConnectSignRequest_GenericTransactionScreen,
  WalletConnectSignRequest_StructuredTransactionScreen,
} from '@/screens/AppSignRequest';
import { CoinsListScreen } from '@/screens/CoinsList';
import { ConnectAppScreen, ConnectWalletConnectAppScreen } from '@/screens/ConnectApp';
import { ConnectAppQRScanScreen } from '@/screens/ConnectAppQRScan';
import { DebugScreen } from '@/screens/DebugScreen';
import { DefiDetailsScreen } from '@/screens/DefiDetails';
import { EditNoteScreen } from '@/screens/EditNoteScreen';
import { ExplainerScreen } from '@/screens/Explainer';
import { ExploreScreen, ExploreSubpageScreen } from '@/screens/Explore';
import { GlobalActivityScreen } from '@/screens/GlobalActivity';
import { HomeScreen } from '@/screens/Home';
import { KrakenConnectTransferScreen } from '@/screens/KrakenConnectTransfer/KrakenConnectTransferScreen';
import { ManageAssetsGlobalFilterScreen } from '@/screens/ManageAssetsGlobalFilter';

import { MarketDataInfoScreen } from '@/screens/MarketDataInfoScreen';
import { ManageNftScreen, NftCollectionScreen, NftImageGalleryScreen, NftsScreen, ViewNftScreen } from '@/screens/Nfts';
import { OnboardingRouter } from '@/screens/Onboarding';
import { ReceiveScreen, UniversalReceiveScreen } from '@/screens/Receive';
import { SendQRScanScreen, SendRouter } from '@/screens/Send';
import { AppDetailsScreen, ConnectedAppsScreen, DiagnosticsScreen, LanguageScreen, NotificationsScreen, SettingsRouter } from '@/screens/Settings';
import { TransactionDetailsScreen, TransactionsScreen } from '@/screens/Transactions';
import { TriggeredPushPromptScreen } from '@/screens/TriggerredPushPromptScreen';
import { UniversalSendScreen } from '@/screens/UniversalSend';
import { WalletBackupPromptScreen } from '@/screens/WalletBackupPrompt';
import { WalletConnectExplainerScreen } from '@/screens/WalletConnectExplainer';
import { WhatsNewAvaxLineaScreen, WhatsNewSwaps } from '@/screens/WhatsNew';

import { useConnectionManager } from '@/utils/useConnectionManager';

import { DefaultBackButton } from './components/BackButton';

import { BrowserScreen } from './screens/Browser';
import { KrakenConnectScreen } from './screens/KrakenConnect/KrakenConnectScreen';
import { SwapScreen } from './screens/Swap';
import { WhatsNewBrowserExploreScreen } from './screens/WhatsNew/WhatsNewBrowserExploreScreen';
import { useTheme } from './theme/themes';

import type { RouteProps } from './Routes';

import { saveLanguage } from '/loc';
import { useHandleConnectToDappWalletConnectRequests } from '/modules/wallet-connect/hooks';

const DefaultStack = createNativeStackNavigator<RouteProps>();

const NavigationStack = () => {
  const theme = useTheme();
  const realm = useRealm();
  const language = useLanguage();
  useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  useCheckAndSetFontScale();
  useRegisterRefreshManager();
  useConnectionManager();
  useMonitorPendingTransactions();
  useDebugInfo();
  useHandleConnectToDappWalletConnectRequests();

  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  const initialWalletsCount = realm.objects<RealmWallet>(REALM_TYPE_WALLET).snapshot().length;

  if (initialWalletsCount === undefined) {
    return null;
  }

  return (
    <DefaultStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerLeft: DefaultBackButton,
        headerBackVisible: false,
        headerTitleAlign: 'center',
        navigationBarColor: theme.colors.background,
      }}
      initialRouteName={initialWalletsCount > 0 ? 'Home' : 'Onboarding'}>
      <DefaultStack.Screen name="AccountStack" component={AccountRouter} options={AccountRouter.navigationOptions} />
      <DefaultStack.Screen name="AdvancedAccountInfo" component={AdvancedAccountInfoScreen} options={AdvancedAccountInfoScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="AppDetails" component={AppDetailsScreen} options={AppDetailsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Browser" component={BrowserScreen} options={BrowserScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="WalletBackupPrompt" component={WalletBackupPromptScreen} options={WalletBackupPromptScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="CoinsList" component={CoinsListScreen} options={CoinsListScreen.navigationOptions(theme)} />
      <DefaultStack.Screen
        name="ConnectWalletConnectApp"
        component={ConnectWalletConnectAppScreen}
        options={ConnectWalletConnectAppScreen.navigationOptions(theme)}
      />
      <DefaultStack.Screen name="ConnectApp" component={ConnectAppScreen} options={ConnectAppScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="ConnectedApps" component={ConnectedAppsScreen} options={ConnectedAppsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Debug" component={DebugScreen} options={DebugScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="DefiDetails" component={DefiDetailsScreen} options={DefiDetailsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Diagnostics" component={DiagnosticsScreen} options={DiagnosticsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="EditNote" component={EditNoteScreen} options={EditNoteScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="ExtendedPublicKey" component={ExtendedPublicKeyScreen} options={ExtendedPublicKeyScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="GlobalActivity" component={GlobalActivityScreen} options={GlobalActivityScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Home" component={HomeScreen} options={HomeScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Language" component={LanguageScreen} options={LanguageScreen.navigationOptions(theme)} />
      <DefaultStack.Screen
        name="ManageAssetsGlobalFilter"
        component={ManageAssetsGlobalFilterScreen}
        options={ManageAssetsGlobalFilterScreen.navigationOptions(theme)}
      />
      <DefaultStack.Screen name="ManageNft" component={ManageNftScreen} options={ManageNftScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="NftCollection" component={NftCollectionScreen} options={NftCollectionScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="NftImageGallery" component={NftImageGalleryScreen} options={NftImageGalleryScreen.navigationOptions} />
      <DefaultStack.Screen name="Nfts" component={NftsScreen} options={NftsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Notifications" component={NotificationsScreen} options={NotificationsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Onboarding" component={OnboardingRouter} options={OnboardingRouter.navigationOptions} />
      <DefaultStack.Screen name="Receive" component={ReceiveScreen} options={ReceiveScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="UniversalReceive" component={UniversalReceiveScreen} options={UniversalReceiveScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Explainer" component={ExplainerScreen} options={ExplainerScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="ConnectAppQRScan" component={ConnectAppQRScanScreen} options={ConnectAppQRScanScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="SendStack" component={SendRouter} options={SendRouter.navigationOptions} />
      <DefaultStack.Screen name="UniversalSend" component={UniversalSendScreen} options={UniversalSendScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Settings" component={SettingsRouter} options={SettingsRouter.navigationOptions} />
      <DefaultStack.Screen name="MarketDataInfo" component={MarketDataInfoScreen} options={MarketDataInfoScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="TransactionDetails" component={TransactionDetailsScreen} options={TransactionDetailsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Transactions" component={TransactionsScreen} options={TransactionsScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="ViewNft" component={ViewNftScreen} options={ViewNftScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="TriggeredPushPrompt" component={TriggeredPushPromptScreen} options={TriggeredPushPromptScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="SendQRScan" component={SendQRScanScreen} options={SendQRScanScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="WalletConnectExplainer" component={WalletConnectExplainerScreen} options={WalletConnectExplainerScreen.navigationOptions} />
      <DefaultStack.Screen name="WhatsNewAvaxLinea" component={WhatsNewAvaxLineaScreen} options={WhatsNewAvaxLineaScreen.navigationOptions} />
      <DefaultStack.Screen name="WhatsNewSwaps" component={WhatsNewSwaps} options={WhatsNewSwaps.navigationOptions} />
      <DefaultStack.Screen name="WhatsNewBrowserExplore" component={WhatsNewBrowserExploreScreen} options={WhatsNewBrowserExploreScreen.navigationOptions} />
      <DefaultStack.Screen
        name="WalletConnectSignRequest_GenericMessage"
        component={WalletConnectSignRequest_GenericMessageScreen}
        options={WalletConnectSignRequest_GenericMessageScreen.navigationOptions(theme)}
      />
      <DefaultStack.Screen
        name="WalletConnectSignRequest_GenericTransaction"
        component={WalletConnectSignRequest_GenericTransactionScreen}
        options={WalletConnectSignRequest_GenericTransactionScreen.navigationOptions(theme)}
      />
      <DefaultStack.Screen
        name="WalletConnectSignRequest_StructuredTransaction"
        component={WalletConnectSignRequest_StructuredTransactionScreen}
        options={WalletConnectSignRequest_StructuredTransactionScreen.navigationOptions(theme)}
      />
      <DefaultStack.Screen name="Explore" component={ExploreScreen} options={ExploreScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="ExploreSubpage" component={ExploreSubpageScreen} options={ExploreSubpageScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="Swap" component={SwapScreen} options={SwapScreen.navigationOptions(theme)} />
      <DefaultStack.Screen name="KrakenConnect" component={KrakenConnectScreen} options={KrakenConnectScreen.navigationOptions(theme)} />
      <DefaultStack.Screen
        name="KrakenConnectTransfer"
        component={KrakenConnectTransferScreen}
        options={KrakenConnectTransferScreen.navigationOptions(theme)}
      />
    </DefaultStack.Navigator>
  );
};

export default NavigationStack;
