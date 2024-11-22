import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { REPUTATION, useReputationLists } from '@/hooks/useReputation';
import { sortWithKrakenFirst } from '@/utils/sortWithKrakenFirst';

import { DEFAULT_TOKEN_LISTS } from '../const';

import { TokenListsRow } from './TokenListsRow';
import { useTokenListsCount } from './useTokenListsCount';

import type { TokenListNames } from '../types';

type TokenListsListProps = {
  assetId: string;
};

const keyExtractor = (item: { reputation: REPUTATION; tokenListName: string }, index: number) => item.reputation + item.tokenListName + index;

export const TokenListsList = ({ assetId }: TokenListsListProps) => {
  const reputationLists = useReputationLists(assetId);
  const tokenListsCount = useTokenListsCount();

  const isBlacklisted = reputationLists.blacklists.length > 0;
  const isWhitelisted = reputationLists.whitelists.length > 0;
  const isUnverified = !isBlacklisted && !isWhitelisted;

  const blacklistSet: TokenListNames[] = isBlacklisted ? ['Blacklisted'] : [];
  const whitelistSet = sortWithKrakenFirst(reputationLists.whitelists);
  const unverfiedSet = isUnverified
    ? sortWithKrakenFirst(DEFAULT_TOKEN_LISTS)
    : sortWithKrakenFirst(
        DEFAULT_TOKEN_LISTS.filter(list => !whitelistSet.includes(list)),
        !isWhitelisted,
      );

  const renderItem = useCallback(
    ({ item }: { item: { reputation: REPUTATION; tokenListName: string } }) => {
      return <TokenListsRow tokenListName={item.tokenListName} tokenListCount={tokenListsCount[item.tokenListName] ?? ''} reputation={item.reputation} />;
    },
    [tokenListsCount],
  );

  return (
    <BottomSheetFlatList
      data={[
        ...blacklistSet.map(tokenListName => ({ reputation: REPUTATION.BLACKLISTED, tokenListName })),
        ...whitelistSet.map(tokenListName => ({ reputation: REPUTATION.WHITELISTED, tokenListName })),
        ...unverfiedSet.map(tokenListName => ({ reputation: REPUTATION.UNVERIFIED, tokenListName })),
      ]}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: 8,
    paddingHorizontal: 24,
  },
});
