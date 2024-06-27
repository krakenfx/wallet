import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, InteractionManager, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoinHeader } from '@/components/CoinHeader';
import { FadingElement } from '@/components/FadingElement';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { ListHeader } from '@/components/ListHeader';
import navigationStyle from '@/components/navigationStyle';
import { SvgIcon } from '@/components/SvgIcon';
import { hideToast } from '@/components/Toast';
import { SheetPosition } from '@/components/TokenMarketData/utils';
import { Touchable } from '@/components/Touchable';
import { TransactionsTokenHeader } from '@/components/TransactionsTokenHeader';
import { useAssetMarketdataFetch } from '@/realm/assetMarketData';
import { useAssetMetadataFetch } from '@/realm/assetMetadata';
import { useResolvedAssetBalance, useTokenById, useTokensFetch } from '@/realm/tokens';
import { useTransactionsFetch } from '@/realm/transactions/useTransactionsFetch';
import { useRealmWalletById } from '@/realm/wallets';
import { NavigationProps } from '@/Routes';
import { SMALL_SHEET_MIN_HEIGHT, TokenMarketDataBottomSheet, defaultSheetPosition } from '@/screens/Transactions/components/TokenMarketDataBottomSheet';
import { TokenSendReceiveButtons } from '@/screens/Transactions/components/TokenSendReceiveButtons';
import { TransactionListItem, useTransactionsDataSource } from '@/screens/Transactions/utils/useTransactionsDataSource';
import { useTheme } from '@/theme/themes';
import { AssetBalanceId } from '@/types';
import { useIsOnline } from '@/utils/useConnectionManager';

import { refreshingTransactionsEvent, showRefreshingTransactionsToast } from './utils/showRefreshingTransactionsToast';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type TransactionsRouteProps = {
  assetBalanceId: AssetBalanceId;
};

export const TransactionsScreenV2 = ({ navigation, route }: NavigationProps<'Transactions'>) => {
  const params = route.params;
  const isRequestInProgress = useRef<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const flashListRef = useRef<FlashList<TransactionListItem>>(null);

  const [walletId, _, tokenId] = useResolvedAssetBalance(params.assetBalanceId);
  const realmWallet = useRealmWalletById(walletId)!;
  const token = useTokenById(tokenId);
  const { colors } = useTheme();

  const isOnline = useIsOnline();

  const { fetchTransactions } = useTransactionsFetch();
  const { fetchAndSetData: fetchMarketdata } = useAssetMarketdataFetch(token?.assetId);
  const { fetchAndSetData: fetchMetadata } = useAssetMetadataFetch(token?.assetId);
  const { fetchBalance } = useTokensFetch();
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(defaultSheetPosition);

  const requestRefresh = useCallback(
    async (showIndicator = true, withMetadata = false) => {
      console.log('[Transactions/Balance] requestRefresh', realmWallet.id);
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

  const headerTitleComponent = useCallback(() => <CoinHeader assetBalanceId={params.assetBalanceId} />, [params.assetBalanceId]);
  const headerRightComponent = useCallback(
    () => (
      <Touchable onPress={onTransactionHistoryPress} style={[styles.transactionHeaderButton, { backgroundColor: colors.purple_40 }]}>
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
      setIsRefreshing(true);
      await requestRefresh(false, true);
      setIsRefreshing(false);
    }
  };

  const insets = useSafeAreaInsets();

  const onScrollBeginDrag = () => {
    if (sheetPosition !== SheetPosition.SMALL) {
      setSheetPosition(SheetPosition.SMALL);
    }
  };

  const onSheetPositionChange = (position: SheetPosition) => {
    setSheetPosition(position);
  };

  return (
    <GradientScreenView>
      <FadingElement containerStyle={{ marginBottom: insets.bottom + SMALL_SHEET_MIN_HEIGHT }}>
        <FlashList
          ListHeaderComponent={
            <>
              {token ? <TransactionsTokenHeader token={token} testID="TokenScreen" /> : null}

              <TokenSendReceiveButtons navigation={navigation} assetBalanceId={params.assetBalanceId} />
              {dataSource && dataSource?.length > 0 && (
                <ListHeader buttonTestID="TokenScreen-BottomSheet-Heading" title={loc.transactionTile.activity} style={styles.header} />
              )}
            </>
          }
          ListEmptyComponent={emptyListMessage}
          data={dataSource}
          ref={flashListRef}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={pullToRefresh} />}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.container}
          estimatedItemSize={60}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          onScrollBeginDrag={onScrollBeginDrag}
        />
      </FadingElement>
      {tokenId && <TokenMarketDataBottomSheet tokenId={tokenId} onPositionChange={onSheetPositionChange} positionIndex={sheetPosition} />}
    </GradientScreenView>
  );
};

TransactionsScreenV2.navigationOptions = navigationStyle({
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
  reputationPillContainer: {
    flexDirection: 'row',
    marginTop: 12,
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

export default TransactionsScreenV2;
