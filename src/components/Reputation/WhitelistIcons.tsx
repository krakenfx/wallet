import React from 'react';
import { StyleSheet } from 'react-native';
import Svg from 'react-native-svg';

import { OverlappingListWithHasMoreCount } from '@/components/OverlappingListWithHasMoreCount';
import { isTokenListName, tokenListNameToImageSource } from '@/screens/TokenLists/utils';
import { useTheme } from '@/theme/themes';
import { sortWithKrakenFirst } from '@/utils/sortWithKrakenFirst';

const ICON_SIZE = 16;
const ICON_OFFSET = (6 / 16) * ICON_SIZE;
const MAX_WHITELIST_ICON_COUNT = 3;

export const WhitelistIcons = ({ whitelists }: { whitelists: string[] }) => {
  const whitelistsSorted = sortWithKrakenFirst(whitelists);
  const { colors } = useTheme();

  const icons = [];
  const iconLength = Math.min(whitelistsSorted.length, MAX_WHITELIST_ICON_COUNT);
  const hasMoreCount = Math.max(0, whitelistsSorted.length - MAX_WHITELIST_ICON_COUNT);

  for (let i = 0, ii = iconLength; i < ii; i++) {
    const whitelist = whitelistsSorted[i];
    const ImageSource = isTokenListName(whitelist) ? tokenListNameToImageSource[whitelist] : tokenListNameToImageSource.fallback;

    icons.push(
      <Svg viewBox="0 0 250 250" style={styles.icon}>
        <ImageSource />
      </Svg>,
    );
  }

  const hasMoreCountProps = {
    backgroundColor: colors.martinique,
    circleSize: ICON_SIZE,
    fontSize: 10,
    count: hasMoreCount,
  };

  return <OverlappingListWithHasMoreCount items={icons} offsetSize={ICON_OFFSET} hasMoreCount={hasMoreCountProps} />;
};

const styles = StyleSheet.create({
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
});
