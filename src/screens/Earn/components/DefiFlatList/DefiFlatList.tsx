import { Fragment, useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';

import { useAssetsListWithNetworkFilterContext } from '../../context/AssetsListWithNetworkFilterContext';
import { useEarnErrorsContext, useHandleAssetsListError } from '../../context/EarnErrorsContext';
import { Sizes } from '../../EarnScreen.constants';

import { useShowStickyHeader } from '../../hooks/useShowStickyHeader';
import { DefiAssetRow } from '../DefiAssetRow/DefiAssetRow';
import { DefiAssetsListHeader } from '../DefiAssetsListHeader/DefiAssetsListHeader';
import { DefiDepositOptionsCarousel } from '../DefiDepositOptionsCarousel/DefiDepositOptionsCarousel';
import { DefiEarnSheet } from '../DefiEarnSheet/DefiEarnSheet';
import { DefiHighlightHero } from '../DefiHighlightHero/DefiHighlightHero';
import { DefiAssetsListError, WholePageErrorScreen } from '../EarnScreenErroStates/EarnScreenErroStates';
import { DefiAssetRowSkeleton } from '../EarnScreenSkeleton/EarnScreenSkeleton';

import { type Data, type DefiAssetsListItem, SectionName } from './DefiFlatList.types';

const BASE_DATA: Data[] = [
  { type: SectionName.HighlightHero, key: 'hero' },
  { type: SectionName.DepositOptionsCarousel, key: 'deposit-options-carousel' },
  { type: SectionName.AssetsListHeader, key: 'assets-list-header' },
];

const SKELETON_DATA = Array.from({ length: 20 }, (_, i) => ({
  type: SectionName.AssetsListItemSkeleton,
  key: `asset-list-item-skeleton-${i}`,
}));

const ASSETS_ERROR_DATA: Data[] = [{ type: SectionName.AssetsListError, key: 'assets-list-error' }];

export const DefiFlatList = () => {
  const paddingBottom = useBottomElementSpacing();

  const { isLoading, data: assetsList, error: assetsListLoadingError } = useAssetsListWithNetworkFilterContext();

  const { shouldRenderErrorPage } = useEarnErrorsContext();

  useHandleAssetsListError(assetsListLoadingError);

  const { showStickyHeader, onViewableItemsChanged } = useShowStickyHeader();

  const [selectedAsset, setSelectedAsset] = useState<DefiAssetsListItem | null>(null);

  const data: Data[] = useMemo(() => {
    if (isLoading) {
      return [...BASE_DATA, ...SKELETON_DATA] as Data[];
    }

    if (assetsListLoadingError) {
      return [...BASE_DATA, ...ASSETS_ERROR_DATA] as Data[];
    }

    const assetsData = assetsList.map(asset => ({
      type: SectionName.AssetsListItem,
      key: asset.assetId,
      asset,
    }));

    return [...BASE_DATA, ...assetsData] as Data[];
  }, [isLoading, assetsList, assetsListLoadingError]);

  const renderItem = useCallback(
    ({ item }: { item: Data }) => {
      switch (item.type) {
        case SectionName.HighlightHero:
          return <DefiHighlightHero />;
        case SectionName.DepositOptionsCarousel:
          return <DefiDepositOptionsCarousel />;
        case SectionName.AssetsListHeader:
          return <DefiAssetsListHeader showStickyHeader={showStickyHeader} />;
        case SectionName.AssetsListItem:
          return <DefiAssetRow asset={item.asset} onSelect={setSelectedAsset} />;
        case SectionName.AssetsListItemSkeleton:
          return <DefiAssetRowSkeleton />;
        case SectionName.AssetsListError:
          return <DefiAssetsListError />;
        default:
          return null;
      }
    },
    [showStickyHeader, setSelectedAsset],
  );

  const onCloseEarnSheet = () => setSelectedAsset(null);

  if (shouldRenderErrorPage) {
    return <WholePageErrorScreen />;
  }

  return (
    <Fragment>
      <FlatList
        data={data}
        nestedScrollEnabled
        contentContainerStyle={[styles.scrollViewContentContainer, { paddingBottom: paddingBottom + Sizes.Space.s7 }]}
        stickyHeaderIndices={[2]}
        keyExtractor={keyExtractor}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={renderItem}
      />

      {selectedAsset && <DefiEarnSheet assetId={selectedAsset.assetId} protocols={selectedAsset.protocols} onCloseEarnSheet={onCloseEarnSheet} />}
    </Fragment>
  );
};

const keyExtractor = (item: Data) => item.key;

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    gap: 16,
  },
});
