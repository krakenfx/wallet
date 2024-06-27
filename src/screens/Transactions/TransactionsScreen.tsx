import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Image, InteractionManager, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet, BottomSheetFlashList } from '@/components/BottomSheet';
import { CoinHeader } from '@/components/CoinHeader';
import { FadingElement } from '@/components/FadingElement';
import { FloatingSendReceive } from '@/components/FloatingSendReceive';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { LargeCoinHeader } from '@/components/LargeCoinHeader';
import { ListHeader } from '@/components/ListHeader';
import navigationStyle from '@/components/navigationStyle';
import { RefreshControlScrollView } from '@/components/RefreshControlScrollView';
import { ReputationPill } from '@/components/Reputation';
import { hideToast } from '@/components/Toast';
import { Touchable } from '@/components/Touchable';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { useResolvedAssetBalance, useTokenById, useTokensFetch } from '@/realm/tokens';
import { useTransactionsFetch } from '@/realm/transactions/useTransactionsFetch';
import { useRealmWalletById } from '@/realm/wallets';
import { NavigationProps, Routes } from '@/Routes';
import { TransactionsScreenV2 } from '@/screens/Transactions/TransactionsScreenV2';
import { useTransactionsDataSource } from '@/screens/Transactions/utils/useTransactionsDataSource';
import { AssetBalanceId } from '@/types';
import { FeatureFlag, useFeatureFlag } from '@/utils/featureFlags';
import { useIsOnline } from '@/utils/useConnectionManager';

import { refreshingTransactionsEvent, showRefreshingTransactionsToast } from './utils/showRefreshingTransactionsToast';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type TransactionsRouteProps = {
  assetBalanceId: AssetBalanceId;
};

export const TransactionsScreenV1 = ({ navigation, route }: NavigationProps<'Transactions'>) => {
  const params = route.params;
  const isRefreshing = useRef<boolean>(false);

  const [walletId, _, tokenId] = useResolvedAssetBalance(params.assetBalanceId);
  const realmWallet = useRealmWalletById(walletId)!;
  const token = useTokenById(tokenId);

  const isOnline = useIsOnline();

  const { fetchTransactions } = useTransactionsFetch();
  const { fetchBalance } = useTokensFetch();

  const requestRefresh = useCallback(
    async (showIndicator = true) => {
      console.log('[Transactions/Balance] requestRefresh', realmWallet.id);
      if (!realmWallet || !isOnline) {
        return;
      }
      if (isRefreshing.current) {
        return;
      }
      isRefreshing.current = true;
      showIndicator && showRefreshingTransactionsToast();
      try {
        console.log('[Transactions & Balance] fetching');

        await Promise.all([fetchTransactions(realmWallet, true), fetchBalance(realmWallet, false)]);
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
      } finally {
        isRefreshing.current = false;
        hideToast({ id: refreshingTransactionsEvent });
      }
    },
    [fetchBalance, fetchTransactions, isOnline, realmWallet],
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

  const headerTitleComponent = useCallback(() => <CoinHeader assetBalanceId={params.assetBalanceId} />, [params.assetBalanceId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitleComponent,
    });
  }, [headerTitleComponent, navigation]);

  const pullToRefresh = () => {
    if (isOnline) {
      requestRefresh();
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <GradientScreenView>
      {token ? (
        <RefreshControlScrollView onRefresh={pullToRefresh}>
          <LargeCoinHeader
            token={token}
            wallet={realmWallet}
            testID="TokenScreen"
            pill={
              <Touchable onPress={() => navigation.navigate(Routes.TokenLists, { assetId: token.assetId })}>
                <ReputationPill assetId={token.assetId} style={styles.reputationPillContainer} />
              </Touchable>
            }
          />
        </RefreshControlScrollView>
      ) : null}

      <BottomSheet noBackdrop snapPoints={useCommonSnapPoints('toHeaderAndMainContent')} noSafeInsetTop dismissible={false}>
        {dataSource && dataSource?.length > 0 && (
          <ListHeader buttonTestID="TokenScreen-BottomSheet-Heading" title={loc.transactionTile.activity} style={styles.header} />
        )}
        <FadingElement>
          <BottomSheetFlashList
            ListEmptyComponent={emptyListMessage}
            data={dataSource}
            contentInset={{ top: 0, left: 0, bottom: insets.bottom, right: 0 }}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.container}
            estimatedItemSize={60}
            onEndReached={loadNextPage}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
          />
        </FadingElement>
      </BottomSheet>
      <FloatingSendReceive navigation={navigation} assetBalanceId={params.assetBalanceId} />
    </GradientScreenView>
  );
};

export const TransactionsScreen = ({ navigation, route }: NavigationProps<'Transactions'>) => {
  const { isFeatureFlagEnabled: isAssetMarketDataEnabled } = useFeatureFlag(FeatureFlag.AssetMarketDataEnabled);
  if (isAssetMarketDataEnabled) {
    return <TransactionsScreenV2 navigation={navigation} route={route} />;
  } else {
    return <TransactionsScreenV1 navigation={navigation} route={route} />;
  }
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
    paddingHorizontal: 24,
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
});

export default TransactionsScreen;
