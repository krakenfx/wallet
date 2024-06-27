import React from 'react';

import { StyleSheet } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { REPUTATION, useReputationLists } from '@/hooks/useReputation';

import { TokenListsRow } from '@/screens/TokenLists/components/TokenListsRow';
import { useTokenListsCount } from '@/screens/TokenLists/components/useTokenListsCount';
import { sortWithKrakenFirst } from '@/utils/sortWithKrakenFirst';

import { ReputationAccordion } from './ReputationAccordion';
import { WhitelistIcons } from './WhitelistIcons';

import loc from '/loc';

interface Props {
  assetId: string;
}

export const WhitelistReputationAccordion = ({ assetId }: Props) => {
  const reputationLists = useReputationLists(assetId);

  const whitelistSet = sortWithKrakenFirst(reputationLists.whitelists);
  const tokenListsCount = useTokenListsCount();

  return (
    <ReputationAccordion
      key={assetId}
      leftIcon={<SvgIcon name="verified" color="kraken" size={16} bgColor="light100" />}
      leftLabelColor="light75"
      infoLabel={loc.formatString(loc.reputation.onTokenLists, { count: reputationLists.whitelists.length })}
      rightLabelElementClosed={<WhitelistIcons whitelists={reputationLists.whitelists} iconSize={23} maxIconCount={5} />}
      rightLabelElementOpened={loc.marketData.showLess}>
      {whitelistSet.map(item => (
        <TokenListsRow
          key={item}
          style={styles.item}
          showOnlyWhiteListed
          tokenListName={item}
          tokenListCount={tokenListsCount[item] ?? ''}
          reputation={REPUTATION.WHITELISTED}
        />
      ))}
    </ReputationAccordion>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
  },
});
