import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet, BottomSheetFlashList } from '@/components/BottomSheet';
import { FadingElement } from '@/components/FadingElement';
import { KeyboardAvoider } from '@/components/Keyboard';
import navigationStyle from '@/components/navigationStyle';
import { NetworkFilter, useNetworkFilter } from '@/components/NetworkFilter';
import { ReputationTag } from '@/components/Reputation';
import { SearchInput } from '@/components/SearchInput';
import { omitNetworkIcons } from '@/components/TokenIcon';
import { TokenSwitch } from '@/components/TokenSwitch';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { REPUTATION } from '@/hooks/useReputation';
import { useTokenPrices } from '@/realm/tokenPrice';
import {
  RealmToken,
  getNetworkNameFromAssetId,
  sortTokensAlphabetically,
  sortTokensByFiatValue,
  useTokensFilteredByReputationAndNetwork,
} from '@/realm/tokens';
import { useTokensGallery } from '@/realm/tokensGallery';
import { useRealmWallets } from '@/realm/wallets';
import { NavigationProps } from '@/Routes';
import { isRealmObject } from '@/utils/isRealmObject';
import { runAfterUISync } from '@/utils/runAfterUISync';
import { safelyAnimateLayout } from '@/utils/safeLayoutAnimation';

import { GlobalFilter } from './GlobalFilter';
import { useFilteredTokensFromTokenLists } from './hooks/useFilteredTokensFromTokenLists';
import { ReputationFilter } from './ReputationFilter';
import { Item, RemoteAsset } from './types';
import { SEARCH_SCORE_TO_SORTING_INDEX, getSearchScore } from './utils/getSearchScore';
import { isRemoteAsset } from './utils/isRemoteAsset';

import loc from '/loc';

const isInvalid = (item: Item) => {
  return !item || (isRealmObject(item) && !item.isValid());
};
const renderItemSeparator = () => <View style={styles.divider} />;
const itemKeyExtractor = (item: Item, i: number) => {
  if (isInvalid(item)) {
    return 'invalid_' + i;
  }

  return item.assetId;
};

const getItemType = (item: Item): string => {
  if (isInvalid(item)) {
    return 'invalid';
  }
  return omitNetworkIcons[item.assetId] ? 'no_icon' : 'with_icon';
};

const INITIAL_TO_RENDER = 10;

export const CoinsListScreen = ({ navigation }: NavigationProps<'CoinsList'>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [networkFilter, setNetworkFilter] = useNetworkFilter();
  const wallets = keyBy(Array.from(useRealmWallets()), 'type');
  const tokenPrices = useTokenPrices();
  const tokensGallery = useTokensGallery();

  const tokensFromRealm = useTokensFilteredByReputationAndNetwork(networkFilter);
  const { withBalance, withoutBalance } = useMemo(() => {
    return {
      withBalance: tokensFromRealm.filtered('balance != $0', '0').sorted(sortTokensAlphabetically.realm),
      withoutBalance: tokensFromRealm.filtered('balance == $0', '0'),
    };
  }, [tokensFromRealm]);
  const tokensFromTokenLists = useFilteredTokensFromTokenLists(networkFilter, searchQuery);
  const tokenGalleryAndNativeTokens: RealmToken[] = useMemo(() => {
    return sortTokensByFiatValue(tokensFromRealm.filtered('balance != $0 || inGallery == true || assetId = wallet.nativeTokenCaipId', '0'), tokenPrices);
  }, [tokensFromRealm, tokenPrices]);

  const tokens: Item[] = useMemo(() => {
    if (searchQuery) {
      const searchKey = searchQuery.charAt(0).toLowerCase();

      const tokensFromTokenListsPreFiltered = [...(tokensFromTokenLists[searchKey] || [])];

      return withBalance.concat(sortBy(tokensFromTokenListsPreFiltered.concat([...withoutBalance] as []), sortTokensAlphabetically.lodash) as []);
    } else {
      return tokenGalleryAndNativeTokens;
    }
  }, [tokensFromTokenLists, withBalance, withoutBalance, tokenGalleryAndNativeTokens, searchQuery]);

  const data = useMemo(() => {
    if (searchQuery) {
      const searchQuery_ = searchQuery.toLowerCase();

      const tokensGroupedBySearchScore = {
        withBalance: Object.keys(SEARCH_SCORE_TO_SORTING_INDEX).map(() => [] as Item[]),
        withoutBalance: Object.keys(SEARCH_SCORE_TO_SORTING_INDEX).map(() => [] as Item[]),
      };

      tokens.forEach(t => {
        const score = getSearchScore(searchQuery_, t);

        if (score in SEARCH_SCORE_TO_SORTING_INDEX) {
          if (t.balance === '0') {
            tokensGroupedBySearchScore.withoutBalance[SEARCH_SCORE_TO_SORTING_INDEX[score]].push(t);
          } else {
            tokensGroupedBySearchScore.withBalance[SEARCH_SCORE_TO_SORTING_INDEX[score]].push(t);
          }
        }
      });

      return tokensGroupedBySearchScore.withBalance.flat().concat(tokensGroupedBySearchScore.withoutBalance.flat());
    } else {
      return tokens;
    }
  }, [searchQuery, tokens]);

  const renderTokenRow = useCallback(
    (token: RealmToken) => {
      if (isInvalid(token)) {
        return null;
      }

      const options = {
        hideZeroAmount: true,
        showAmountInFiat: false,
        symbolUnderLabel: true,
        tag: <ReputationTag assetId={token.assetId} filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }} />,
        walletId: token.walletId,
      };

      return <TokenSwitch token={token} tokensGalleryLength={tokensGallery.length} options={options} />;
    },
    [tokensGallery.length],
  );

  const renderRemoteAssetRow = useCallback(
    (remoteAsset: RemoteAsset) => {
      const networkName = getNetworkNameFromAssetId(remoteAsset.assetId);
      const wallet = wallets[networkName];
      const options = {
        hideZeroAmount: true,
        isRemoteAsset: true,
        networkName,
        showAmountInFiat: false,
        symbolUnderLabel: true,
        wallet,
      };

      return <TokenSwitch token={remoteAsset} tokensGalleryLength={tokensGallery.length} options={options} />;
    },
    [wallets, tokensGallery.length],
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      if (isRemoteAsset(item)) {
        return renderRemoteAssetRow(item);
      } else {
        return renderTokenRow(item);
      }
    },
    [renderRemoteAssetRow, renderTokenRow],
  );

  const [canRenderAll, setCanRenderAll] = useState(false);

  useEffect(() => {
    runAfterUISync(safelyAnimateLayout);
  }, [data]);

  useEffect(() => {
    safelyAnimateLayout();
  }, [canRenderAll]);

  const onChangeText = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  useDebounceEffect(
    () => {
      setSearchQuery(inputValue);
    },
    [inputValue],
    200,
  );

  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);

  const insets = useSafeAreaInsets();

  const dimensions = useWindowDimensions();

  const onBottomSheetChange = (index: number) => index === 0 && setCanRenderAll(true);

  const estimatedListSize = useMemo(() => ({ width: dimensions.width, height: dimensions.height - 200 }), [dimensions]);

  return (
    <BottomSheet snapPoints={['100%']} onChange={onBottomSheetChange} {...bottomSheetProps}>
      <View style={styles.headerRow}>
        <SearchInput placeholder={loc.coins.search_placeholder} onChangeText={onChangeText} testID="TokenSearchInput" value={inputValue} />
        <GlobalFilter>
          <ReputationFilter />
        </GlobalFilter>
      </View>
      <NetworkFilter networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} />
      <KeyboardAvoider style={styles.keyboardAvoider}>
        <FadingElement>
          <BottomSheetFlashList
            testID="CoinsListFlatList"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            automaticallyAdjustContentInsets
            data={canRenderAll ? data : data.slice(0, INITIAL_TO_RENDER)}
            renderItem={renderItem}
            keyExtractor={itemKeyExtractor}
            ItemSeparatorComponent={renderItemSeparator}
            estimatedItemSize={60}
            estimatedListSize={estimatedListSize}
            getItemType={getItemType}
            contentContainerStyle={StyleSheet.flatten([styles.container, { paddingBottom: insets.bottom }])}
          />
        </FadingElement>
      </KeyboardAvoider>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  keyboardAvoider: {
    flex: 1,
  },
  divider: {
    height: 6,
  },
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 24,
    marginTop: 24,
  },
});

CoinsListScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
