import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadingElement } from '@/components/FadingElement';
import { GradientScreenView } from '@/components/Gradients';
import { NetworkFilter, useNetworkFilter } from '@/components/NetworkFilter';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { refreshAllTransactions } from '@/realm/refreshManagerHooks';
import { useTransactionsFetch } from '@/realm/transactions';
import { NavigationProps } from '@/Routes';
import { TransactionListItem, useTransactionsDataSource } from '@/screens/Transactions/utils/useTransactionsDataSource';
import { navigationStyle } from '@/utils/navigationStyle';
import { useIsOnline } from '@/utils/useConnectionManager';

import { GlobalActivityEmptyAll, GlobalActivityEmptyNetworkSelection } from './components/GlobalActivityEmptyInfo';

import loc from '/loc';

export const GlobalActivityScreen = ({ navigation }: NavigationProps<'GlobalActivity'>) => {
  useHeaderTitle(loc.globalActivity.title);

  const [networkFilter, setNetworkFilter] = useNetworkFilter();
  const isOnline = useIsOnline();
  const { fetchAllTransactionsForAllNetworks } = useTransactionsFetch();
  const [isFetching, setIsFetching] = useState(false);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashList<TransactionListItem>>(null);

  useEffect(() => {
    refreshAllTransactions();
  }, []);

  const onPendingTxSucceed = useCallback(() => {
    refreshAllTransactions();
  }, []);

  const { dataSource, keyExtractor, renderItem, renderFooter, getItemType, loadNextPage } = useTransactionsDataSource({
    onPendingTxSucceed,
    navigation,
    networkFilter,
  });

  const pullToRefresh = useCallback(async () => {
    if (isOnline) {
      setIsFetching(true);
      await fetchAllTransactionsForAllNetworks();
      setIsFetching(false);
    }
  }, [fetchAllTransactionsForAllNetworks, isOnline]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToIndex({
        animated: false,
        index: 0,
      });
    }
  }, [networkFilter]);

  const renderEmptyState = () => {
    if (networkFilter.length === 0) {
      return <GlobalActivityEmptyAll navigation={navigation} />;
    } else {
      return <GlobalActivityEmptyNetworkSelection />;
    }
  };

  return (
    <GradientScreenView>
      <View style={styles.networkFilterContainer}>
        <NetworkFilter networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} withBtcAndDoge />
      </View>
      <FadingElement containerStyle={{ marginBottom: insets.bottom }}>
        {dataSource.length === 0 && renderEmptyState()}
        <FlashList
          ref={listRef}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={pullToRefresh} />}
          data={dataSource}
          renderItem={renderItem}
          getItemType={getItemType}
          estimatedItemSize={60}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.container}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
        />
      </FadingElement>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  networkFilterContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    marginTop: 14,
  },
});

GlobalActivityScreen.navigationOptions = navigationStyle({ title: loc.globalActivity.title, headerTransparent: true });
