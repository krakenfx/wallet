import React from 'react';

import { EmptySearchResult } from '../EmptySearchResult';
import { EmptyStateAssetList } from '../EmptyStateAssetList';
import { ListLoadingState } from '../ListLoadingState';

type Props = {
  variant: 'sourceAssetList' | 'targetAssetList';
  isLoading?: boolean;
  placeholderCount: number;
  isSearchResult?: boolean;
  hasUnsupportedAssets?: boolean;
  hasNetworkFilter?: boolean;
  clearSearch: () => void;
  goBack: () => void;
  clearNetworkFilter?: () => void;
};

export const EmptyState = ({
  variant,
  isLoading,
  placeholderCount,
  hasUnsupportedAssets,
  hasNetworkFilter,
  isSearchResult,
  clearSearch,
  goBack,
  clearNetworkFilter,
}: Props) => {
  switch (true) {
    case isLoading:
      return <ListLoadingState placeholderCount={placeholderCount} />;
    case isSearchResult:
      return <EmptySearchResult clearSearch={clearSearch} />;
    default:
      return (
        <EmptyStateAssetList
          hasUnsupportedAssets={hasUnsupportedAssets}
          goBack={goBack}
          variant={variant}
          hasNetworkFilter={hasNetworkFilter}
          clearNetworkFilter={clearNetworkFilter}
        />
      );
  }
};
