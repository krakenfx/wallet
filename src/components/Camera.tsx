import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera as BarcodeCamera, CameraProps } from 'expo-camera';
import React, { FC, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { runAfterUISync } from '@/utils/runAfterUISync';

export const Camera: FC<CameraProps> = props => {
  const [cameraVisible, setCameraVisible] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    type Listener = Parameters<typeof navigation.addListener<'beforeRemove'>>[1];
    const listener: Listener = e => {
      e.preventDefault();
      if (cameraVisible) {
        setCameraVisible(false);
        runAfterUISync(() => navigation.dispatch(e.data.action));
      }
    };
    navigation.addListener('beforeRemove', listener);
    return () => navigation.removeListener('beforeRemove', listener);
  }, [cameraVisible, navigation]);

  return cameraVisible ? (
    <BarcodeCamera
      {...props}
      ratio="16:9"
      style={Platform.OS === 'android' ? styles.androidRatio : StyleSheet.absoluteFill}
      barCodeScannerSettings={{ barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr] }}
    />
  ) : null;
};

const { height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  androidRatio: {
    height,
    width: (height * 9) / 16,
    position: 'absolute',
  },
});
