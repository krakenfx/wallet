import { useHeaderHeight } from '@react-navigation/elements';

import { keyBy, sortBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import type { TokenType } from '@/api/types';
import type { BottomSheetRef } from '@/components/BottomSheet';
import { BottomSheet, BottomSheetFlashList } from '@/components/BottomSheet';
import { FadingElement } from '@/components/FadingElement';
import { KeyboardAvoider } from '@/components/Keyboard';
import { NetworkFilter, useNetworkFilter } from '@/components/NetworkFilter';
import { getNetworkFilterFromCaip } from '@/components/NetworkFilter/getNetworkFilterFromCaip';
import { SearchInput } from '@/components/SearchInput';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { useTokenSearchQuery } from '@/hooks/useTokenSearchQuery';
import type { WalletType } from '@/onChain/wallets/registry';
import { networkIdToNetworkName } from '@/onChain/wallets/registry';
import { useSwapTargetListQuery } from '@/reactQuery/hooks/useSwapTargetListQuery';
import { getNetworkNameFromAssetId, sortTokensAlphabetically, useTokens } from '@/realm/tokens';
import type { RealmWallet } from '@/realm/wallets';
import { useRealmWallets } from '@/realm/wallets';
import { runAfterUISync } from '@/utils/runAfterUISync';
import { safelyAnimateLayout } from '@/utils/safeLayoutAnimation';

import { tokenItemKeyExtractor } from '@/utils/tokenItemKeyExtractor';

import { SWAP_LIST_CACHE_DURATION, SWAP_NETWORK_UI_FILTER, TARGET_ASSET_SHEET_OFFSET } from '../../SwapScreen.constants';

import { adaptTokenTypeToRemoteAsset } from '../../utils/adaptTokenTypeToRemoteAsset';
import { EmptyState } from '../EmptyStateContainer';
import { TargetAssetListItem } from '../TargetAssetListItem';

import type { SwapTargetAsset } from '../../types';
import type { ListRenderItem } from '@shopify/flash-list';

import loc from '/loc';

type Props = {
  currentAsset?: SwapTargetAsset;
  sourceAssetWallet: RealmWallet;
  onAssetSelected: (token: SwapTargetAsset) => void;
  onSearchInputFocused: () => void;
  goBack: () => void;
  onClose: () => void;
};

const renderItemSeparator = () => <View style={styles.divider} />;

export const TargetAssetList = React.forwardRef<BottomSheetRef, Props>(
  ({ goBack, onAssetSelected, currentAsset, sourceAssetWallet, onSearchInputFocused, onClose }, ref) => {
    const walletMap = keyBy(Array.from(useRealmWallets()), 'type');
    const userTokenMap = keyBy(Array.from(useTokens()), 'assetId');

    const currentAssetNetwork = currentAsset ? getNetworkNameFromAssetId(currentAsset.assetId) : undefined;
    const currentAssetWallet = currentAssetNetwork ? walletMap[currentAssetNetwork] : undefined;

    const latestFilter = useMemo(
      () => [getNetworkFilterFromCaip(currentAssetWallet?.caipId ?? sourceAssetWallet.caipId)],
      [currentAssetWallet?.caipId, sourceAssetWallet.caipId],
    );

    const [networkFilter, setNetworkFilter] = useNetworkFilter(latestFilter);

    const [inputValue, setInputValue] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>(inputValue);

    useEffect(() => {
      setNetworkFilter(latestFilter);
    }, [latestFilter, setNetworkFilter]);

    const { data: swapListData, isLoading } = useSwapTargetListQuery(sourceAssetWallet.caipId, !searchQuery, SWAP_LIST_CACHE_DURATION);

    const assets = useMemo(() => {
      if (!swapListData) {
        return [];
      }
      const filteredData: SwapTargetAsset[] = [];

      Object.entries(swapListData.toTokens).forEach(([networkCaip, dict]) => {
        const walletType: WalletType | undefined = networkIdToNetworkName[networkCaip];

        if (!walletType) {
          return;
        }

        if (networkFilter.length === 0 || networkFilter.includes(getNetworkFilterFromCaip(networkCaip))) {
          const networkAssets = Object.entries(dict).map(([assetId, tokenData]) => {
            if (userTokenMap[assetId]) {
              return userTokenMap[assetId];
            }
            return adaptTokenTypeToRemoteAsset(assetId, tokenData as TokenType, 'bungee');
          });
          filteredData.push(...networkAssets);
        }
      });
      return sortBy(filteredData, sortTokensAlphabetically.lodash);
    }, [networkFilter, swapListData, userTokenMap]);

    const data = useTokenSearchQuery(assets, searchQuery);

    const renderItem: ListRenderItem<SwapTargetAsset> = useCallback(
      ({ item }) => (
        <TargetAssetListItem wallets={walletMap} token={item} onSelected={onAssetSelected} selected={currentAsset && item.assetId === currentAsset.assetId} />
      ),
      [currentAsset, onAssetSelected, walletMap],
    );

    useEffect(() => {
      runAfterUISync(safelyAnimateLayout);
    }, [data.length]);

    const onChangeText = useCallback((text: string) => {
      setInputValue(text);
    }, []);

    useDebounceEffect(
      () => {
        setSearchQuery(inputValue);
      },
      [inputValue],
      250,
    );

    const headerHeight = useHeaderHeight();

    const { height, width } = useSafeAreaFrame();

    const snapPoints = useMemo(() => [height - headerHeight - TARGET_ASSET_SHEET_OFFSET, height - headerHeight], [height, headerHeight]);

    const placeholderCount = useMemo(() => (snapPoints[0] - 240) / 60, [snapPoints]);

    const clearSearch = () => setInputValue('');

    const estimatedListSize = useMemo(() => (!data.length ? undefined : { width, height: snapPoints[1] }), [width, snapPoints, data.length]);

    const renderEmptyContent = useCallback(
      () => (
        <EmptyState
          variant="targetAssetList"
          isLoading={isLoading}
          isSearchResult={!!searchQuery}
          placeholderCount={placeholderCount}
          clearSearch={clearSearch}
          goBack={goBack}
        />
      ),
      [goBack, isLoading, placeholderCount, searchQuery],
    );

    return (
      <BottomSheet
        index={-1}
        ref={ref}
        snapPoints={snapPoints}
        topInset={headerHeight}
        onChange={index => {
          if (index === -1) {
            onClose();
          }
        }}>
        <Animated.View style={styles.header}>
          <SearchInput onFocus={onSearchInputFocused} value={inputValue} placeholder={loc.swap.targetSearchPlaceholder} onChangeText={onChangeText} />
        </Animated.View>
        <View style={styles.networkFilter}>
          <NetworkFilter networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} dataToFilter={SWAP_NETWORK_UI_FILTER} />
        </View>
        <KeyboardAvoider style={styles.keyboardAvoider}>
          <FadingElement>
            <BottomSheetFlashList
              ListEmptyComponent={renderEmptyContent}
              testID="TargetSwapAssetList"
              data={data}
              estimatedListSize={estimatedListSize}
              estimatedItemSize={60}
              renderItem={renderItem}
              keyExtractor={tokenItemKeyExtractor}
              ItemSeparatorComponent={renderItemSeparator}
              contentContainerStyle={styles.list}
              keyboardShouldPersistTaps="handled"
            />
          </FadingElement>
        </KeyboardAvoider>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
  networkFilter: {
    height: 40,
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  keyboardAvoider: {
    flex: 1,
  },
  divider: {
    height: 6,
  },
  placeholderContainer: {
    gap: 20,
    paddingHorizontal: 8,
  },
});
