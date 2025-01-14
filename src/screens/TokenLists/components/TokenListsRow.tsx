import type { ViewStyle } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import noop from 'lodash/noop';

import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBrowser } from '@/hooks/useBrowser';
import { REPUTATION } from '@/hooks/useReputation';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';

import { isTokenListName, tokenListNameToImageSource, tokenListNameToUILabel, tokenListNameToURL } from '../utils';

import { TokenListsPillBlacklisted, TokenListsPillUnverified, TokenListsPillWhitelisted } from './TokenListsPill';

import type { TokenListNames } from '../types';

import loc from '/loc';

type RowProps = {
  tokenListName: TokenListNames | string;
  tokenListCount: number;
  reputation: REPUTATION;
  showOnlyWhiteListed?: boolean;
  style?: ViewStyle;
};

export const TokenListsRow = ({ tokenListName, tokenListCount, reputation, showOnlyWhiteListed, style }: RowProps) => {
  const { openURL } = useBrowser();
  const isTokenListName_ = isTokenListName(tokenListName);
  const ImageSource = isTokenListName_ ? tokenListNameToImageSource[tokenListName] : tokenListNameToImageSource.fallback;
  const uiLabel = isTokenListName_ ? tokenListNameToUILabel[tokenListName] : tokenListName;
  const navigation = useNavigation();

  const navigateTo = (url: string) => () => openURL(url);
  const onPress = isTokenListName_ ? navigateTo(tokenListNameToURL[tokenListName]) : noop;

  if (showOnlyWhiteListed && reputation !== REPUTATION.WHITELISTED) {
    return null;
  }

  return (
    <Touchable style={[styles.container, style]} onPress={onPress} testID="TokenListRow">
      <View style={styles.iconContainer}>
        <Svg viewBox="0 0 250 250" style={styles.icon}>
          <ImageSource />
        </Svg>
        <View style={styles.assetRow}>
          <View style={styles.header}>
            <Label type="boldTitle2" color="light100" numberOfLines={1}>
              {uiLabel}
            </Label>
            {uiLabel === tokenListNameToUILabel.Kraken && (
              <SvgIcon
                hitSlop={20}
                name="info-circle"
                color="light50"
                style={styles.infoIcon}
                size={18}
                onPress={() => {
                  navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.WHITELISTED_KRAKEN });
                }}
              />
            )}
          </View>
          <Label type="regularCaption1" color="light75">
            {tokenListCount ? loc.formatString(loc.tokenLists.tokens, { tokenListCount: new Intl.NumberFormat().format(Number(tokenListCount)) }) : ' '}
          </Label>
        </View>
      </View>
      {showOnlyWhiteListed ? <SvgIcon name="checkmark" size={20} color="light75" /> : reputation === REPUTATION.WHITELISTED && <TokenListsPillWhitelisted />}
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
    marginBottom: 8,
    minHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginLeft: 4,
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
});
