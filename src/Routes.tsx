import type { AccountStackParams } from '@/screens/Accounts/AccountRouter';
import type { AdvancedAccountInfoParams } from '@/screens/Accounts/AdvancedAccountInfoScreen';
import type { ExtendedPublicKeyParams } from '@/screens/Accounts/ExtendedPublicKeyScreen';
import type {
  WalletConnectSignRequest_GenericMessageParams,
  WalletConnectSignRequest_GenericTransactionParams,
  WalletConnectSignRequest_StructuredTransactionParams,
} from '@/screens/AppSignRequest';
import type { BrowserParams } from '@/screens/Browser';
import type { ConnectAppParams } from '@/screens/ConnectApp/ConnectAppScreen';
import type { ConnectWalletConnectAppParams } from '@/screens/ConnectApp/ConnectWalletConnectAppScreen';
import type { ScanQRCodeParams } from '@/screens/ConnectAppQRScan';
import type { DefiDetailsRouteParams } from '@/screens/DefiDetails';
import type { EditNoteParams } from '@/screens/EditNoteScreen';
import type { ExplainerProps } from '@/screens/Explainer';
import type { ManageAssetsGlobalFilterParams } from '@/screens/ManageAssetsGlobalFilter';
import type { ManageNftParams } from '@/screens/Nfts/ManageNftScreen';
import type { NftCollectionParams } from '@/screens/Nfts/NftCollectionScreen';
import type { NftImageGalleryRouteParams } from '@/screens/Nfts/NftImageGalleryScreen';
import type { ViewNftRouteParams } from '@/screens/Nfts/ViewNftScreen';
import type { OnboardingStackParams } from '@/screens/Onboarding/OnboardingRouter';
import type { ReceiveRouteProps } from '@/screens/Receive';
import type { SendStackParams } from '@/screens/Send/SendRouter';
import type { AppDetailsParams } from '@/screens/Settings/AppDetailsScreen';
import type { ConnectedAppsParams } from '@/screens/Settings/ConnectedApps';
import type { SettingsStackParams } from '@/screens/Settings/SettingsRouter';
import type { TransactionDetailsParams, TransactionsRouteProps } from '@/screens/Transactions';
import type { TriggeredPushPromptParams } from '@/screens/TriggerredPushPromptScreen';
import type { UniversalSendRouteParams } from '@/screens/UniversalSend';

import type { ExploreSubpageNavigationParams } from './screens/Explore/ExploreSubpageScreen';

import type { SwapScreenParams } from './screens/Swap';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type ExcludeRealmObject<T> = {
  [K in keyof T]: T[K] extends Realm.Object ? never : T[K];
};

type ExcludeRealmObjectsFromRouteParams<T> = {
  [K in keyof T]: T[K] extends NavigatorScreenParams<infer P> ? NavigatorScreenParams<ExcludeRealmObjectsFromRouteParams<P>> : ExcludeRealmObject<T[K]>;
};

export type RouteProps = ExcludeRealmObjectsFromRouteParams<
  {
    About: undefined;
    AccountStack: NavigatorScreenParams<AccountStackParams>;
    AdvancedAccountInfo: AdvancedAccountInfoParams;
    AdvancedSettings: undefined;
    AppDetails: AppDetailsParams;
    Browser: BrowserParams;
    AppLock: undefined;
    WhatsNewBlast: undefined;
    WhatsNewAvaxLinea: undefined;
    WhatsNewBrowserExplore: undefined;
    WhatsNewAssetMarketData: undefined;
    WhatsNewLongPress: undefined;
    WalletBackupPrompt: undefined;
    WalletCloudBackupScreen: { origin: Routes } | undefined;
    CoinsList: undefined;
    ConnectAppScreen: ConnectAppParams;
    ConnectWalletConnectApp: ConnectWalletConnectAppParams;
    ConnectApp: ConnectAppParams;
    ConnectAppQRScan: ScanQRCodeParams | undefined;
    ConnectedApps: ConnectedAppsParams;
    Debug: undefined;
    DefiDetails: DefiDetailsRouteParams;
    Diagnostics: undefined;
    Explore: undefined;
    ExploreSubpage: ExploreSubpageNavigationParams;
    Swap: SwapScreenParams | undefined;
    EditNote: EditNoteParams;
    Explainer: ExplainerProps;
    ExtendedPublicKey: ExtendedPublicKeyParams;
    TriggeredPushPrompt: TriggeredPushPromptParams | undefined;
    WalletConnectExplainer: undefined;
    GlobalActivity: undefined;
    Home: undefined;
    Language: undefined;
    ManageAssetsGlobalFilter: ManageAssetsGlobalFilterParams;
    ManageNft: ManageNftParams;
    ManageWallets: undefined;
    MarketDataInfo: undefined;
    NftCollection: NftCollectionParams;
    NftImageGallery: NftImageGalleryRouteParams;
    Nfts: undefined;
    Notifications: undefined;
    Onboarding: NavigatorScreenParams<OnboardingStackParams>;
    PasswordProtection: undefined;
    PasswordProtectionForm: undefined;
    Privacy: undefined;
    Receive: ReceiveRouteProps;
    UniversalReceive: undefined;
    UniversalSend: UniversalSendRouteParams | undefined;
    SendStack: NavigatorScreenParams<SendStackParams>;
    Settings: NavigatorScreenParams<SettingsStackParams> | undefined;
    SettingsBackupVerify: undefined;
    SettingsWalletBackup: undefined;
    SettingsDisplaySeed: undefined;
    TransactionDetails: TransactionDetailsParams;
    Transactions: TransactionsRouteProps;
    ViewNft: ViewNftRouteParams;
    WalletConnectSignRequest_GenericMessage: WalletConnectSignRequest_GenericMessageParams;
    WalletConnectSignRequest_GenericTransaction: WalletConnectSignRequest_GenericTransactionParams;
    WalletConnectSignRequest_StructuredTransaction: WalletConnectSignRequest_StructuredTransactionParams;
  } & OnboardingStackParams &
    SettingsStackParams &
    AccountStackParams &
    SendStackParams
>;

export enum Routes {
  AccountStack = 'AccountStack',
  AdvancedAccountInfo = 'AdvancedAccountInfo',
  AdvancedSettings = 'AdvancedSettings',
  AppDetails = 'AppDetails',
  Browser = 'Browser',
  WhatsNewBrowserExplore = 'WhatsNewBrowserExplore',
  WhatsNewAvaxLinea = 'WhatsNewAvaxLinea',
  WhatsNewBlast = 'WhatsNewBlast',
  WhatsNewLongPress = 'WhatsNewLongPress',
  WhatsNewAssetMarketData = 'WhatsNewAssetMarketData',
  WalletBackupPrompt = 'WalletBackupPrompt',
  CoinsList = 'CoinsList',
  ConnectWalletConnectApp = 'ConnectWalletConnectApp',
  ConnectApp = 'ConnectApp',
  ConnectedApps = 'ConnectedApps',
  ConnectAppQRScan = 'ConnectAppQRScan',
  Currency = 'Currency',
  DefiDetails = 'DefiDetails',
  Debug = 'Debug',
  Diagnostics = 'Diagnostics',
  Explore = 'Explore',
  ExploreSubpage = 'ExploreSubpage',
  EditNote = 'EditNote',
  Explainer = 'Explainer',
  ExtendedPublicKey = 'ExtendedPublicKey',
  GlobalActivity = 'GlobalActivity',
  Home = 'Home',
  Language = 'Language',
  ManageAssetsGlobalFilter = 'ManageAssetsGlobalFilter',
  ManageNft = 'ManageNft',
  ManageWallets = 'ManageWallets',
  MarketDataInfo = 'MarketDataInfo',
  NftCollection = 'NftCollection',
  NftImageGallery = 'NftImageGallery',
  Nfts = 'Nfts',
  Notifications = 'Notifications',
  TriggeredPushPrompt = 'TriggeredPushPrompt',
  WalletConnectExplainer = 'WalletConnectExplainer',
  Onboarding = 'Onboarding',
  OnboardingBackup = 'OnboardingBackup',
  OnboardingBackupPrompt = 'OnboardingBackupPrompt',
  OnboardingBackupVerify = 'OnboardingBackupVerify',
  OnboardingWalletCloudBackup = 'OnboardingWalletCloudBackup',
  OnboardingWalletCloudImport = 'OnboardingWalletCloudImport',
  OnboardingWalletCloudImportSelection = 'OnboardingWalletCloudImportSelection',
  OnboardingImportMethodSelection = 'OnboardingImportMethodSelection',
  OnboardingImportSubWallets = 'OnboardingImportSubWallets',
  OnboardingImportSubWalletsSuccess = 'OnboardingImportSubWalletsSuccess',
  OnboardingImportWallet = 'OnboardingImportWallet',
  OnboardingIntro = 'OnboardingIntro',
  OnboardingOutro = 'OnboardingOutro',
  OnboardingSecureWallet = 'OnboardingSecureWallet',
  OnboardingPushPrompt = 'OnboardingPushPrompt',
  Privacy = 'Privacy',
  Receive = 'Receive',
  UniversalReceive = 'UniversalReceive',
  UniversalSend = 'UniversalSend',
  SendStack = 'SendStack',
  Settings = 'Settings',
  Support = 'Support',
  SettingsRoot = 'SettingsRoot',
  Swap = 'Swap',
  TransactionDetails = 'TransactionDetails',
  Transactions = 'Transactions',
  ViewNft = 'ViewNft',
  WalletConnectSignRequest_GenericMessage = 'WalletConnectSignRequest_GenericMessage',
  WalletConnectSignRequest_GenericTransaction = 'WalletConnectSignRequest_GenericTransaction',
  WalletConnectSignRequest_StructuredTransaction = 'WalletConnectSignRequest_StructuredTransaction',

  About = 'About',
  AppLock = 'AppLock',
  DeleteAccountConfirm = 'DeleteAccountConfirm',
  DeleteAccountVerifyBalance = 'DeleteAccountVerifyBalance',
  DeleteAllDataWarningScreen = 'DeleteAllDataWarningScreen',
  DisablePasswordProtection = 'DisablePasswordProtection',
  EditAccount = 'EditAccount',
  PasswordProtection = 'PasswordProtection',
  PasswordProtectionForm = 'PasswordProtectionForm',
  SettingsBackupVerify = 'SettingsBackupVerify',
  SettingsWalletBackup = 'SettingsWalletBackup',
  SettingsWalletBackupMethod = 'SettingsWalletBackupMethod',
  SettingsWalletCloudBackup = 'SettingsWalletCloudBackup',
  SettingsCloudBackup = 'SettingsCloudBackup',
  SettingsWalletCloudBackupDelete = 'SettingsWalletCloudBackupDelete',
  SettingsDisplaySeed = 'SettingsDisplaySeed',

  Send = 'Send',
  SendConfirm = 'SendConfirm',
  SendQRScan = 'SendQRScan',
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RouteProps {}
  }
}
/* eslint-enable */

export type NavigationProps<T extends keyof RouteProps> = NativeStackScreenProps<RouteProps, T>;

export type NoParamsList = Pick<RouteProps, { [K in keyof RouteProps]: RouteProps[K] extends undefined ? K : never }[keyof RouteProps]>;
export type NoParamsRoute = keyof NoParamsList;
