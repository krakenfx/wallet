import type { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { runAfterUISync } from '@/utils/runAfterUISync';

import type { CameraProps } from 'expo-camera';

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
