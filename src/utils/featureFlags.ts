import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import Config from 'react-native-config';

import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { featureFlagsKey } from '@/secureStore/asyncStorageKeys';

import { createErrorHandlerWithContext, handleError } from '/helpers/errorHandler';

const FEATURE_FLAGS_ENABLED = __DEV__ || Config.INTERNAL_RELEASE;

export enum FeatureFlag {
  AssetMarketDataEnabled = 'AssetMarketDataEnabled',
  ExploreScreenEnabled = 'ExploreScreenEnabled',
  NewNetworksEnabled = 'NewNetworksEnabled',
  InAppBrowserEnabled = 'InAppBrowserEnabled',
  swapsEnabled = 'swapsEnabled',
}

export const NEW_NON_EVM_NETWORKS = [] as const;
export const NEW_EVM_NETWORKS = [ChainAgnostic.NETWORK_LINEA, ChainAgnostic.NETWORK_AVALANCHE] as const;
export const NEW_NETWORKS = [...NEW_EVM_NETWORKS, ...NEW_NON_EVM_NETWORKS] as const;

export function getFeatureFlagsFromStorage<FMap = Record<FeatureFlag, boolean | undefined>>(): FMap {
  const result = {} as FMap;
  if (FEATURE_FLAGS_ENABLED) {
    AsyncStorage.getItem(featureFlagsKey)
      .then(flagsStr => {
        if (typeof flagsStr !== 'string') {
          return result;
        }
        try {
          const parsedFlags = JSON.parse(flagsStr) as FMap;
          for (const key in parsedFlags) {
            result[key] = parsedFlags[key];
          }
        } catch (e) {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
        }
      })
      .catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));
  }
  return result;
}

export async function saveFeatureFlagsToStorage() {
  if (FEATURE_FLAGS_ENABLED) {
    return AsyncStorage.setItem(featureFlagsKey, JSON.stringify(featureFlagObj)).catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));
  }
}

const featureFlagObj = getFeatureFlagsFromStorage(); 

function isFeatureEnabled(key: FeatureFlag) {
  
  return !!(__DEV__ || Config.INTERNAL_RELEASE) && !!featureFlagObj[key];
}

export async function enableFeature(key: FeatureFlag) {
  featureFlagObj[key] = true;
  await saveFeatureFlagsToStorage();
}

export async function disableFeature(key: FeatureFlag) {
  featureFlagObj[key] = false;
  await saveFeatureFlagsToStorage();
}

export function isNewNetworksEnabled() {
  return isFeatureEnabled(FeatureFlag.NewNetworksEnabled);
}

export function isInAppBrowserEnabled() {
  return isFeatureEnabled(FeatureFlag.InAppBrowserEnabled);
}

export const useFeatureFlag = (key: FeatureFlag) => {
  const [isFeatureFlagEnabled, setIsFeatureFlagEnabled] = useState(false); 

  useEffect(() => {
    setIsFeatureFlagEnabled(isFeatureEnabled(key));
  }, [key]);

  const setFeatureEnabled = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        enableFeature(key);
      } else {
        disableFeature(key);
      }
      setIsFeatureFlagEnabled(enabled);
    },
    [key],
  );

  return [isFeatureFlagEnabled, setFeatureEnabled] as const;
};

export const useFeatureFlagEnabled = (key: FeatureFlag) => {
  const [featureEnabled] = useFeatureFlag(key);
  return featureEnabled;
};
