import type { PropsWithChildren } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import React, { useCallback, useContext, useState } from 'react';

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
import { useFiatAmountToggle } from '@/hooks/useFiatAmountToggle';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { type RealmToken, useTokenById, useTokens } from '@/realm/tokens';

import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import { ROUTE_OPTIONS_FLASH_OPACITY_STEPS, ROUTE_OPTIONS_FLASH_TRIGGER } from '../../SwapScreen.constants';

import type { SwapFeeFiatValueMap, SwapTargetAsset } from '../../types';

type AmountType = 'smallestUnit' | 'tokenUnit' | 'fiat';

export type SwapContext = {
  sourceTokenState: [RealmToken, React.Dispatch<React.SetStateAction<RealmToken>>];
  targetAssetState: ReturnType<typeof useState<SwapTargetAsset>>;
  sourceAmountSmallestUnitState: ReturnType<typeof useState<string>>;
  sourceAmountTokenUnitState: ReturnType<typeof useState<string>>;
  sourceAmountFiatState: ReturnType<typeof useState<string>>;
  amountInputFocusState: ReturnType<typeof useState<boolean>>;
  amountInputErrorState: ReturnType<typeof useState<string>>;
  amountInputValidState: ReturnType<typeof useState<boolean>>;
  amountInputTypingState: ReturnType<typeof useState<boolean>>;
  loadingState: ReturnType<typeof useState<boolean>>;
  swapAvailableState: ReturnType<typeof useState<boolean>>;
  swapQuoteState: ReturnType<typeof useState<SwapQuoteResult>>;
  swapQuoteError: ReturnType<typeof useState<boolean>>;
  swapFeesFiatValueState: ReturnType<typeof useState<SwapFeeFiatValueMap>>;
  fiatAmountToggle: ReturnType<typeof useFiatAmountToggle>;
  refreshCountdownProgress: SharedValue<number>;
  refreshFlashStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle | TextStyle>>>;
  updateAmount: (amount: string | undefined, type?: AmountType) => void;
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
  const sourceAmountSmallestUnitState = useState<string>();
  const sourceAmountTokenUnitState = useState<string>();
  const sourceAmountFiatState = useState<string>();
  const amountInputErrorState = useState<string>();
  const amountInputFocusState = useState<boolean>();
  const amountInputValidState = useState<boolean>();
  const amountInputTypingState = useState<boolean>();
  const loadingState = useState<boolean>();
  const swapAvailableState = useState<boolean>();
  const swapQuoteState = useState<SwapQuoteResult>();
  const swapQuoteError = useState<boolean>();
  const swapFeesFiatValueState = useState<SwapFeeFiatValueMap>();
  const refreshCountdownProgress = useSharedValue<number>(0);
  const refreshFlashOpacity = useSharedValue<number>(1);

  const [_, setSwapAvailable] = swapAvailableState;

  const [sourceToken] = sourceTokenState;
  const [__, setFiatAmount] = sourceAmountFiatState;
  const [___, setSmallestAmount] = sourceAmountSmallestUnitState;
  const [____, setTokenAmount] = sourceAmountTokenUnitState;

  const fiatAmountToggle = useFiatAmountToggle();

  const price = useTokenPrice({ assetId: sourceToken.assetId }) ?? 0;

  const { currency } = useAppCurrency();

  const updateAmount = useCallback(
    (amount: string | undefined, type?: AmountType) => {
      if (!amount) {
        setFiatAmount(undefined);
        setSmallestAmount(undefined);
        return;
      }
      const decimals = sourceToken.metadata.decimals;
      switch (type) {
        case 'fiat': {
          setTokenAmount(
            formatTokenAmount(unitConverter.fiatToTokenUnit(amount, price).toString(10), {
              compact: false,
              grouping: false,
              currency,
              highPrecision: true,
              isBtc: isBtc({ assetId: sourceToken.assetId }),
            }),
          );
          setSmallestAmount(unitConverter.fiatToSmallestUnit(amount, decimals, price).toFixed(0));
          setFiatAmount(amount);
          break;
        }
        case 'tokenUnit': {
          setTokenAmount(amount);
          setSmallestAmount(unitConverter.tokenUnit2SmallestUnit(amount, decimals).toString(10));
          setFiatAmount(unitConverter.tokenUnit2Fiat(amount, price).toFixed(2));
          break;
        }
        case 'smallestUnit': {
          setTokenAmount(
            formatTokenAmount(unitConverter.smallUnit2TokenUnit(amount, decimals).toString(10), {
              compact: false,
              grouping: false,
              currency,
              highPrecision: true,
              isBtc: isBtc({ assetId: sourceToken.assetId }),
            }),
          );
          setSmallestAmount(amount);
          setFiatAmount(unitConverter.smallestUnit2Fiat(amount, decimals, price).toFixed(2));
        }
      }
    },
    [currency, price, setFiatAmount, setSmallestAmount, setTokenAmount, sourceToken.assetId, sourceToken.metadata.decimals],
  );

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
        sourceAmountSmallestUnitState,
        sourceAmountTokenUnitState,
        sourceAmountFiatState,
        targetAssetState,
        amountInputFocusState,
        amountInputErrorState,
        amountInputValidState,
        amountInputTypingState,
        loadingState,
        swapAvailableState,
        swapQuoteState,
        swapQuoteError,
        swapFeesFiatValueState,
        refreshCountdownProgress,
        refreshFlashStyle,
        fiatAmountToggle,
        updateAmount,
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
