import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { REPUTATION, useReputation } from '@/hooks/useReputation';

import { BlackListedReputationAccordion } from './BlackListedReputationAccordion';
import { UnverifiedReputationAccordion } from './UnverifiedReputationAccordion';

import { useShouldFilterOut } from './useShouldFilterOut';
import { WhitelistReputationAccordion } from './WhitelistReputationAccordion';

import type { FilterOut } from './useShouldFilterOut';

import loc from '/loc';

interface Props {
  assetId?: string;
  filterOut?: FilterOut;
}
export const ReputationInfo = ({
  assetId = '',
  filterOut = { reputation: [], coinDesignation: ['network' ] },
}: Props) => {
  const reputation = useReputation(assetId);
  const shouldFilterOut = useShouldFilterOut({ assetId, reputation }, filterOut);

  if (shouldFilterOut) {
    return null;
  }

  let accordion = null;

  if (reputation === REPUTATION.WHITELISTED) {
    accordion = <WhitelistReputationAccordion assetId={assetId} />;
  }

  if (reputation === REPUTATION.UNVERIFIED) {
    accordion = <UnverifiedReputationAccordion />;
  }

  if (reputation === REPUTATION.BLACKLISTED) {
    accordion = <BlackListedReputationAccordion />;
  }

  if (accordion) {
    return (
      <View testID="ReputationInfo">
        <Label type="boldTitle2" style={styles.label}>
          {loc.reputation.title}
        </Label>
        {accordion}
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
  },
});
