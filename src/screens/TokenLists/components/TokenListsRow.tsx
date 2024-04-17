import { useNavigation } from '@react-navigation/native';
import noop from 'lodash/noop';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Linking } from 'react-native';
import Svg from 'react-native-svg';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { REPUTATION } from '@/hooks/useReputation';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';

import { TokenListNames } from '../types';
import { isTokenListName, tokenListNameToImageSource, tokenListNameToUILabel, tokenListNameToURL } from '../utils';

import { TokenListsPillBlacklisted, TokenListsPillUnverified, TokenListsPillWhitelisted } from './TokenListsPill';

import loc from '/loc';

type RowProps = {
  tokenListName: TokenListNames | string;
  tokenListCount: string;
  reputation: REPUTATION;
};

const navigateTo = (url: string) => () => Linking.openURL(url);

export const TokenListsRow = ({ tokenListName, tokenListCount, reputation }: RowProps) => {
  const isTokenListName_ = isTokenListName(tokenListName);
  const ImageSource = isTokenListName_ ? tokenListNameToImageSource[tokenListName] : tokenListNameToImageSource.fallback;
  const uiLabel = isTokenListName_ ? tokenListNameToUILabel[tokenListName] : tokenListName;
  const navigation = useNavigation();
  const onPress = isTokenListName_ ? navigateTo(tokenListNameToURL[tokenListName]) : noop;

  return (
    <Touchable style={styles.container} onPress={onPress} testID="TokenListRow">
      <View style={styles.iconContainer}>
        <Svg viewBox="0 0 250 250" style={styles.icon}>
          <ImageSource />
        </Svg>
        <View style={styles.assetRow}>
          <View style={styles.header}>
            <Label type="boldTitle2" color="light100" style={styles.uiLabel} numberOfLines={1}>
              {uiLabel}
            </Label>
            {uiLabel === tokenListNameToUILabel.Kraken && (
              <View style={styles.infoIcon}>
                <SvgIcon
                  hitSlop={20}
                  name="info-circle"
                  color="light50"
                  size={18}
                  onPress={() => {
                    navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.WHITELISTED_KRAKEN });
                  }}
                />
              </View>
            )}
          </View>
          <Label type="regularCaption1" color="light50">
            {tokenListCount ? loc.formatString(loc.tokenLists.tokens, { tokenListCount: new Intl.NumberFormat().format(Number(tokenListCount)) }) : ' '}
          </Label>
        </View>
      </View>
      {reputation === REPUTATION.WHITELISTED && <TokenListsPillWhitelisted />}
      {reputation === REPUTATION.BLACKLISTED && <TokenListsPillBlacklisted />}
      {reputation === REPUTATION.UNVERIFIED && <TokenListsPillUnverified />}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  assetRow: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoIcon: {
    marginLeft: 4,
    marginTop: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
  },
  uiLabel: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    flexGrow: 1,
  },
});
