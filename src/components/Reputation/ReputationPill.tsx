import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Label } from '@/components/Label';
import { Pill } from '@/components/Pill';
import { SvgIcon } from '@/components/SvgIcon';
import { REPUTATION, useReputation, useReputationLists } from '@/hooks/useReputation';

import { FilterOut, useShouldFilterOut } from './useShouldFilterOut';
import { WhitelistIcons } from './WhitelistIcons';

import loc from '/loc';

export const ReputationPillWhitelisted = memo(({ tokenID = '' }: { tokenID: string }) => {
  const reputationLists = useReputationLists(tokenID);

  return (
    <Pill backgroundColor="light15">
      <SvgIcon name="verified" color="kraken" size={16} bgColor="light100" />
      <Label color="light100" type="boldCaption1" style={styles.text}>
        {loc.reputation.verified}
      </Label>
      <WhitelistIcons whitelists={reputationLists.whitelists} />
    </Pill>
  );
});

export const ReputationPillBlacklisted = () => {
  return (
    <Pill backgroundColor="red400_15">
      <SvgIcon name="warning-filled" color="red400" size={16} />
      <Label color="red400" type="boldCaption1" style={styles.text}>
        {loc.reputation.likelySpam}
      </Label>
    </Pill>
  );
};

export const ReputationPillUnverified = () => {
  return (
    <Pill backgroundColor="yellow500_15">
      <SvgIcon name="error" color="yellow500" size={16} />
      <Label color="yellow500" type="boldCaption1" style={styles.text}>
        {loc.reputation.unverified}
      </Label>
    </Pill>
  );
};

const styles = StyleSheet.create({
  text: { lineHeight: 17 },
});

type ReputationPillProps = {
  tokenID?: string;
  filterOut?: FilterOut;
  style?: StyleProp<ViewStyle>;
};

export const ReputationPill = ({ tokenID = '', filterOut = { reputation: [], coinDesignation: ['network'] }, style }: ReputationPillProps) => {
  const reputation = useReputation(tokenID);
  const shouldFilterOut = useShouldFilterOut({ tokenID, reputation }, filterOut);

  if (shouldFilterOut) {
    return null;
  }

  let result = null;

  if (reputation === REPUTATION.WHITELISTED) {
    result = <ReputationPillWhitelisted tokenID={tokenID} />;
  }

  if (reputation === REPUTATION.BLACKLISTED) {
    result = <ReputationPillBlacklisted />;
  }

  if (reputation === REPUTATION.UNVERIFIED) {
    result = <ReputationPillUnverified />;
  }

  if (style) {
    result = <View style={style}>{result}</View>;
  }

  return result;
};
