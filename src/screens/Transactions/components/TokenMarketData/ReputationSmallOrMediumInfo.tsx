import React from 'react';

import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import type { FilterOut } from '@/components/Reputation/useShouldFilterOut';
import { useShouldFilterOut } from '@/components/Reputation/useShouldFilterOut';
import { WhitelistIcons } from '@/components/Reputation/WhitelistIcons';
import { SvgIcon } from '@/components/SvgIcon';
import { REPUTATION, useReputation, useReputationLists } from '@/hooks/useReputation';
import { useTheme } from '@/theme/themes';

import { commonStyles } from './styles';

import loc from '/loc';

interface SizeProps {
  size: 'small' | 'medium';
}

interface Props extends SizeProps {
  assetId: string;
  filterOut?: FilterOut;
}

const WhitelistReputationInfo = ({ assetId, size }: Props) => {
  const reputationLists = useReputationLists(assetId);
  const isSmall = size === 'small';

  return (
    <View testID={`WhitelistReputationInfo-${size}`} style={[commonStyles.infoContainer, commonStyles[size], styles.row, !isSmall && styles.mediumWhitelisted]}>
      <GradientItemBackground />
      <View style={styles.row}>
        <SvgIcon style={styles.separator} name="verified" color="kraken" size={20} bgColor="light100" />
        <Label color={isSmall ? 'light100' : 'light50'} type={isSmall ? 'boldCaption1' : 'regularCaption1'} style={[styles.separator, styles.label]}>
          {isSmall ? loc.reputation.verified : loc.formatString(loc.reputation.onTokenLists, { count: reputationLists.whitelists.length })}
        </Label>
      </View>

      <WhitelistIcons whitelists={reputationLists.whitelists} iconSize={isSmall ? 16 : 23} maxIconCount={isSmall ? 3 : 8} />
    </View>
  );
};

const UnverifiedReputationInfo = ({ size }: SizeProps) => {
  return (
    <View testID={`UnverifiedReputationInfo-${size}`} style={[commonStyles.infoContainer, commonStyles[size], styles.container]}>
      <GradientItemBackground />
      <View style={styles.row}>
        <SvgIcon style={styles.separator} name="error" color="yellow500" size={16} />
        <Label color="yellow500" type="boldBody" style={styles.label}>
          {loc.reputation.unverified}
        </Label>
      </View>

      {size === 'medium' && (
        <Label type="regularCaption1" style={styles.itemDetails} color="light75">
          {loc.tokenLists.unverifiedWarning}
        </Label>
      )}
    </View>
  );
};

const BlackListedReputationInfo = ({ size }: SizeProps) => {
  const { colors } = useTheme();
  return (
    <View
      testID={`BlackListedReputationInfo-${size}`}
      style={[commonStyles.infoContainer, commonStyles[size], styles.container, size === 'medium' && { backgroundColor: colors.red400_15 }]}>
      <GradientItemBackground />
      <View style={styles.row}>
        <SvgIcon style={styles.separator} name="warning-filled" color="red400" size={16} />
        <Label color="red400" type="boldBody" style={styles.label}>
          {loc.reputation.likelySpam}
        </Label>
      </View>

      {size === 'medium' && (
        <Label type="regularCaption1" style={styles.itemDetails} color="red400">
          {loc.tokenLists.likelySpamUseCaution}
        </Label>
      )}
    </View>
  );
};

export const ReputationSmallOrMediumInfo = ({
  assetId,
  size,
  filterOut = { reputation: [], coinDesignation: ['network' ] },
}: Props) => {
  const reputation = useReputation(assetId);
  const shouldFilterOut = useShouldFilterOut({ assetId, reputation }, filterOut);

  if (shouldFilterOut) {
    return null;
  }

  let info = null;
  if (reputation === REPUTATION.WHITELISTED) {
    info = <WhitelistReputationInfo assetId={assetId} size={size} />;
  }

  if (reputation === REPUTATION.UNVERIFIED) {
    info = <UnverifiedReputationInfo size={size} />;
  }

  if (reputation === REPUTATION.BLACKLISTED) {
    info = <BlackListedReputationInfo size={size} />;
  }
  return info;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginRight: 2,
  },
  itemDetails: {
    marginLeft: 18,
  },
  mediumWhitelisted: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    lineHeight: 20,
  },
});
