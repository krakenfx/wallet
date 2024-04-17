import React, { useCallback, useMemo } from 'react';

import { RefreshControl } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';
import { NetworkFilter, useNetworkFilter } from '@/components/NetworkFilter';
import { ViewPager } from '@/components/ViewPager';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';

import { useNfts } from '@/realm/nfts';

import { NftCollectionList } from './components/NftCollectionList';
import { NftList } from './components/NftList';
import { useRefreshNfts } from './hooks/useRefreshNfts';

import loc from '/loc';

export const NftsScreen = () => {
  const [networkFilter, setNetworkFilter] = useNetworkFilter();
  const nfts = useNfts(false, networkFilter);

  const { refreshNfts, isRefreshing } = useRefreshNfts();

  const onRefresh = useCallback(() => {
    refreshNfts(true);
  }, [refreshNfts]);

  useHeaderTitle(loc.nftList.title);

  const networkFilterComponent = useMemo(
    () => <NetworkFilter networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} />,
    [networkFilter, setNetworkFilter],
  );

  const refreshControl = useMemo(() => <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />, [isRefreshing, onRefresh]);

  const left = useMemo(
    () => ({
      label: loc.nftList.everything,
      testID: 'NftsToggleEverything',
      component: <NftList data={nfts} networkFilter={networkFilter} refreshControl={refreshControl} />,
    }),
    [networkFilter, nfts, refreshControl],
  );

  const right = useMemo(
    () => ({
      label: loc.nftList.collections,
      testID: 'NftsToggleCollections',
      component: <NftCollectionList networkFilter={networkFilter} refreshControl={refreshControl} />,
    }),
    [networkFilter, refreshControl],
  );

  return (
    <GradientScreenView>
      <ViewPager left={left} right={right} toggleTestID="NftToggle" secondaryComponent={networkFilterComponent} />
    </GradientScreenView>
  );
};

NftsScreen.navigationOptions = navigationStyle({ title: loc.nftList.title, headerTransparent: true });
