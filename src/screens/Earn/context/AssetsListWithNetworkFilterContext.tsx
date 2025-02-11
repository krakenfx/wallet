import React, { type PropsWithChildren, useEffect, useState } from 'react';

import { useContext } from 'react';

import { useNetworkFilter } from '@/components/NetworkFilter';

import { useFilteredDepositOptionsByAssetQuery } from '@/reactQuery/hooks/earn/useDepositOptionsQuery';

import type { DefiAssetsListItem } from '../components/DefiFlatList/DefiFlatList.types';

interface AssetsListWithNetworkFilterContextValue {
  networkFilter: ReturnType<typeof useNetworkFilter>[0];
  setNetworkFilter: ReturnType<typeof useNetworkFilter>[1];
  showLoadingStateOnHeader: boolean;
  isLoading: boolean;
  error: Error | null;
  data: DefiAssetsListItem[];
}

const AssetsListWithNetworkFilterContext = React.createContext<AssetsListWithNetworkFilterContextValue | undefined>(undefined);

export const AssetsListWithNetworkFilterContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [networkFilter, setNetworkFilter] = useNetworkFilter();
  const { isLoading, isPending, error, data } = useFilteredDepositOptionsByAssetQuery(networkFilter.map(caipdId => caipdId.replace('/', '')));
  const [showLoadingStateOnHeader, setShowLoadingStateOnHeader] = useState(true);

  useEffect(() => {
    if (!isLoading && !isPending && showLoadingStateOnHeader) {
      setShowLoadingStateOnHeader(false);
    }
  }, [isLoading, isPending, showLoadingStateOnHeader, setShowLoadingStateOnHeader]);

  return (
    <AssetsListWithNetworkFilterContext.Provider
      value={{
        isLoading,
        showLoadingStateOnHeader,
        networkFilter,
        setNetworkFilter,
        error,
        data: data || [],
      }}>
      {children}
    </AssetsListWithNetworkFilterContext.Provider>
  );
};

export const useAssetsListWithNetworkFilterContext = (): AssetsListWithNetworkFilterContextValue => {
  const context = useContext(AssetsListWithNetworkFilterContext);

  if (!context) {
    throw new Error('AssetsListWithNetworkFilterContext not initialized');
  }

  return context;
};
