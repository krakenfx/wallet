import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import Config from 'react-native-config';

const FEATURE_FLAGS_ENABLED = __DEV__ || Config.INTERNAL_RELEASE;

export enum FeatureFlag {
  AssetMarketDataEnabled = 'AssetMarketDataEnabled',
}

export function checkAndSetFeatureFlags<FMap = Record<FeatureFlag, boolean | undefined>>(): FMap {
  const result = {} as FMap;
  if (FEATURE_FLAGS_ENABLED) {
    Object.keys(FeatureFlag).forEach(key => {
      AsyncStorage.getItem(key).then(value => {
        featureFlagObj[key as FeatureFlag] = value === 'true';
      });
    });
  }
  return result;
}
const featureFlagObj = checkAndSetFeatureFlags();

export function isFeatureEnabled(key: FeatureFlag) {
  return !!(__DEV__ || Config.INTERNAL_RELEASE) && !!featureFlagObj[key];
}

export async function enableFeature(key: FeatureFlag) {
  await AsyncStorage.setItem(key, 'true');
  featureFlagObj[key] = true;
}

export async function disableFeature(key: FeatureFlag) {
  await AsyncStorage.setItem(key, 'false');
  featureFlagObj[key] = false;
}

export const useFeatureFlag = (key: FeatureFlag) => {
  const [isFeatureFlagEnabled, setIsFeatureFlagEnabled] = useState(false);

  useEffect(() => {
    setIsFeatureFlagEnabled(isFeatureEnabled(key));
  }, [key]);

  const toggleFeature = useCallback(() => {
    if (isFeatureFlagEnabled) {
      disableFeature(key);
    } else {
      enableFeature(key);
    }
    setIsFeatureFlagEnabled(!isFeatureFlagEnabled);
  }, [isFeatureFlagEnabled, key]);

  return {
    isFeatureFlagEnabled,
    toggleFeature,
  };
};
