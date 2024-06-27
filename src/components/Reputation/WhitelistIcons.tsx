import React from 'react';
import Svg from 'react-native-svg';

import { OverlappingListWithHasMoreCount } from '@/components/OverlappingListWithHasMoreCount';
import { isTokenListName, tokenListNameToImageSource } from '@/screens/TokenLists/utils';
import { useTheme } from '@/theme/themes';
import { sortWithKrakenFirst } from '@/utils/sortWithKrakenFirst';

const ICON_SIZE = 16;
const MAX_WHITELIST_ICON_COUNT = 3;

interface Props {
  whitelists: string[];
  iconSize?: number;
  maxIconCount?: number;
}

export const WhitelistIcons = ({ whitelists, iconSize = ICON_SIZE, maxIconCount = MAX_WHITELIST_ICON_COUNT }: Props) => {
  const whitelistsSorted = sortWithKrakenFirst(whitelists);
  const { colors } = useTheme();

  const icons = [];
  const iconLength = Math.min(whitelistsSorted.length, maxIconCount);
  const hasMoreCount = Math.max(0, whitelistsSorted.length - maxIconCount);
  const iconOffset = (6 / 16) * iconSize;

  for (let i = 0, ii = iconLength; i < ii; i++) {
    const whitelist = whitelistsSorted[i];
    const ImageSource = isTokenListName(whitelist) ? tokenListNameToImageSource[whitelist] : tokenListNameToImageSource.fallback;

    icons.push(
      <Svg
        viewBox="0 0 250 250"
        style={{
          width: iconSize,
          height: iconSize,
        }}>
        <ImageSource />
      </Svg>,
    );
  }

  const hasMoreCountProps = {
    backgroundColor: colors.martinique,
    circleSize: iconSize,
    fontSize: 10,
    count: hasMoreCount,
  };

  return <OverlappingListWithHasMoreCount items={icons} offsetSize={iconOffset} hasMoreCount={hasMoreCountProps} />;
};
