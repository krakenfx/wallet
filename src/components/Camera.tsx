import { useNavigation } from '@react-navigation/native';
import { CameraProps, CameraView } from 'expo-camera';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

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

  return cameraVisible ? <CameraView {...props} style={StyleSheet.absoluteFill} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} /> : null;
};
