import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { useKrakenAssetsWithPrices } from '@/reactQuery/hooks/krakenConnect/useKrakenAssetsWithPrices';
import { navigationStyle } from '@/utils/navigationStyle';

import { AssetsToTransfer } from './components/AssetsToTransfer';
import { ExchangeBalance } from './components/ExchangeBalance';
import { KrakenConnectEmptyState } from './components/KrakenConnectEmptyState';
import { NotSupportedAssets } from './components/NotSupportedAssets';

import loc from '/loc';

export const KrakenConnectTransferScreen = () => {
  const { data, refetchPrices, refetchKrakenBalance, isLoading, isFetched } = useKrakenAssetsWithPrices();

  const refreshAll = useCallback(() => {
    refetchKrakenBalance();
    refetchPrices();
  }, [refetchKrakenBalance, refetchPrices]);

  useFocusEffect(
    useCallback(() => {
      refreshAll();
    }, [refreshAll]),
  );

  const supportedAssets = useMemo(() => {
    if (data) {
      return data.filter(asset => asset.isSupported);
    }
    return [];
  }, [data]);

  const noData = !isLoading && isEmpty(data) && isFetched;

  return (
    <GradientScreenView>
      <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={false} onRefresh={refreshAll} />}>
        <ExchangeBalance />
        {!noData ? (
          <>
            <AssetsToTransfer isLoading={isLoading || !isFetched} supportedAssets={supportedAssets} />
            {!isLoading && data && <NotSupportedAssets assets={data.filter(asset => !asset.isSupported)} />}
          </>
        ) : (
          <KrakenConnectEmptyState />
        )}
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    flex: 1,
  },
});

KrakenConnectTransferScreen.navigationOptions = navigationStyle({ title: loc.krakenConnect.transfer.title, headerTransparent: true });
