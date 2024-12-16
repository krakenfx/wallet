import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Keyboard, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Easing, cancelAnimation, runOnJS, withTiming } from 'react-native-reanimated';

import { fetchSwapQuote } from '@/api/fetchSwapQuote';
import type { SwapQuoteRouteType } from '@/api/types';
import type { BottomSheetModalRef, BottomSheetRef } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { IconButton } from '@/components/IconButton';

import { useMenu } from '@/components/Menu';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { type RealmToken, useTokenByAssetId } from '@/realm/tokens';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import type { RemoteAsset } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';

import { runAfterUISync } from '@/utils/runAfterUISync';

import { EXPLAINER_CONTENT_TYPES } from '../Explainer';

import { AmountPercentageSelector } from './components/AmountPercentageSelector';
import { DividerOverlay } from './components/DividerOverlay';
import { LoadingBlock } from './components/LoadingBlock';
import { RouteDetails } from './components/RouteDetails';
import { SourceAssetBlock, type SourceAssetBlockRef } from './components/SourceAssetBlock';
import { SourceAssetList } from './components/SourceAssetList';
import { SwapConfirmationSheet } from './components/SwapConfirmationSheet';
import { SwapContextProvider, useSwapContext } from './components/SwapContext';
import { SwapRouteExplainerSheet } from './components/SwapRouteExplainerSheet/SwapRouteExplainerSheet';
import { TargetAssetBlock } from './components/TargetAssetBlock';
import { TargetAssetBlockEmpty } from './components/TargetAssetBlockEmpty';
import { TargetAssetList } from './components/TargetAssetList';

import { UnsupportedRoute } from './components/UnsupportedRoute';
import { useSwapRouteData } from './hooks/useSwapRouteData';
import { BroadcastState, ROUTE_VALIDITY_PERIOD_MS, SUCCESS_TIMEOUT } from './SwapScreen.constants';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type SwapScreenParams = {
  tokenId?: string;
};

const SwapScreen = ({ route, navigation }: NavigationProps<'Swap'>) => {
  const sourceAssetSheet = useRef<BottomSheetRef>(null);
  const targetAssetSheet = useRef<BottomSheetRef>(null);
  const confirmationSheet = useRef<BottomSheetModalRef>(null);
  const swapRouteExplainerSheet = useRef<BottomSheetModalRef>(null);
  const sourceAssetBlock = useRef<SourceAssetBlockRef>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [insuffucientFundsError, setInsufficientFundsError] = useState<boolean>(false);

  const {
    sourceTokenState: [sourceToken, setSourceToken],
    amountInputFocusState: [amountInputFocused],
    sourceAmountState: [sourceAmount, setSourceTokenAmount],
    sourceAmountInputValueState: [___, setSourceInputAmountValue],
    targetAssetState: [targetAsset, setTargetAsset],
    loadingState: [isLoading, setIsLoading],
    swapAvailableState: [_, setIsSwapAvailable],
    swapQuoteState: [swapQuote, setSwapQuote],
    swapQuoteError: [swapQuoteError, setSwapQuoteError],
    swapFeesFiatValueState: [__, setFeesFiatValues],
    amountInputValidState: [isAmountInputValid],
    refreshCountdownProgress,
  } = useSwapContext();

  const { hide: hideMenu } = useMenu();

  const [selectedRouteType, setSelectedRouteType] = useState<SwapQuoteRouteType>('value');

  useEffect(() => {
    runAfterUISync(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isAmountInputValid && (swapQuote || swapQuoteError)) {
      setSwapQuote(undefined);
      setSwapQuoteError(undefined);
    }
  }, [isAmountInputValid, setSwapQuote, setSwapQuoteError, swapQuote, swapQuoteError]);

  const showSourceAssetSelection = () => {
    sourceAssetSheet.current?.snapToIndex(0);
  };

  const showTargetAssetSelection = () => {
    targetAssetSheet.current?.snapToIndex(0);
  };

  const expandSourceAssetSelection = () => {
    sourceAssetSheet.current?.expand();
  };

  const expandTargetAssetSelection = () => {
    targetAssetSheet.current?.expand();
  };

  const closeTargetAssetSelection = () => {
    targetAssetSheet.current?.close();
  };

  const onSourceAssetSelected = (newToken: RealmToken) => {
    setSourceToken(newToken);
    sourceAssetSheet.current?.close();
    if (sourceToken.id !== newToken.id) {
      setSourceTokenAmount(undefined);
      setSourceInputAmountValue(undefined);
      setSwapQuote(undefined);
      setTargetAsset(undefined);
    }
  };

  const onTargetAssetSelected = (target: RemoteAsset | RealmToken) => {
    targetAssetSheet.current?.close();
    setTargetAsset(target);
  };

  const onSourceListClose = useCallback(
    (hasSelectedAsset?: boolean) => {
      if (!targetAsset && hasSelectedAsset) {
        showTargetAssetSelection();
      }
      Keyboard.dismiss();
    },
    [targetAsset],
  );

  const onTargetListClose = useCallback(() => {
    if (!!targetAsset && !sourceAmount) {
      sourceAssetBlock.current?.focusInput();
    } else {
      Keyboard.dismiss();
    }
  }, [sourceAmount, targetAsset]);

  const resetCountDown = useCallback(() => {
    cancelAnimation(refreshCountdownProgress);
    refreshCountdownProgress.value = 0;
  }, [refreshCountdownProgress]);

  const requestSwapRoute = useCallback(async () => {
    if (!targetAsset || !sourceToken || !isAmountInputValid || !sourceAmount) {
      throw new Error('Requesting swap quote with incomplete data');
    }
    setIsLoading(true);
    setFeesFiatValues(undefined);
    setSwapQuoteError(false);
    setInsufficientFundsError(false);
    hideMenu();
    try {
      const { network } = getImplForWallet(sourceToken.wallet);

      const fromAddress = await network.deriveAddress(sourceToken.wallet);

      const data = await fetchSwapQuote({
        from: {
          assetId: sourceToken.assetId,
          amount: sourceAmount,
        },
        to: {
          assetId: targetAsset.assetId,
        },
        fromAddress,
        routeType: selectedRouteType,
      });
      if (!data) {
        throw new Error('Failed to fetch swap quote');
      }

      setSwapQuote(data);
      setIsSwapAvailable(true);
      resetCountDown();
      refreshCountdownProgress.value = withTiming(1, { duration: ROUTE_VALIDITY_PERIOD_MS, easing: Easing.linear }, finished => {
        if (finished) {
          runOnJS(requestSwapRoute)();
        }
      });
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      cancelAnimation(refreshCountdownProgress);
      setSwapQuoteError(true);
      setSwapQuote(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [
    targetAsset,
    sourceToken,
    isAmountInputValid,
    sourceAmount,
    setIsLoading,
    setFeesFiatValues,
    setSwapQuoteError,
    hideMenu,
    selectedRouteType,
    setSwapQuote,
    setIsSwapAvailable,
    resetCountDown,
    refreshCountdownProgress,
  ]);

  useEffect(() => {
    if (amountInputFocused) {
      setInsufficientFundsError(false);
    }
  }, [amountInputFocused]);

  useEffect(() => {
    if (!amountInputFocused && sourceAmount && sourceToken && targetAsset && isAmountInputValid) {
      requestSwapRoute();
    } else {
      resetCountDown();
    }
  }, [
    amountInputFocused,
    sourceToken,
    sourceAmount,
    targetAsset,
    setIsLoading,
    setSwapQuote,
    refreshCountdownProgress,
    requestSwapRoute,
    isAmountInputValid,
    resetCountDown,
  ]);

  useEffect(() => {
    return resetCountDown;
  }, [resetCountDown]);

  const swapRouteData = useSwapRouteData();

  const gasToken = useTokenByAssetId(sourceToken.wallet.nativeTokenCaipId, sourceToken.wallet.id);

  const hasInsufficientFundsForGas = useMemo(() => {
    if (insuffucientFundsError) {
      return true;
    }

    if (isLoading || !swapRouteData) {
      return false;
    }
    const gasFee = swapRouteData.fees.find(fee => fee.type === 'gas');
    if (!gasFee?.feeAsset.amount) {
      return false;
    }

    if (gasToken.assetId === sourceToken.assetId) {
      return new BigNumber(gasToken.balance).minus(swapRouteData.sourceAssetAmount).isLessThan(gasFee.feeAsset.amount);
    }
    return new BigNumber(gasToken.balance).isLessThan(gasFee.feeAsset.amount);
  }, [isLoading, swapRouteData, gasToken.assetId, gasToken.balance, sourceToken.assetId, insuffucientFundsError]);

  const finishFlow = useCallback(() => {
    setTimeout(() => {
      navigation.goBack();
    }, SUCCESS_TIMEOUT);
  }, [navigation]);

  const onSwapFailed = useCallback((insufficientFunds?: boolean) => {
    if (insufficientFunds) {
      setInsufficientFundsError(true);
    }
  }, []);

  const onBroadcastStateChange = useCallback(
    (state: BroadcastState) => {
      switch (state) {
        case BroadcastState.NONE: {
          requestSwapRoute();
          break;
        }
        case BroadcastState.LOADING: {
          resetCountDown();
          break;
        }
        case BroadcastState.SUCCESS: {
          finishFlow();
          break;
        }
      }
    },
    [finishFlow, requestSwapRoute, resetCountDown],
  );

  const showUnlistedExplainer = () => navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.UNVERIFIED_LISTS });
  const showRouteExplainerSheet = () => {
    swapRouteExplainerSheet.current?.present();
  };

  return (
    <GradientScreenView testID="SwapScreen">
      <ScrollView style={styles.container} bounces={false}>
        <SourceAssetBlock
          isLoading={isLoading}
          ref={sourceAssetBlock}
          token={sourceToken}
          onChange={showSourceAssetSelection}
          errorMsg={hasInsufficientFundsForGas ? loc.formatString(loc.swap.error.insufficientGas, { symbol: gasToken.metadata.symbol }).toString() : undefined}
        />
        <View>
          <DividerOverlay />
          {targetAsset ? (
            <TargetAssetBlock showUnlistedExplainer={showUnlistedExplainer} asset={targetAsset} route={swapRouteData} onChange={showTargetAssetSelection} />
          ) : (
            <TargetAssetBlockEmpty onChange={showTargetAssetSelection} />
          )}
        </View>
        {isLoading && <LoadingBlock />}
        {!isLoading && swapRouteData && (
          <RouteDetails
            showExplainer={showRouteExplainerSheet}
            route={swapRouteData}
            selectedRouteType={selectedRouteType}
            onRouteTypeChange={r => setSelectedRouteType(r.id)}
          />
        )}
        {!isLoading && swapQuoteError && <UnsupportedRoute />}
      </ScrollView>
      <AmountPercentageSelector token={sourceToken} />
      <FloatingBottomButtons
        primary={{
          text: loc.swap.buttonTitle,
          onPress: () => confirmationSheet.current?.expand(),
          disabled: isLoading || !swapRouteData || hasInsufficientFundsForGas,
        }}
      />
      {isMounted && (
        <SourceAssetList
          expandOnMount={!route.params?.tokenId}
          onSearchInputFocused={expandSourceAssetSelection}
          currentAsset={sourceToken}
          ref={sourceAssetSheet}
          onAssetSelected={onSourceAssetSelected}
          goBack={navigation.goBack}
          onClose={onSourceListClose}
        />
      )}
      {isMounted && !!sourceToken && (
        <TargetAssetList
          onSearchInputFocused={expandTargetAssetSelection}
          currentAsset={targetAsset}
          sourceAsset={sourceToken}
          ref={targetAssetSheet}
          onAssetSelected={onTargetAssetSelected}
          goBack={closeTargetAssetSelection}
          onClose={onTargetListClose}
        />
      )}
      {!!sourceToken && targetAsset && swapRouteData && sourceAmount && swapQuote && (
        <SwapConfirmationSheet
          showExplainer={showRouteExplainerSheet}
          goBack={() => confirmationSheet.current?.close()}
          onBroadcastStateChange={onBroadcastStateChange}
          route={swapRouteData}
          ref={confirmationSheet}
          swapQuote={swapQuote}
          onSwapFailed={onSwapFailed}
        />
      )}
      {!!swapRouteData?.steps && (
        <SwapRouteExplainerSheet onClose={() => swapRouteExplainerSheet.current?.close()} steps={swapRouteData.steps} ref={swapRouteExplainerSheet} />
      )}
    </GradientScreenView>
  );
};

const SwapScreenWrapper = (props: NavigationProps<'Swap'>) => {
  useHeaderTitle(loc.swap.title);
  return (
    <SwapContextProvider defaultTokenId={props.route.params?.tokenId}>
      <SwapScreen {...props} />
    </SwapContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});

export { SwapScreenWrapper as SwapScreen };

SwapScreenWrapper.navigationOptions = navigationStyle({
  headerTransparent: true,
  headerRight: () => <IconButton name="slippage" />,
});
