import React, { useEffect, useRef } from 'react';

import { Keyboard, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import type { BottomSheetRef } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { IconButton } from '@/components/IconButton';

import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import type { RealmToken } from '@/realm/tokens';
import { useTokenById } from '@/realm/tokens';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import type { RemoteAsset } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';

import { EXPLAINER_CONTENT_TYPES } from '../Explainer';

import { AmountPercentageSelector } from './components/AmountPercentageSelector';
import { DividerOverlay } from './components/DividerOverlay';
import { LoadingBlock } from './components/LoadingBlock';
import { SourceAssetBlock } from './components/SourceAssetBlock';
import { SourceAssetList } from './components/SourceAssetList';
import { SwapContextProvider, useSwapContext } from './components/SwapContext';
import { TargetAssetBlock } from './components/TargetAssetBlock';
import { TargetAssetBlockEmpty } from './components/TargetAssetBlockEmpty';
import { TargetAssetList } from './components/TargetAssetList';

import loc from '/loc';

export type SwapScreenParams = {
  tokenId?: string;
};

const SwapScreen = ({ route, navigation }: NavigationProps<'Swap'>) => {
  const sourceAssetSheet = useRef<BottomSheetRef>(null);
  const targetAssetSheet = useRef<BottomSheetRef>(null);

  const {
    sourceTokenIdState: [sourceTokenId, setSourceTokenId],
    amountInputFocusState: [amountInputFocused],
    sourceAmountState: [sourceAmount, setSourceTokenAmount],
    sourceAmountInputValueState: [___, setSourceInputAmountValue],
    targetAssetState: [targetAsset, setTargetAsset],
    loadingState: [isLoading, setIsLoading],
    swapRouteState: [_, setBestRoute],
  } = useSwapContext();

  const sourceToken = useTokenById(sourceTokenId);

  useEffect(() => {
    setTimeout(() => {
      if (!route.params?.tokenId) {
        showSourceAssetSelection();
      }
    }, 500);
  }, [route.params?.tokenId]);

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
    setSourceTokenId(newToken.id);
    Keyboard.dismiss();
    sourceAssetSheet.current?.close();
    if (sourceToken.id !== newToken.id) {
      setSourceTokenAmount(undefined);
      setSourceInputAmountValue(undefined);
      setBestRoute(undefined);
      setTargetAsset(undefined);
    }
  };

  const onTargetAssetSelected = (target: RemoteAsset | RealmToken) => {
    targetAssetSheet.current?.close();
    Keyboard.dismiss();
    setTargetAsset(target);
  };

  useEffect(() => {
    if (!amountInputFocused && sourceAmount && sourceTokenId && targetAsset) {
      
      
      
      setIsLoading(true);
      setTimeout(() => {
        setBestRoute({ receiveTokenAmount: '0.0001' });
        setIsLoading(false);
      }, 3000);
    }
  }, [amountInputFocused, sourceTokenId, sourceAmount, targetAsset, setIsLoading, setBestRoute]);

  const showUnlistedExplainer = () => navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.UNVERIFIED_LISTS });

  return (
    <GradientScreenView testID="SwapScreen">
      <ScrollView style={styles.container} bounces={false}>
        <SourceAssetBlock token={sourceToken} onChange={showSourceAssetSelection} />
        <View>
          <DividerOverlay />
          {targetAsset ? (
            <TargetAssetBlock showUnlistedExplainer={showUnlistedExplainer} asset={targetAsset} onChange={showTargetAssetSelection} />
          ) : (
            <TargetAssetBlockEmpty onChange={showTargetAssetSelection} />
          )}
        </View>
        {isLoading && <LoadingBlock />}
      </ScrollView>
      <AmountPercentageSelector token={sourceToken} />
      <FloatingBottomButtons
        primary={{
          text: loc.swap.buttonTitle,
          disabled: true,
        }}
      />
      <SourceAssetList
        onSearchInputFocused={expandSourceAssetSelection}
        currentAsset={sourceToken}
        ref={sourceAssetSheet}
        onAssetSelected={onSourceAssetSelected}
        goBack={navigation.goBack}
      />
      {!!sourceToken && (
        <TargetAssetList
          onSearchInputFocused={expandTargetAssetSelection}
          currentAsset={targetAsset}
          sourceAssetWallet={sourceToken.wallet}
          ref={targetAssetSheet}
          onAssetSelected={onTargetAssetSelected}
          goBack={closeTargetAssetSelection}
        />
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
