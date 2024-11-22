import { PermissionStatus, useCameraPermissions } from 'expo-camera';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { Camera } from '@/components/Camera';
import { CloseButton } from '@/components/CloseButton';
import { Label } from '@/components/Label';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import type { SendRouteParams } from './SendScreen';
import type { UniversalSendRouteParams } from '../UniversalSend';

import type { BarcodeScanningResult } from 'expo-camera';

import loc from '/loc';

type SendParams = SendRouteParams & { routeBack: Routes.Send };

type UniversalSendParams = UniversalSendRouteParams & { routeBack: Routes.UniversalSend };

export type SendQRScanRouteParams = SendParams | UniversalSendParams;

export const SendQRScanScreen = ({ navigation, route }: NavigationProps<'SendQRScan'>) => {
  const [permissionResponse, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (route.params.routeBack === Routes.Send) {
      navigation.navigate(Routes.Send, { ...route.params, qrCode: data });
    } else {
      navigation.navigate(Routes.UniversalSend, { ...route.params, qrCode: data });
    }
  };

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <View style={styles.container}>
      {permissionResponse?.status === PermissionStatus.DENIED ? (
        <Label style={styles.missingPermission}>{loc.scan.missingPermission}</Label>
      ) : (
        <>
          <Camera onBarcodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFill} />
          <View style={[styles.overlay]}>
            <Svg viewBox="0 0 330 330" width={'100%'} height={'100%'} fillOpacity={0}>
              <Path
                d="M281.063 102.266V65.1875C281.063 53.486 271.577 44 259.875 44H214.473M281.063 218.797V255.875C281.063 267.577 271.577 277.063 259.875 277.063H214.473M114.589 44H69.1875C57.486 44 48 53.486 48 65.1875V102.266M48 218.797V255.875C48 267.577 57.486 277.063 69.1875 277.063H114.589"
                stroke="#fff"
                strokeOpacity={0.5}
                strokeWidth={8}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    paddingTop: 24,
  },
  missingPermission: {
    marginTop: 250,
    marginHorizontal: 24,
    textAlign: 'center',
  },
});

SendQRScanScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
  headerRight: () => <CloseButton goBackOnly />,
  headerBackVisible: false,
  headerLeft: () => null,
  headerStyle: {
    backgroundColor: 'transparent',
  },
  presentation: 'containedModal',
});
