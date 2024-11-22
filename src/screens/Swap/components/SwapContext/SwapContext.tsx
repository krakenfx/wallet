import type { PropsWithChildren } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import React, { useContext, useState } from 'react';

import {
  type AnimatedStyle,
  type SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { SwapQuoteResult } from '@/api/types';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { type RealmToken, useTokenById, useTokens } from '@/realm/tokens';

import { ROUTE_OPTIONS_FLASH_OPACITY_STEPS, ROUTE_OPTIONS_FLASH_TRIGGER } from '../../SwapScreen.constants';

import type { SwapFeeFiatValueMap, SwapTargetAsset } from '../../types';

export type SwapContext = {
  sourceTokenState: [RealmToken, React.Dispatch<React.SetStateAction<RealmToken>>];
  targetAssetState: ReturnType<typeof useState<SwapTargetAsset>>;
  sourceAmountInputValueState: ReturnType<typeof useState<string>>;
  sourceAmountState: ReturnType<typeof useState<string>>;
  amountInputFocusState: ReturnType<typeof useState<boolean>>;
  amountInputErrorState: ReturnType<typeof useState<string>>;
  amountInputValidState: ReturnType<typeof useState<boolean>>;
  loadingState: ReturnType<typeof useState<boolean>>;
  swapAvailableState: ReturnType<typeof useState<boolean>>;
  swapQuoteState: ReturnType<typeof useState<SwapQuoteResult>>;
  swapQuoteError: ReturnType<typeof useState<boolean>>;
  swapFeesFiatValueState: ReturnType<typeof useState<SwapFeeFiatValueMap>>;
  refreshCountdownProgress: SharedValue<number>;
  refreshFlashStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle | TextStyle>>>;
};

const SwapContext = React.createContext<SwapContext | undefined>(undefined);

type ContextProps = {
  defaultTokenId?: string;
};

export const SwapContextProvider: React.FC<PropsWithChildren<ContextProps>> = ({ children, defaultTokenId }) => {
  const ethToken = useTokens().filtered('assetId = $0', defaultTokenId ?? ChainAgnostic.COIN_ETHEREUM)[0];
  const defaultToken = useTokenById(defaultTokenId);

  const sourceTokenState = useState<RealmToken>(defaultToken ?? ethToken);
  const targetAssetState = useState<SwapTargetAsset>();
  const sourceAmountState = useState<string>();
  const sourceAmountInputValueState = useState<string>();
  const amountInputErrorState = useState<string>();
  const amountInputFocusState = useState<boolean>();
  const amountInputValidState = useState<boolean>();
  const loadingState = useState<boolean>();
  const swapAvailableState = useState<boolean>();
  const swapQuoteState = useState<SwapQuoteResult>();
  const swapQuoteError = useState<boolean>();
  const swapFeesFiatValueState = useState<SwapFeeFiatValueMap>();
  const refreshCountdownProgress = useSharedValue<number>(0);
  const refreshFlashOpacity = useSharedValue<number>(1);

  const [_, setSwapAvailable] = swapAvailableState;

  useAnimatedReaction(
    () => refreshCountdownProgress.value,
    (progress, previous) => {
      if (progress === 1) {
        refreshFlashOpacity.value = withDelay(200, withTiming(1, { duration: 350 }));
      }
      if ((previous ?? 0) < ROUTE_OPTIONS_FLASH_TRIGGER && progress >= ROUTE_OPTIONS_FLASH_TRIGGER) {
        runOnJS(setSwapAvailable)(false);
        refreshFlashOpacity.value = withSequence(...ROUTE_OPTIONS_FLASH_OPACITY_STEPS.map(value => withTiming(value, { duration: 350 })));
      }
    },
    [],
  );

  const refreshFlashStyle = useAnimatedStyle(() => ({ opacity: refreshFlashOpacity.value }), []);

  return (
    <SwapContext.Provider
      value={{
        sourceTokenState,
        sourceAmountState,
        targetAssetState,
        amountInputFocusState,
        amountInputErrorState,
        amountInputValidState,
        sourceAmountInputValueState,
        loadingState,
        swapAvailableState,
        swapQuoteState,
        swapQuoteError,
        swapFeesFiatValueState,
        refreshCountdownProgress,
        refreshFlashStyle,
      }}>
      {children}
    </SwapContext.Provider>
  );
};

export const useSwapContext = (): SwapContext => {
  const context = useContext(SwapContext);

  if (!context) {
    throw new Error('SwapContext not initialized');
  }

  return context;
};

export const useOptionalSwapContext = (): SwapContext | undefined => {
  return useContext(SwapContext);
};
