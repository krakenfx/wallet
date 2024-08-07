import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import * as bip39 from 'bip39';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
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
import Animated, { CurvedTransition, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import { ErrorObject } from 'serialize-error';

import BackendConfigurator from '@/api/base/BackendConfigurator';
import { PushNotifications } from '@/api/PushNotifications';
import { TokenConfigurationType } from '@/api/types';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Input } from '@/components/Input';
import { Label, TypographyKey } from '@/components/Label';
import { Menu } from '@/components/Menu';
import { DropdownOptionItem } from '@/components/Menu/DropdownMenu';
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
import { SettingsBox } from '@/screens/Settings/components/SettingsBox';
import { isSecureDevice } from '@/secureStore/keychain';
import { useTheme } from '@/theme/themes';
import { navigationStyle } from '@/utils/navigationStyle';

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

const copyToClipboard = (data: string, text: string) => {
  Clipboard.setString(String(data));
  showToast({ type: 'success', text, duration: 1000 });
};

const DataField: React.FC<{
  label: string;
  value: unknown;
  numberOfLines?: number;
  labelType?: TypographyKey;
}> = ({ label, labelType = 'regularCaption2', value, numberOfLines }) => {
  const onPress = () => copyToClipboard(label + ': ' + value, 'Copied ' + label);
  return (
    <Touchable style={styles.dataField} onPress={onPress}>
      <Label type={labelType} color="light50" style={styles.label}>
        {label}:
      </Label>
      <Label type="regularCaption1" numberOfLines={numberOfLines}>
        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
      </Label>
    </Touchable>
  );
};

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
  const [pushSettings, setPushSettings] = useState<TokenConfigurationType>();
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

        setPushSettings(response);
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
        disabled: !isLogToFileEnabled,
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
      <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16 }}>
        <SettingsBox isFirst isHighlighted>
          <SettingsSwitch icon="tool" text="Write logs to a file" enabled={isLogToFileEnabled} onToggle={toggleLoggingToFile} />
        </SettingsBox>
        <SettingsBox isLast isHighlighted style={styles.spacing}>
          <Label type="regularCaption1">When enabled, app logs & caught exceptions are streamed to a log file. Opt-in for security reasons. </Label>
        </SettingsBox>
        <SettingsBox isFirst isHighlighted>
          <SettingsSwitch icon="tool" text="Show toast for all errors" enabled={showToastForAllErrors} onToggle={toggleShowToastOnAllErrors} />
        </SettingsBox>
        <SettingsBox isLast isHighlighted style={styles.spacing}>
          <Label type="regularCaption1">When enabled, all errors will show red toast with initial error message</Label>
        </SettingsBox>
        <Button
          icon="fire"
          size="large"
          text="Show recent errors"
          testID="ShowRecentErrors"
          onPress={() => errorSheetRef.current?.expand()}
          style={styles.spacing}
        />
        <Button
          icon="info-circle"
          size="large"
          text="Show device info"
          testID="ShowDeviceInfo"
          onPress={() => deviceInfoRef.current?.expand()}
          style={styles.spacing}
        />
        {!!Config.INTERNAL_RELEASE && (
          <Button
            icon="plug-connected"
            size="large"
            text="Configure backend"
            testID="ShowBackendConfig"
            onPress={() => backendConfigRef.current?.expand()}
            style={styles.spacing}
          />
        )}
        <Button size="large" loading={isMeasuringPerformance} text="Measure performance" onPress={onMeasurePerformance} style={styles.spacing} />
        <Button size="large" text="Run diagnostics" testID="RunDiagnosticsButton" onPress={onRunDiagnostics} style={styles.spacing} />
        <Button size="large" text="Show wallet state" testID="ShowWalletState" onPress={() => walletStateRef.current?.expand()} style={styles.spacing} />
      </ScrollView>
      <BottomSheet noSafeInsetTop ref={errorSheetRef} index={-1} snapPoints={['100%']} footerComponent={errorSheetFooter}>
        <BottomSheetScrollView style={{ paddingHorizontal: 24, marginBottom: paddingBottom }}>
          {recentErrors.length === 0 && <Label style={styles.emptyErrors}>No recent errors</Label>}
          {recentErrors.map(({ timestamp, error, context }) => (
            <ErrorBox date={timestamp} error={error} context={context} />
          ))}
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet noSafeInsetTop ref={walletStateRef} index={-1} snapPoints={['100%']}>
        <WalletStateSheet />
      </BottomSheet>
      <BottomSheet noSafeInsetTop ref={deviceInfoRef} index={-1} snapPoints={['100%']}>
        <DeviceInfo info={{ ...deviceInfo, pushPermission: pushGranted, pushSettings, pushToken: token }} />
      </BottomSheet>
      <BottomSheet noSafeInsetTop ref={backendConfigRef} index={-1} snapPoints={['100%']}>
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
        <Button
          text="Copy all"
          onPress={() => {
            copyToClipboard(JSON.stringify({ ...info, pushToken: 'REDACTED' }, null, 2), 'Copied device info');
          }}
        />
      </View>
      {Object.entries(info).map(([key, value]) => (
        <DataField labelType="regularCaption1" key={key} label={key} value={value} />
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
      <Label style={styles.spacing}>Harmony URI:</Label>
      <Menu
        title="Select Harmony URI"
        menuWidth={width - 48}
        selectedId={harmonyUri}
        type="dropdown"
        labelLeftType="regularCaption1"
        onSelect={item => saveHarmonyUri(item.id)}
        options={harmonyOptions}>
        <Input editable={false} defaultValue={harmonyUri} style={styles.spacing} />
      </Menu>
      <Label style={styles.spacing}>GroundControl URI:</Label>
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
        <Button text="Copy" onPress={() => copyToClipboard(JSON.stringify(walletSections, null, 2), 'Wallet state copied!')} />
      </View>
      {walletSections.map(w => (
        <DataField key={w.label} label={w.label} value={JSON.stringify(w.value, null, 2)} />
      ))}
    </BottomSheetScrollView>
  );
}

const removeImages = (data: string) => data.replace(/<img[^>]*>/g, 'IMAGE REDACTED');

const extractHTMLBody = (data: string) =>
  data.substring(0, 100).includes('<!DOCTYPE html') ? data.match(/<body>.*<\/body>/)?.[0].replaceAll('\\n', '\n') ?? '' : data;

const ErrorBox: React.FC<{ date: Date; error: ErrorObject; context: string }> = ({ date, error, context }) => {
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();

  const stack = error.stack?.replace(/(at\s\S+)\s*\([^)]*\)/g, '$1');
  const errorProps = removeImages(JSON.stringify({ ...error, stack: undefined }, null, 2));

  return (
    <Animated.View style={[styles.errorContainer, { backgroundColor: theme.colors.light8 }]} layout={CurvedTransition}>
      <Touchable onPress={() => setCollapsed(c => !c)}>
        <View style={styles.expandArea}>
          <SvgIcon name={collapsed ? 'chevron-down' : 'chevron-up'} />
        </View>
        <DataField label="local time" value={date.toLocaleString()} />
        <DataField label="ISO time" value={date.toISOString()} />
        <DataField label="context" value={context} />
        {!!error.requestId && typeof error.requestId === 'string' && <DataField label="request id" value={error.requestId} />}
        <DataField
          label="error message"
          value={removeImages(
            extractHTMLBody(
              (error.content as { message: string })?.message ??
                error.message ??
                String(error.cause).substring(0, 50) ??
                error.stack?.substring(0, 50) ??
                'Unknown',
            ),
          )}
          numberOfLines={collapsed ? 5 : undefined}
        />
      </Touchable>
      {!collapsed && (
        <Animated.View entering={FadeIn}>
          {!!stack && <DataField label="stack" value={stack} />}
          <DataField label="error data" value={errorProps} />
        </Animated.View>
      )}
      <View style={styles.copyRow}>
        <Button
          style={styles.flex}
          text={'Copy error'}
          onPress={() =>
            copyToClipboard(
              removeImages(
                JSON.stringify(
                  {
                    date,
                    error,
                    context,
                  },
                  null,
                  2,
                ),
              ),
              'Error copied!',
            )
          }
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  emptyErrors: {
    alignSelf: 'center',
    marginTop: 24,
  },
  dataField: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 3,
  },
  expandArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 100,
    paddingLeft: 60,
    paddingBottom: 60,
  },
  spacing: {
    marginBottom: 12,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
  },
  copyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

DebugScreen.navigationOptions = navigationStyle({ title: 'Debug' });
