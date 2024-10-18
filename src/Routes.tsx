import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AccountStackParams } from '@/screens/Accounts/AccountRouter';
import { AdvancedAccountInfoParams } from '@/screens/Accounts/AdvancedAccountInfoScreen';
import { ExtendedPublicKeyParams } from '@/screens/Accounts/ExtendedPublicKeyScreen';
import {
  WalletConnectSignRequest_GenericMessageParams,
  WalletConnectSignRequest_GenericTransactionParams,
  WalletConnectSignRequest_StructuredTransactionParams,
} from '@/screens/AppSignRequest';
import { BrowserParams } from '@/screens/Browser';
import { ConnectAppParams } from '@/screens/ConnectApp';
import { ScanQRCodeParams } from '@/screens/ConnectAppQRScan';
import { DefiDetailsRouteParams } from '@/screens/DefiDetails';
import { EditNoteParams } from '@/screens/EditNoteScreen';
import { ExplainerProps } from '@/screens/Explainer';
import { ManageAssetsGlobalFilterParams } from '@/screens/ManageAssetsGlobalFilter';
import { ManageNftParams } from '@/screens/Nfts/ManageNftScreen';
import { NftCollectionParams } from '@/screens/Nfts/NftCollectionScreen';
import { NftImageGalleryRouteParams } from '@/screens/Nfts/NftImageGalleryScreen';
import { ViewNftRouteParams } from '@/screens/Nfts/ViewNftScreen';
import { OnboardingStackParams } from '@/screens/Onboarding/OnboardingRouter';
import { ReceiveRouteProps } from '@/screens/Receive';
import { SendStackParams } from '@/screens/Send/SendRouter';
import { AppDetailsParams } from '@/screens/Settings/AppDetailsScreen';
import { ConnectedAppsParams } from '@/screens/Settings/ConnectedApps';
import { SettingsStackParams } from '@/screens/Settings/SettingsRouter';
import { TokenListsParams } from '@/screens/TokenLists';
import { TransactionDetailsParams, TransactionsRouteProps } from '@/screens/Transactions';
import { TriggeredPushPromptParams } from '@/screens/TriggerredPushPromptScreen';
import { UniversalSendRouteParams } from '@/screens/UniversalSend';


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
    WhatsNewAssetMarketData: undefined;
    WhatsNewLongPress: undefined;
    WalletBackupPrompt: undefined;
    WalletCloudBackupScreen: { origin: Routes } | undefined;
    CoinsList: undefined;
    ConnectApp: ConnectAppParams;
    ConnectAppQRScan: ScanQRCodeParams | undefined;
    ConnectedApps: ConnectedAppsParams;
    Debug: undefined;
    DefiDetails: DefiDetailsRouteParams;
    Diagnostics: undefined;
    Explore: undefined;
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
    TokenLists: TokenListsParams;
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
  WhatsNewBlast = 'WhatsNewBlast',
  WhatsNewLongPress = 'WhatsNewLongPress',
  WhatsNewAssetMarketData = 'WhatsNewAssetMarketData',
  WalletBackupPrompt = 'WalletBackupPrompt',
  CoinsList = 'CoinsList',
  ConnectApp = 'ConnectApp',
  ConnectedApps = 'ConnectedApps',
  ConnectAppQRScan = 'ConnectAppQRScan',
  Currency = 'Currency',
  DefiDetails = 'DefiDetails',
  Debug = 'Debug',
  Diagnostics = 'Diagnostics',
  Explore = 'Explore',
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
  TokenLists = 'TokenLists',
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
