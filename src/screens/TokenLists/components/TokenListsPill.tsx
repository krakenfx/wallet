import React from 'react';
import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';
import { Pill } from '@/components/Pill';
import { SvgIcon } from '@/components/SvgIcon';

import loc from '/loc';

export const TokenListsPillWhitelisted = () => {
  return (
    <Pill backgroundColor="light15">
      <SvgIcon name="verified" color="kraken" size={16} bgColor="light100" />
      <Label color="light100" type="boldCaption1" style={styles.text}>
        {loc.tokenLists.verified}
      </Label>
    </Pill>
  );
};

export const TokenListsPillBlacklisted = () => {
  return (
    <Pill backgroundColor="red400_15">
      <SvgIcon name="warning-filled" color="red400" size={16} />
      <Label color="red400" type="boldCaption1" style={styles.text}>
        {loc.tokenLists.likelySpam}
      </Label>
    </Pill>
  );
};

export const TokenListsPillUnverified = () => {
  return (
    <Pill backgroundColor="light15" overrideStyles={styles.unverified}>
      <Label color="light100" type="boldCaption1" style={styles.text}>
        {loc.tokenLists.unverified}
      </Label>
    </Pill>
  );
};

const styles = StyleSheet.create({
  unverified: {
    opacity: 0.25,
  },
  text: {
    lineHeight: 17,
  },
});
