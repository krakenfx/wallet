import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import * as bip39 from 'bip39';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Config from 'react-native-config';
import {
  getBrand,
  getBuildNumber,
  getDeviceId,
  getFontScale,
  getModel,
  getSystemVersion,
  getVersion,
  hasDynamicIsland,
  hasNotch,
  isPinOrFingerprintSet,
} from 'react-native-device-info';
import Animated, { CurvedTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import { ErrorObject } from 'serialize-error';

import BackendConfigurator from '@/api/base/BackendConfigurator';
import { PushNotifications } from '@/api/PushNotifications';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Menu } from '@/components/Menu';
import { DropdownOptionItem } from '@/components/Menu/DropdownMenu';
import navigationStyle from '@/components/navigationStyle';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { BitcoinNetwork } from '@/onChain/wallets/bitcoin';
import { polygonNetwork } from '@/onChain/wallets/evmNetworks';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useRealmWallets } from '@/realm/wallets';
import { Routes } from '@/Routes';
import { SettingsSwitch } from '@/screens/Settings/components';
import { ActivityIndicatorView } from '@/screens/Settings/components/ActivityIndicatorView';
import { SettingsBox } from '@/screens/Settings/components/SettingsBox';
import { isSecureDevice } from '@/secureStore/keychain';
import { useTheme } from '@/theme/themes';

import { showToast } from '../components/Toast';

import { ALT_GROUNDCONTROL_BASE_URIS, ALT_HARMONY_BASE_URIS, DEFAULT_GROUNDCONTROL_BASE_URI, DEFAULT_HARMONY_BASE_URI } from '/config';
import {
  applogFilePath,
  createErrorHandlerWithContext,
  disableLoggingToFile,
  disableShowToastOnAllErrors,
  enableLoggingToFile,
  enableShowToastOnAllErrors,
  handleError,
  isLoggingToFileEnabled,
  isShowToastOnAllErrorsEnabled,
  recentErrors,
} from '/helpers/errorHandler';

interface DebugItemProps {
  label: string;
  value: string | boolean;
}

const copyToClipboard = (data: string | boolean) => {
  Clipboard.setString(String(data));
  showToast({ type: 'info', text: 'Copied to clipboard!', duration: 1000 });
};

const DebugItem = ({ label, value }: DebugItemProps) => (
  <View style={styles.item}>
    <Label>{label}</Label>
    <Touchable
      onPress={() => {
        console.log(value);
        copyToClipboard(value);
      }}>
      <Label type="regularCaption1" color="light75">
        {String(value)}
      </Label>
    </Touchable>
  </View>
);

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    const setInfo = async () => {
      setDeviceInfo({
        brand: getBrand(),
        model: getModel(),
        deviceId: getDeviceId(),
        version: getVersion(),
        buildNumber: getBuildNumber(),
        systemVersion: getSystemVersion(),
        fontScale: await getFontScale(),
        hasNotch: hasNotch(),
        hasDynamicIsland: hasDynamicIsland(),
        hasPinOrFignerprint: await isPinOrFingerprintSet(),
        isSecureDevice: await isSecureDevice(),
        internal: !!Config.INTERNAL_RELEASE,
      });
    };
    setInfo();
  }, []);
  return deviceInfo;
};

export const DebugScreen = () => {
  const [token, setToken] = useState<string | null>();
  const [pushGranted, setPushGranted] = useState<boolean>();
  const [pushSettingsText, setPushSettingsText] = useState<string>('');
  const deviceInfo = useDeviceInfo();

  const [isMeasuringPerformance, setIsMeasuringPerformance] = useState(false);
  const [isLogToFileEnabled, setIsLogToFileEnabled] = useState(false);
  const [showToastForAllErrors, setShowToastForAllErrors] = useState(__DEV__);
  const navigation = useNavigation();
  const errorSheetRef = useRef<BottomSheetMethods>(null);
  const walletStateRef = useRef<BottomSheetMethods>(null);
  const deviceInfoRef = useRef<BottomSheetMethods>(null);
  const backendConfigRef = useRef<BottomSheetMethods>(null);

  useEffect(() => {
    (async () => {
      setToken(await PushNotifications.getInstance().getDeviceToken());
      setPushGranted(await PushNotifications.getInstance().hasPermission());
    })();
  }, []);

  useEffect(() => {
    setIsLogToFileEnabled(isLoggingToFileEnabled());
    setShowToastForAllErrors(isShowToastOnAllErrorsEnabled());
  }, []);

  const toggleLoggingToFile = (value: boolean) => {
    if (value) {
      enableLoggingToFile();
    } else {
      disableLoggingToFile();
    }
    setIsLogToFileEnabled(value);
  };

  const toggleShowToastOnAllErrors = (value: boolean) => {
    if (value) {
      enableShowToastOnAllErrors();
    } else {
      disableShowToastOnAllErrors();
    }
    setShowToastForAllErrors(value);
  };

  useEffect(() => {
    (async () => {
      if (!token) {
        return;
      }

      try {
        const response = await PushNotifications.getInstance().getTokenConfiguration();

        setPushSettingsText((Object.keys(response) as Array<keyof typeof response>).map(key => `${key}=${String(response[key])}`).join('; '));
      } catch (error) {
        console.error(error);
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    })();
  }, [token]);

  const onMeasurePerformance = async () => {
    setIsMeasuringPerformance(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      let start = +new Date();

      const seed = await bip39.mnemonicToSeed(mnemonic);

      let wallet = {
        seed: {
          secret: mnemonic,

          data: seed.buffer.slice(seed.byteOffset, seed.byteOffset + seed.byteLength),
        },
        accountIdx: 0,
      };

      let end = +new Date();
      let sec = (end - start) / 1000;
      console.log({ sec });
      showToast({ type: 'info', text: `mnemonicToSeed: ${sec} sec` });

      await new Promise(resolve => setTimeout(resolve, 1000));

      start = +new Date();
      for (let c = 0; c < 20; c++) {
        wallet.accountIdx++;
        const { extendedPublicKey } = polygonNetwork.getExtendedPublicKey(seed, wallet.accountIdx);
        await polygonNetwork.deriveAddress({ extendedPublicKey: extendedPublicKey, accountIdx: wallet.accountIdx, chainCode: null });
      }
      end = +new Date();
      sec = (end - start) / 1000;
      console.log({ sec });
      showToast({ type: 'info', text: `deriveAddress: ${sec} sec` });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsMeasuringPerformance(false);
    }
  };

  const onRunDiagnostics = () => {
    navigation.navigate(Routes.Diagnostics);
  };

  const paddingBottom = useBottomSheetPadding();

  const insets = useSafeAreaInsets();

  const errorSheetFooter = () => (
    <FloatingBottomButtons
      primary={{
        text: 'Share full log',
        onPress: () => {
          Share.open({
            title: 'app.log',
            url: `file://${applogFilePath}`,
          });
        },
      }}
    />
  );
  return (
    <>
      <ScrollView style={styles.wrapper} contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16 }}>
        <DebugItem label="Push token:" value={token ?? ''} />
        <DebugItem label="Push permission:" value={String(pushGranted)} />
        {pushSettingsText && <DebugItem label="Server-side push settings:" value={pushSettingsText} />}
        <SettingsBox isFirst isHighlighted>
          <SettingsSwitch icon="tool" text="Write logs to a file" enabled={isLogToFileEnabled} onToggle={toggleLoggingToFile} />
        </SettingsBox>
        <SettingsBox isLast isHighlighted>
          <Label type="regularCaption1">When enabled, app logs & caught exceptions are streamed to a log file. Opt-in for security reasons. </Label>
        </SettingsBox>
        <View style={styles.spacing} />
        <SettingsBox isFirst isHighlighted>
          <SettingsSwitch icon="tool" text="Show toast for all errors" enabled={showToastForAllErrors} onToggle={toggleShowToastOnAllErrors} />
        </SettingsBox>
        <SettingsBox isLast isHighlighted>
          <Label type="regularCaption1">When enabled, all errors will show red toast with initial error message</Label>
        </SettingsBox>
        <View style={styles.spacing} />
        {isMeasuringPerformance ? <ActivityIndicatorView /> : <Button size="large" text="Measure performance" onPress={onMeasurePerformance} />}
        <View style={styles.spacing} />
        <Button size="large" text="Run diagnostics" testID="RunDiagnosticsButton" onPress={onRunDiagnostics} />
        <View style={styles.spacing} />
        <Button size="large" text="Show recent errors" testID="ShowRecentErrors" onPress={() => errorSheetRef.current?.expand()} />
        <View style={styles.spacing} />
        <Button size="large" text="Show wallet state" testID="ShowWalletState" onPress={() => walletStateRef.current?.expand()} />
        <View style={styles.spacing} />
        <Button size="large" text="Show device info" testID="ShowDeviceInfo" onPress={() => deviceInfoRef.current?.expand()} />
        <View style={styles.spacing} />
        {!!Config.INTERNAL_RELEASE && (
          <Button size="large" text="Configure backend" testID="ShowBackendConfig" onPress={() => backendConfigRef.current?.expand()} />
        )}
      </ScrollView>
      <BottomSheet ref={errorSheetRef} index={-1} enablePanDownToClose snapPoints={['100%']} footerComponent={errorSheetFooter}>
        <BottomSheetScrollView style={{ paddingHorizontal: 24, marginBottom: paddingBottom }}>
          {recentErrors.map(({ timestamp, error, context }) => (
            <ErrorField date={timestamp} error={error} context={context} />
          ))}
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet ref={walletStateRef} index={-1} enablePanDownToClose snapPoints={['100%']}>
        <WalletStateSheet />
      </BottomSheet>
      <BottomSheet ref={deviceInfoRef} index={-1} enablePanDownToClose snapPoints={['100%']}>
        <DeviceInfo info={{ ...deviceInfo, pushPermission: pushGranted }} />
      </BottomSheet>
      <BottomSheet ref={backendConfigRef} index={-1} enablePanDownToClose snapPoints={['100%']}>
        <BackendConfig />
      </BottomSheet>
    </>
  );
};

const DeviceInfo: React.FC<{ info: object }> = ({ info }) => {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetScrollView style={{ paddingHorizontal: 24, marginBottom: insets.bottom }}>
      <View style={styles.copyRow}>
        <Button text="Copy" onPress={() => copyToClipboard(JSON.stringify(info, null, 2))} />
      </View>
      {Object.entries(info).map(([key, value]) => (
        <DebugItem key={key} label={key} value={value} />
      ))}
    </BottomSheetScrollView>
  );
};

const BackendConfig: React.FC<{}> = () => {
  const insets = useSafeAreaInsets();
  const [harmonyUri, setHarmonyUri] = useState('');
  const [groundcontrolUri, setGroundcontrolUri] = useState('');
  const { width } = useWindowDimensions();

  const defaultGcUri: string = DEFAULT_GROUNDCONTROL_BASE_URI || '';
  const gcOptions: DropdownOptionItem<string>[] = [
    { id: defaultGcUri as string, labelLeft: defaultGcUri as string },
    ...ALT_GROUNDCONTROL_BASE_URIS.filter(uri => uri !== undefined).map(uri => ({
      id: uri as string,
      labelLeft: uri as string,
    })),
  ];

  const defaultHarmonyUri: string = DEFAULT_HARMONY_BASE_URI || '';
  const harmonyOptions: DropdownOptionItem<string>[] = [
    { id: defaultHarmonyUri as string, labelLeft: defaultHarmonyUri as string },
    ...ALT_HARMONY_BASE_URIS.filter(uri => uri !== undefined).map(uri => ({
      id: uri as string,
      labelLeft: uri as string,
    })),
  ];

  useEffect(() => {
    BackendConfigurator.getHarmonyBaseUri().then(setHarmonyUri);
    BackendConfigurator.getGroundcontrolBaseUri().then(setGroundcontrolUri);
  }, []);

  const saveGCUri = (newUri: string | undefined) => {
    console.log('saving new GC uri:', newUri);
    if (newUri !== undefined && newUri !== null) {
      BackendConfigurator.saveGroundcontrolBaseUri(newUri)
        .catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'))
        .then(() => showToast({ type: 'info', text: 'GroundControl URI set!\nRestart might be required.', duration: 2000 }));
      setGroundcontrolUri(newUri);
    } else {
      console.error('Error: newUri is undefined or null');
    }
  };

  const saveHarmonyUri = (newUri: string | undefined) => {
    console.log('saving new Harmony uri:', newUri);
    if (newUri !== undefined && newUri !== null) {
      BackendConfigurator.saveHarmonyBaseUri(newUri)
        .catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'))
        .then(() => showToast({ type: 'info', text: 'Harmony URI set!\nRestart might be required.', duration: 2000 }));
      setHarmonyUri(newUri);
    } else {
      console.error('Error: newUri is undefined or null');
    }
  };

  return (
    <BottomSheetScrollView style={{ paddingHorizontal: 24, marginBottom: insets.bottom }}>
      <Text style={styles.textHeader}>Harmony URI:</Text>
      <Menu
        title="Select Harmony URI"
        menuWidth={width - 48}
        selectedId={harmonyUri}
        type="dropdown"
        labelLeftType="regularCaption1"
        onSelect={item => saveHarmonyUri(item.id)}
        options={harmonyOptions}>
        <Input editable={false} defaultValue={harmonyUri} />
      </Menu>
      <Text style={styles.textHeader}>GroundControl URI:</Text>
      <Menu
        title="Select GroundControl URI"
        menuWidth={width - 48}
        selectedId={groundcontrolUri}
        type="dropdown"
        labelLeftType="regularCaption1"
        onSelect={item => saveGCUri(item.id)}
        options={gcOptions}>
        <Input editable={false} defaultValue={groundcontrolUri} />
      </Menu>
    </BottomSheetScrollView>
  );
};

function WalletStateSheet() {
  const paddingBottom = useBottomSheetPadding(true);

  const wallets = useRealmWallets(true);
  const getStorageInterface = useGetWalletStorage();
  const [walletStateData, setWalletStates] = useState<{ state: unknown; addresses?: string[] }[]>([]);

  useEffect(() => {
    (async () => {
      const states = await Promise.all(
        wallets.map(async wallet => {
          const { network } = getImplForWallet(wallet);
          const storage = await getStorageInterface(wallet);
          let extra = {};
          if (network instanceof BitcoinNetwork) {
            extra = {
              receiveAddresses: Object.keys(await network.getAllAddresses(wallet, storage as any, false, true)),
              changeAddresses: Object.keys(await network.getAllAddresses(wallet, storage as any, true, false)),
            };
          }
          return {
            state: storage.state,
            ...extra,
          };
        }),
      );
      setWalletStates(states);
    })();
  }, [wallets, getStorageInterface]);

  const walletSections = wallets
    .map((wallet, idx) => {
      const state = walletStateData[idx];
      if (!state?.state && !state?.addresses) {
        return null;
      }
      return { label: `${wallet.type}  / ${wallet.accountIdx}`, value: state };
    })
    .filter(Boolean) as {
    label: string;
    value: unknown;
  }[];

  return (
    <BottomSheetScrollView style={{ paddingHorizontal: 24, marginBottom: paddingBottom }}>
      <View style={styles.copyRow}>
        <Button text="Copy" onPress={() => copyToClipboard(JSON.stringify(walletSections, null, 2))} />
      </View>
      {walletSections.map(w => (
        <DebugItem key={w.label} label={w.label} value={JSON.stringify(w.value, null, 2)} />
      ))}
    </BottomSheetScrollView>
  );
}

const ErrorField: React.FC<{ date: Date; error: ErrorObject; context: string }> = ({ date, error, context }) => {
  const [collapsed, setCollapsed] = useState(true);

  const theme = useTheme();

  const stack = error.stack?.replace(/(at\s\S+)\s*\([^)]*\)/g, '$1');
  const errorProps = Object.keys(error)
    .filter(prop => prop !== 'stack')
    .map(prop => `${prop}: ${error[prop]}`)
    .join('\n');
  const humanFriendlyError = `context: ${context}\n${errorProps}\nstack: ${stack}\n`;
  return (
    <Animated.View style={[styles.errorContainer, { backgroundColor: theme.colors.light8 }]} layout={CurvedTransition}>
      <View>
        <Touchable onPress={() => setCollapsed(c => !c)} style={styles.errorItem}>
          <View style={styles.labels}>
            <Label type="regularCaption1" style={styles.label}>
              {error.message ?? 'Error'}
            </Label>
            <View>
              <Label type="regularCaption2" style={styles.timestamp}>
                {date.toLocaleString()}
              </Label>
            </View>
          </View>
          <SvgIcon name={collapsed ? 'chevron-down' : 'chevron-up'} />
        </Touchable>
        {!collapsed && (
          <View>
            <View style={styles.copyRow}>
              <Button text={'Copy'} onPress={() => copyToClipboard(humanFriendlyError)} />
            </View>
            <Label entering={FadeIn} exiting={FadeOut} type="regularMonospace">
              {humanFriendlyError}
            </Label>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  item: {
    paddingBottom: 20,
  },
  spacing: {
    marginVertical: 6,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
  },
  errorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  context: {
    marginVertical: 8,
  },
  labels: {
    marginRight: 8,
    flex: 1,
  },
  copyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  timestamp: {
    flex: 1,
    marginTop: 8,
  },
  textHeader: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingTop: 30,
    paddingBottom: 10,
  },
  textSelectable: {
    color: 'white',
    paddingTop: 15,
    paddingLeft: 10,
  },
});

DebugScreen.navigationOptions = navigationStyle({ title: 'Debug' });
