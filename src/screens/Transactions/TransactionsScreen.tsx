import type { NativeScrollEvent } from 'react-native';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, InteractionManager, StyleSheet, View } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoinHeader } from '@/components/CoinHeader';
import { FadingElement } from '@/components/FadingElement';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { ListHeader } from '@/components/ListHeader';
import { FlashListWithRefreshControl } from '@/components/ScrollerWithRefreshControl';
import { SvgIcon } from '@/components/SvgIcon';
import { hideToast } from '@/components/Toast';
import { Touchable } from '@/components/Touchable';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useAssetMarketdataFetch } from '@/realm/assetMarketData';
import { useAssetMetadataFetch } from '@/realm/assetMetadata';
import { useResolvedAssetBalance, useTokenById, useTokensFetch } from '@/realm/tokens';
import { useTransactionsFetch } from '@/realm/transactions/useTransactionsFetch';
import { useRealmWalletById } from '@/realm/wallets';
import type { NavigationProps } from '@/Routes';

import { useTheme } from '@/theme/themes';
import type { AssetBalanceId } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';
import { useIsOnline } from '@/utils/useConnectionManager';

import { isSwapSupportedForToken } from '../Swap/utils/isSwapSupportedForToken';

import { TokenActionButtons } from './components/TokenActionButtons';
import { SheetPosition } from './components/TokenMarketData/utils';
import { SMALL_SHEET_MIN_HEIGHT, TokenMarketDataBottomSheet, defaultSheetPosition } from './components/TokenMarketDataBottomSheet';
import { TransactionsTokenHeader } from './components/TransactionsTokenHeader';

import { refreshingTransactionsEvent, showRefreshingTransactionsToast } from './utils/showRefreshingTransactionsToast';

import { useTransactionsDataSource } from './utils/useTransactionsDataSource';

import type { TransactionListItem } from './utils/useTransactionsDataSource';
import type { FlashList } from '@shopify/flash-list';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type TransactionsRouteProps = {
  assetBalanceId: AssetBalanceId;
};

export const TransactionsScreen = ({ navigation, route }: NavigationProps<'Transactions'>) => {
  const params = route.params;
  const isRequestInProgress = useRef<boolean>(false);
  const flashListRef = useRef<FlashList<TransactionListItem>>(null);

  const [walletId, _, tokenId] = useResolvedAssetBalance(params.assetBalanceId);

  const realmWallet = useRealmWalletById(walletId)!;

  const { network } = getImplForWallet(realmWallet);

  const token = useTokenById(tokenId);
  const { colors } = useTheme();

  const canSwap = isSwapSupportedForToken(token);

  const isOnline = useIsOnline();

  const { fetchTransactions } = useTransactionsFetch();
  const { fetchAndSetData: fetchMarketdata } = useAssetMarketdataFetch(token?.assetId);
  const { fetchAndSetData: fetchMetadata } = useAssetMetadataFetch(token?.assetId);
  const { fetchBalance } = useTokensFetch();
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(defaultSheetPosition);

  const requestRefresh = useCallback(
    async (showIndicator = true, withMetadata = false) => {
      if (!realmWallet || !isOnline) {
        return;
      }
      if (isRequestInProgress.current) {
        return;
      }
      isRequestInProgress.current = true;
      showIndicator && showRefreshingTransactionsToast();
      try {
        console.log('[Transactions & Balance] fetching');

        await Promise.all([
          fetchTransactions(realmWallet, true),
          fetchBalance(realmWallet, false),
          withMetadata && fetchMarketdata(),
          withMetadata && fetchMetadata(),
        ]);
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
      } finally {
        isRequestInProgress.current = false;
        hideToast({ id: refreshingTransactionsEvent });
      }
    },
    [fetchBalance, fetchMarketdata, fetchMetadata, fetchTransactions, isOnline, realmWallet],
  );

  const refreshAfterPendingTxSucceed = useCallback(() => {
    requestRefresh(false);
  }, [requestRefresh]);

  const { dataSource, keyExtractor, renderItem, loadNextPage, renderFooter } = useTransactionsDataSource({
    tokenId,
    pendingTransactionIds: token?.pendingTransactions.sorted('time', true).map(({ id }) => id) ?? [],
    walletId,
    onPendingTxSucceed: refreshAfterPendingTxSucceed,
    navigation,
  });

  const emptyListMessage = () => {
    return (
      <View style={styles.containerZeroState}>
        <Image source={require('../../assets/images/transactions/zero_state_tx.png')} style={styles.image} />
        <Label type="boldTitle1" style={styles.text}>
          {loc.transactionTile.noTransactionsTitle}
        </Label>
        <Label type="regularBody" color="light75" style={styles.text}>
          {loc.formatString(loc.transactionTile.noTransactionsDescription, `${token?.metadata.symbol}`)}
        </Label>
      </View>
    );
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      requestRefresh(false);
    });
  }, [requestRefresh]);

  const onTransactionHistoryPress = useCallback(() => {
    if (flashListRef.current) {
      setSheetPosition(SheetPosition.SMALL);
      flashListRef.current.scrollToIndex({ index: 0, animated: true, viewOffset: 50 });
    }
  }, []);

  const headerTitleComponent = useCallback(() => <CoinHeader wallet={realmWallet} token={token} />, [realmWallet, token]);
  const headerRightComponent = useCallback(
    () => (
      <Touchable onPress={onTransactionHistoryPress} testID="TxHistory" style={[styles.transactionHeaderButton, { backgroundColor: colors.purple_40 }]}>
        <SvgIcon name="clock" size={18} />
      </Touchable>
    ),
    [onTransactionHistoryPress, colors.purple_40],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitleComponent,
      headerRight: headerRightComponent,
    });
  }, [headerRightComponent, headerTitleComponent, navigation]);

  const pullToRefresh = async () => {
    if (isOnline) {
      requestRefresh(true, true);
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
          ListHeaderComponent={
            <>
              {token ? <TransactionsTokenHeader token={token} testID="TokenScreen" /> : null}
              <TokenActionButtons
                navigation={navigation}
                assetBalanceId={params.assetBalanceId}
                canSwap={canSwap}
                assetSymbol={token?.metadata.symbol}
                krakenConnectNetworkId={network.krakenConnectNetworkId}
              />
              {dataSource && dataSource?.length > 0 && (
                <ListHeader buttonTestID="TokenScreen-BottomSheet-Heading" title={loc.transactionTile.activity} style={styles.header} />
              )}
            </>
          }
          ListEmptyComponent={emptyListMessage}
          data={dataSource}
          ref={flashListRef}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.container}
          estimatedItemSize={60}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          onScrollEvent={onScrollEvent}
        />
      </FadingElement>
      {tokenId && <TokenMarketDataBottomSheet tokenId={tokenId} onPositionChange={onSheetPositionChange} positionIndex={sheetPosition} />}
    </GradientScreenView>
  );
};

TransactionsScreen.navigationOptions = navigationStyle({
  headerTitleAlign: 'left',
  headerTransparent: true,
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  header: {
    marginTop: 46,
    paddingBottom: 4,
  },
  sectionHeader: {
    marginTop: 16,
  },
  containerZeroState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 183,
    marginBottom: 2,
  },
  text: {
    marginVertical: 2,
  },
  transactionHeaderButton: {
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
