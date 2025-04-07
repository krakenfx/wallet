import type { JSX } from 'react';

import MaskedView from '@react-native-masked-view/masked-view';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, Defs, G, Mask, Svg } from 'react-native-svg';

import type { OverlappingListWithHasMoreCountProps } from '@/components/OverlappingListWithHasMoreCount';
import { OverlappingListWithHasMoreCount } from '@/components/OverlappingListWithHasMoreCount';
import { useTheme } from '@/theme/themes';

type Props = {
  borderRadius?: number;
  hasMoreCountProps?: Partial<OverlappingListWithHasMoreCountProps['hasMoreCount']>;
  itemsToShow?: number;
  items: JSX.Element[];
  itemSize?: number;
  maskedItemOffset?: number;
};

export const OverlappingCollection = React.memo(
  ({ items, itemsToShow = 3, itemSize = 32, borderRadius = itemSize / 2, maskedItemOffset = itemSize / 3, hasMoreCountProps }: Props) => {
    const { colors } = useTheme();

    const data = useMemo(() => {
      const hasMore = itemsToShow < items.length;
      const items_ = [...items]
        .reverse()
        .slice(0, itemsToShow)
        .map<React.ReactNode>((item, i) => {
          const isLast = (itemsToShow - 1 === i || items.length - 1 === i) && !hasMore;

          return (
            <View key={i} style={[styles.collectionIconContainer, { borderRadius, width: itemSize, height: itemSize }]}>
              <MaskedView
                maskElement={
                  <Svg>
                    <Defs>
                      <Mask id="moonShape" maskUnits="userSpaceOnUse">
                        <Circle x={borderRadius} y={borderRadius} r={borderRadius} fill="white" />
                        {!isLast && <Circle x={itemSize + 2} y={borderRadius} r={borderRadius + 2} fill="black" />}
                      </Mask>
                    </Defs>
                    <G mask={'url(#moonShape)'}>
                      <Circle x={borderRadius} y={borderRadius} r={borderRadius} />
                    </G>
                  </Svg>
                }>
                {item}
              </MaskedView>
            </View>
          );
        });

      const hasMoreCountProps_: OverlappingListWithHasMoreCountProps['hasMoreCount'] = {
        backgroundColor: colors.light15,
        circleSize: itemSize,
        fontColor: 'light50',
        fontSize: 13,
        count: items.length - itemsToShow,
        ...hasMoreCountProps,
      };

      return <OverlappingListWithHasMoreCount items={items_} offsetSize={maskedItemOffset} hasMoreCount={hasMoreCountProps_} />;
    }, [borderRadius, colors.light15, items, itemSize, itemsToShow, maskedItemOffset, hasMoreCountProps]);

    return data;
  },
);

const styles = StyleSheet.create({
  collectionIconContainer: {
    overflow: 'hidden',
  },
});
