import type { NativeScrollEvent } from 'react-native';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { VaultTransaction } from '@/api/types';

import { CoinHeaderSimple } from '@/components/CoinHeader';
import { FadingElement } from '@/components/FadingElement';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { FlashListWithRefreshControl } from '@/components/ScrollerWithRefreshControl';
import { hideToast } from '@/components/Toast';
import type { WalletType } from '@/onChain/wallets/registry';
import { useVaultTransactionsPagedQuery } from '@/reactQuery/hooks/earn/useVaultTransactionsQuery';
import { useLanguage } from '@/realm/settings';
import type { NavigationProps } from '@/Routes';
import { groupItemsByDate } from '@/utils/groupItemsByDate';
import { navigationStyle } from '@/utils/navigationStyle';
import { useIsOnline } from '@/utils/useConnectionManager';

import { DefiDetailsBottomSheet, SMALL_SHEET_MIN_HEIGHT, defaultSheetPosition } from './components/DefiDetailsBottomSheet';
import { DefiDetailsContextProvider, useDefiDetailsContext } from './components/DefiDetailsContext';
import { DefiDetailsHeader, DefiDetailsHeaderNavSkeleton, DefiDetailsHeaderRight } from './components/DefiDetailsHeader';
import { DefiDetailsOpenDappButton } from './components/DefiDetailsOpenDappButton';
import { DefiDetailsTransactionRow } from './components/DefiDetailsTransactionRow';
import { DefiDetailsTransactionsEmpty } from './components/DefiDetailsTransactionsEmpty';

import { SheetPosition, refreshingVaultsEvent, showRefreshingVaultsToast } from './utils';

import type { FlashList, ListRenderItem } from '@shopify/flash-list';

export interface DefiDetailsRouteParams {
  assetId: string;
  protocolLogo: string;
  vaultNetwork: WalletType;
  vaultAddress: string;
}

const keyExtractor: (item: VaultTransaction | string, index: number) => string = (item, index) => {
  if (typeof item === 'string') {
    return `${index}_${item}`;
  }

  return `${index}_${item.activity}_${item.timestamp}`;
};

const DefiDetailsScreen = ({ navigation }: NavigationProps<'DefiDetails'>) => {
  const isOnline = useIsOnline();
  const flashListRef = useRef<FlashList<VaultTransaction | string>>(null);
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(defaultSheetPosition);

  const { assetId, assetDecimals, assetName, assetNetwork, assetSymbol, isPending, protocolLogo, protocolName, vaultAddress, vaultNetwork, vaultType } =
    useDefiDetailsContext();

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
          assetId={assetId}
          assetDecimals={assetDecimals}
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
    [assetDecimals, assetId, assetNetwork, assetSymbol, protocolLogo, protocolName],
  );

  const [page, setPage] = useState(1);
  const loadNextPage = () => setPage(page => ++page);
  const isFetchingVaultTransactionsInProgress = useRef<boolean>(false);
  const {
    data: vaultTransactions,
    refetch: refetchVaultTransactions,
    isFetching: isFetchingVaultTransactions,
    isLoading: isLoadingVaultTransactions,
  } = useVaultTransactionsPagedQuery({ page: page, pageSize: 10, vaultAddress, vaultNetwork });
  const vaultTransactionsGroupedByDate = useMemo(
    () => (vaultTransactions ? groupItemsByDate<VaultTransaction>(vaultTransactions, language) : []),
    [vaultTransactions, language],
  );

  useEffect(() => {
    if (isFetchingVaultTransactions && !isLoadingVaultTransactions) {
      isFetchingVaultTransactionsInProgress.current = true;
      showRefreshingVaultsToast();
    }

    if (!isFetchingVaultTransactions && isFetchingVaultTransactionsInProgress.current) {
      isFetchingVaultTransactionsInProgress.current = false;
      hideToast({ id: refreshingVaultsEvent });
    }

    return () => {
      isFetchingVaultTransactionsInProgress.current = false;
      hideToast({ id: refreshingVaultsEvent });
    };
  }, [isFetchingVaultTransactions, isLoadingVaultTransactions]);

  const pullToRefresh = () => {
    if (isOnline) {
      refetchVaultTransactions();
    }
  };

  const headerLeftComponent = useCallback(
    () =>
      isPending ? (
        <DefiDetailsHeaderNavSkeleton />
      ) : (
        <CoinHeaderSimple coins={[{ tokenId: assetId, tokenNetwork: assetNetwork, tokenSymbol: assetSymbol }]} title={assetName} subtitle={assetNetwork} />
      ),
    [assetId, assetName, assetNetwork, assetSymbol, isPending],
  );
  const headerRightComponent = useCallback(
    () =>
      isPending ? (
        <DefiDetailsHeaderNavSkeleton reverse />
      ) : (
        <DefiDetailsHeaderRight protocolLogo={protocolLogo} protocolName={protocolName} vaultType={vaultType} />
      ),
    [isPending, protocolLogo, protocolName, vaultType],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerLeftComponent,
      headerRight: headerRightComponent,
    });
  }, [headerLeftComponent, headerRightComponent, navigation]);

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
    <GradientScreenView testID="DefiDetailsScreen">
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

const DefiDetailsScreenWrapper = (props: NavigationProps<'DefiDetails'>) => {
  return (
    <DefiDetailsContextProvider {...props.route.params}>
      <DefiDetailsScreen {...props} />
    </DefiDetailsContextProvider>
  );
};

DefiDetailsScreenWrapper.navigationOptions = navigationStyle({
  headerTitleAlign: 'left',
  headerTitle: '',
  headerTransparent: true,
});

export { DefiDetailsScreenWrapper as DefiDetailsScreen };

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
