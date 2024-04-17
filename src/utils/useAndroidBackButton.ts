import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

export const useAndroidBackButton = (onBackPress: () => boolean) => {
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [onBackPress]),
  );
};

export const useNoopAndroidBackButton = () => {
  useAndroidBackButton(() => true);
};
