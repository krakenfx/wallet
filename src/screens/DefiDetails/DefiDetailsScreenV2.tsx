import type { NativeScrollEvent } from 'react-native';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadingElement } from '@/components/FadingElement';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { FlashListWithRefreshControl } from '@/components/ScrollerWithRefreshControl';
import { hideToast } from '@/components/Toast';
import type { WalletType } from '@/onChain/wallets/registry';
import { type VaultTransaction, useVaultTransactionsPagedQuery } from '@/reactQuery/hooks/useVaultTransactionsQuery';
import { useLanguage } from '@/realm/settings';
import type { NavigationProps } from '@/Routes';
import { groupItemsByDate } from '@/utils/groupItemsByDate';
import { navigationStyle } from '@/utils/navigationStyle';
import { useIsOnline } from '@/utils/useConnectionManager';

import { DefiDetailsBottomSheet, SMALL_SHEET_MIN_HEIGHT, defaultSheetPosition } from './components/DefiDetailsBottomSheet';
import { DefiDetailsContextProvider, useDefiDetailsContext } from './components/DefiDetailsContext';
import { DefiDetailsHeader, DefiDetailsHeaderLeft, DefiDetailsHeaderRight } from './components/DefiDetailsHeader';
import { DefiDetailsOpenDappButton } from './components/DefiDetailsOpenDappButton';
import { DefiDetailsTransactionRow } from './components/DefiDetailsTransactionRow';
import { DefiDetailsTransactionsEmpty } from './components/DefiDetailsTransactionsEmpty';

import { SheetPosition, refreshingVaultsEvent, showRefreshingVaultsToast } from './utils';

import type { FlashList, ListRenderItem } from '@shopify/flash-list';

import { handleError } from '/helpers/errorHandler';

export interface DefiDetailsRouteParamsV2 {
  assetAddress: string;
  assetCaipId: string;
  assetName: string;
  assetNetwork: WalletType;
  assetSymbol: string;
  protocolDescription?: string;
  protocolLogo: string;
  protocolName: string;
  vaultNetwork: WalletType;
  vaultAddress: string;
}

const keyExtractor: (item: VaultTransaction | string, index: number) => string = (item, index) => {
  if (typeof item === 'string') {
    return `${index}_${item}`;
  }

  return `${index}_${item.activity}_${item.timestamp}`;
};

const DefiDetailsScreenV2 = ({ navigation }: NavigationProps<'DefiDetailsV2'>) => {
  const isOnline = useIsOnline();
  const flashListRef = useRef<FlashList<VaultTransaction | string>>(null);
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(defaultSheetPosition);

  const { assetAddress, assetName, assetNetwork, assetSymbol, protocolLogo, protocolName, vaultAddress, vaultNetwork, vaultType } = useDefiDetailsContext();

  const language = useLanguage();

  const renderItem: ListRenderItem<VaultTransaction | string> = useCallback(
    ({ item, index }) => {
      if (typeof item === 'string') {
        return (
          <Label
            entering={FadeIn}
            exiting={FadeOut}
            type="boldTitle2"
            style={[styles.transactionDate, index === 0 && styles.first]}
            color="light50"
            testID="SectionLabel">
            {item}
          </Label>
        );
      }

      return (
        <DefiDetailsTransactionRow
          assetAddress={assetAddress}
          assetNetwork={assetNetwork}
          assetSymbol={assetSymbol}
          assetAmount={item.amount.native}
          assetAmountInUsd={item.amount.usd}
          protocolLogo={protocolLogo}
          protocolName={protocolName}
          title={item.activity}
          testID="VaultTransaction"
        />
      );
    },
    [assetAddress, assetNetwork, assetSymbol, protocolLogo, protocolName],
  );

  const [page, setPage] = useState(1);
  const loadNextPage = () => setPage(page => ++page);
  const { data: vaultTransactions } = useVaultTransactionsPagedQuery({ page: page, pageSize: 10, vaultAddress, vaultNetwork });
  const vaultTransactionsGroupedByDate = useMemo(
    () => (vaultTransactions ? groupItemsByDate<VaultTransaction>(vaultTransactions, language) : []),
    [vaultTransactions, language],
  );

  const headerLeftComponent = useCallback(
    () => <DefiDetailsHeaderLeft assetAddress={assetAddress} assetName={assetName} assetNetwork={assetNetwork} assetSymbol={assetSymbol} />,
    [assetAddress, assetName, assetNetwork, assetSymbol],
  );
  const headerRightComponent = useCallback(
    () => <DefiDetailsHeaderRight protocolLogo={protocolLogo} protocolName={protocolName} vaultType={vaultType} />,
    [protocolLogo, protocolName, vaultType],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerLeftComponent,
      headerRight: headerRightComponent,
    });
  }, [headerLeftComponent, headerRightComponent, navigation]);

  const isRequestInProgress = useRef<boolean>(false);
  const requestRefresh = useCallback(async () => {
    if (!isOnline) {
      return;
    }
    if (isRequestInProgress.current) {
      return;
    }
    isRequestInProgress.current = true;
    showRefreshingVaultsToast();
    try {
      await Promise.all([() => []]);
    } catch (error) {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    } finally {
      isRequestInProgress.current = false;
      hideToast({ id: refreshingVaultsEvent });
    }
  }, [isOnline]);

  const pullToRefresh = async () => {
    if (isOnline) {
      requestRefresh();
    }
  };

  const insets = useSafeAreaInsets();

  const onSheetPositionChange = (position: SheetPosition) => {
    setSheetPosition(position);
  };

  const onScrollEvent = useCallback(
    (e: NativeScrollEvent) => {
      'worklet';
      if (sheetPosition !== SheetPosition.SMALL) {
        if (e.contentOffset.y > 30) {
          runOnJS(setSheetPosition)(SheetPosition.SMALL);
        }
      }
    },
    [sheetPosition],
  );

  return (
    <GradientScreenView>
      <FadingElement containerStyle={{ marginBottom: insets.bottom + SMALL_SHEET_MIN_HEIGHT }}>
        <FlashListWithRefreshControl
          onRefresh={pullToRefresh}
          ListHeaderComponent={<DefiDetailsHeader />}
          ListEmptyComponent={<DefiDetailsTransactionsEmpty />}
          data={vaultTransactionsGroupedByDate}
          ref={flashListRef}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.container}
          estimatedItemSize={20}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          onScrollEvent={onScrollEvent}
        />
      </FadingElement>
      <DefiDetailsBottomSheet onPositionChange={onSheetPositionChange} positionIndex={sheetPosition} />
      <DefiDetailsOpenDappButton />
    </GradientScreenView>
  );
};

const DefiDetailsScreenV2Wrapper = (props: NavigationProps<'DefiDetailsV2'>) => {
  return (
    <DefiDetailsContextProvider {...props.route.params}>
      <DefiDetailsScreenV2 {...props} />
    </DefiDetailsContextProvider>
  );
};

DefiDetailsScreenV2Wrapper.navigationOptions = navigationStyle({
  headerTitleAlign: 'left',
  headerTitle: '',
  headerTransparent: true,
});

export { DefiDetailsScreenV2Wrapper as DefiDetailsScreenV2 };

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  transactionDate: {
    marginTop: 24,
    marginBottom: 16,
  },
  first: {
    marginTop: 40,
  },
});
