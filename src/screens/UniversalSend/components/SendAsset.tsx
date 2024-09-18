import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadingElement } from '@/components/FadingElement';
import { KeyboardAvoider } from '@/components/Keyboard';
import { Label } from '@/components/Label';
import { SearchInput } from '@/components/SearchInput';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { Network } from '@/onChain/wallets/base';
import { useTokenPrices } from '@/realm/tokenPrice';
import { RealmToken, sortTokensByFiatValue, useTokensFilteredByReputationAndNetwork } from '@/realm/tokens';
import { runAfterUISync } from '@/utils/runAfterUISync';
import { safelyAnimateLayout } from '@/utils/safeLayoutAnimation';

import { EmptyState } from './EmptyState';
import { SendAssetItem } from './SendAssetItem';

import loc from '/loc';

type Props = {
  supportedNetworks: Network[];
  onAssetSelected: (token: RealmToken) => void;
  goBack: () => void;
};

const renderItemSeparator = () => <View style={styles.divider} />;

const itemKeyExtractor = (item: RealmToken, i: number) => {
  if (!item.isValid()) {
    return 'invalid_' + i;
  }

  return item.assetId;
};

export const SendAsset = ({ supportedNetworks, onAssetSelected, goBack }: Props) => {
  const tokenPrices = useTokenPrices();

  const tokens = useTokensFilteredByReputationAndNetwork([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(inputValue);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

  useEffect(() => {
    setHasRenderedOnce(true);
  }, []);

  const compatibleTokens = useMemo(() => {
    const nativeTokenIds = supportedNetworks.map(n => n.nativeTokenCaipId);
    return sortTokensByFiatValue(tokens.filtered("wallet.nativeTokenCaipId IN $0 AND balance != '0'", nativeTokenIds), tokenPrices);
  }, [supportedNetworks, tokenPrices, tokens]);

  const data = useMemo(() => {
    if (searchQuery) {
      const searchQuery_ = searchQuery.toLowerCase();
      const filteredTokens = compatibleTokens.filter(coin => {
        const testString = (coin.metadata.label + ' ' + coin.metadata.symbol).toLowerCase();

        
        return testString.startsWith(searchQuery_) || testString.includes(` ${searchQuery_}`);
      });

      return filteredTokens;
    }
    return compatibleTokens;
  }, [compatibleTokens, searchQuery]);

  const renderItem: ListRenderItem<RealmToken> = ({ item, index }) => (
    <SendAssetItem token={item} onSelected={onAssetSelected} index={index} shouldAnimateIn={!hasRenderedOnce} />
  );

  const insets = useSafeAreaInsets();

  useEffect(() => {
    runAfterUISync(safelyAnimateLayout);
  }, [data]);

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

  const hasSearchValue = !!searchQuery;

  const clearSearch = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
  }, []);

  const renderEmpty = useCallback(
    () => <EmptyState hasSearchValue={hasSearchValue} supportedNetworks={supportedNetworks} goBack={goBack} clearSearch={clearSearch} />,
    [clearSearch, goBack, hasSearchValue, supportedNetworks],
  );

  return (
    <>
      <Animated.View style={styles.header} entering={data.length ? FadeInDown : undefined}>
        <Label type="boldDisplay4" style={styles.listHeader}>
          {loc.universalSend.sendAsset}
        </Label>
        {(!!searchQuery || !!data.length) && <SearchInput value={inputValue} placeholder={loc.universalSend.searchPlaceholder} onChangeText={onChangeText} />}
      </Animated.View>
      <KeyboardAvoider style={styles.keyboardAvoider}>
        <FadingElement>
          <BottomSheetFlatList
            testID="SendAssetList"
            style={styles.scrollView}
            data={data}
            renderItem={renderItem}
            keyExtractor={itemKeyExtractor}
            ItemSeparatorComponent={renderItemSeparator}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            automaticallyAdjustContentInsets
            contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom }]}
            ListEmptyComponent={renderEmpty}
          />
        </FadingElement>
      </KeyboardAvoider>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
  scrollView: {
    paddingHorizontal: 24,
  },
  scrollContainer: {
    paddingTop: 4,
    flexGrow: 1,
  },
  keyboardAvoider: {
    flex: 1,
  },
  listHeader: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  divider: {
    height: 6,
  },
});
