import { BottomSheetFlashList } from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';

import { compact, groupBy, keyBy, sortBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import type { BottomSheetRef } from '@/components/BottomSheet';
import { BottomSheet } from '@/components/BottomSheet';
import { FadingElement } from '@/components/FadingElement';
import { KeyboardAvoider } from '@/components/Keyboard';
import { Label } from '@/components/Label';
import { NetworkFilter, useNetworkFilter } from '@/components/NetworkFilter';
import { getNetworkFilterFromCaip } from '@/components/NetworkFilter/getNetworkFilterFromCaip';
import { SearchInput } from '@/components/SearchInput';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { REPUTATION, getReputation } from '@/hooks/useReputation';
import { useTokenSearchQuery } from '@/hooks/useTokenSearchQuery';
import { isNetworkCoin } from '@/onChain/wallets/registry';
import { useSwapTargetListQuery } from '@/reactQuery/hooks/useSwapTargetListQuery';
import { useTokenListReputationLookupQuery } from '@/reactQuery/hooks/useTokenListsQuery';
import { useTokenPrices } from '@/realm/tokenPrice';
import {
  type RealmToken,
  getNetworkNameFromAssetId,
  sortTokensAlphabetically,
  sortTokensByFiatValue,
  useTokensFilteredByReputationAndNetwork,
} from '@/realm/tokens';
import { useRealmWallets } from '@/realm/wallets';
import { SEARCH_SCORE_TO_SORTING_INDEX } from '@/screens/CoinsList/utils/getSearchScore';
import { runAfterUISync } from '@/utils/runAfterUISync';
import { safelyAnimateLayout } from '@/utils/safeLayoutAnimation';

import { tokenItemKeyExtractor } from '@/utils/tokenItemKeyExtractor';

import { SWAP_LIST_CACHE_DURATION, SWAP_NETWORK_UI_FILTER, TARGET_ASSET_SHEET_OFFSET } from '../../SwapScreen.constants';

import { adaptTokenTypeToRemoteAsset } from '../../utils/adaptTokenTypeToRemoteAsset';
import { getTokenTypeDict } from '../../utils/getTokenTypeDict';
import { EmptyState } from '../EmptyStateContainer';
import { TargetAssetListItem } from '../TargetAssetListItem';

import type { SwapTargetAsset } from '../../types';
import type { ListRenderItem } from '@shopify/flash-list';

import loc from '/loc';

type ListItem = SwapTargetAsset | string;

type Props = {
  currentAsset?: SwapTargetAsset;
  sourceAsset: RealmToken;
  onAssetSelected: (token: SwapTargetAsset) => void;
  onSearchInputFocused: () => void;
  goBack: () => void;
  onClose: () => void;
};

const renderItemSeparator = () => <View style={styles.divider} />;

const getItemType = (item: ListItem) => (typeof item === 'string' ? 'label' : 'asset');

const MAX_SEARCH_SCORE = Object.values(SEARCH_SCORE_TO_SORTING_INDEX)[0];

export const TargetAssetList = React.forwardRef<BottomSheetRef, Props>(
  ({ goBack, onAssetSelected, currentAsset, sourceAsset, onSearchInputFocused, onClose }, ref) => {
    const walletMap = keyBy(Array.from(useRealmWallets()), 'type');
    const tokenPrices = useTokenPrices();
    const sourceAssetWallet = sourceAsset.wallet;
    const currentAssetNetwork = currentAsset ? getNetworkNameFromAssetId(currentAsset.assetId) : undefined;
    const currentAssetWallet = currentAssetNetwork ? walletMap[currentAssetNetwork] : undefined;

    const latestFilter = useMemo(
      () => [getNetworkFilterFromCaip(currentAssetWallet?.caipId ?? sourceAssetWallet.caipId)],
      [currentAssetWallet?.caipId, sourceAssetWallet.caipId],
    );

    const [networkFilter, setNetworkFilter] = useNetworkFilter(latestFilter);

    const [inputValue, setInputValue] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>(inputValue);

    const allOwnedTokensWithBalance = useTokensFilteredByReputationAndNetwork([], true).filtered(`balance != '0' AND assetId != $0`, sourceAsset.assetId);

    const hasSearchQuery = !!searchQuery;

    const ownedTokensWithBalance = useMemo(() => {
      if (hasSearchQuery) {
        return allOwnedTokensWithBalance;
      }
      return allOwnedTokensWithBalance.filtered('assetId == $0 OR inGallery == "autoAdded" OR inGallery == "manuallyAdded"', currentAsset?.assetId);
    }, [allOwnedTokensWithBalance, currentAsset?.assetId, hasSearchQuery]);

    const { data: tokenReputationLookup } = useTokenListReputationLookupQuery();

    const { data: swapListData, isLoading } = useSwapTargetListQuery(sourceAssetWallet.caipId, !searchQuery, SWAP_LIST_CACHE_DURATION);

    const tokenTypeDict = useMemo(() => {
      if (isLoading || !swapListData) {
        return;
      }
      return getTokenTypeDict(swapListData, networkFilter);
    }, [isLoading, networkFilter, swapListData]);

    const providerCompatibleTokens = useMemo(() => {
      if (isLoading || !tokenTypeDict) {
        return [];
      }
      const remoteTokenIds = Object.keys(tokenTypeDict);
      return sortTokensByFiatValue(ownedTokensWithBalance.filtered('assetId IN $0', remoteTokenIds), tokenPrices);
    }, [isLoading, tokenTypeDict, ownedTokensWithBalance, tokenPrices]);

    useEffect(() => {
      setNetworkFilter(latestFilter);
    }, [latestFilter, setNetworkFilter]);

    const transformSearchScore = useCallback((token: SwapTargetAsset, score: number) => {
      if (!isNetworkCoin(token.assetId) && getReputation(token.metadata.reputation) !== REPUTATION.WHITELISTED) {
        return score / MAX_SEARCH_SCORE;
      }
      return score;
    }, []);

    const assets: ListItem[] = useMemo(() => {
      if (isLoading || !tokenTypeDict || !tokenReputationLookup) {
        return [];
      }
      const ownedTokensSet = new Set(ownedTokensWithBalance.map(t => t.assetId).concat(sourceAsset.assetId));

      const remoteTokens = Object.entries(tokenTypeDict)
        .filter(([assetId]) => !ownedTokensSet.has(assetId))
        .map(([assetId, tokenData]) => adaptTokenTypeToRemoteAsset(assetId, tokenData, tokenReputationLookup[assetId]));

      const groups = groupBy(sortBy(remoteTokens, sortTokensAlphabetically.lodash), token => getReputation(token.metadata.reputation));

      const whitelisted = groups[REPUTATION.WHITELISTED] ?? [];
      const unverified = groups[REPUTATION.UNVERIFIED] ?? [];

      return compact([
        providerCompatibleTokens.length ? loc.swap.yourAssets : undefined,
        ...providerCompatibleTokens,
        whitelisted.length || unverified.length ? loc.swap.otherAssets : undefined,
        ...whitelisted,
        ...unverified,
      ]);
    }, [isLoading, ownedTokensWithBalance, providerCompatibleTokens, sourceAsset.assetId, tokenReputationLookup, tokenTypeDict]);

    const data = useTokenSearchQuery(assets, searchQuery, transformSearchScore);

    const renderItem: ListRenderItem<ListItem> = useCallback(
      ({ item }) =>
        typeof item === 'string' ? (
          <Label color="light50" style={styles.listHeader}>
            {item}
          </Label>
        ) : (
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
              getItemType={getItemType}
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
  listHeader: {
    marginBottom: 8,
    marginHorizontal: 8,
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
