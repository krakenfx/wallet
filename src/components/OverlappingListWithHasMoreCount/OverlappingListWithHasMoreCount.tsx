import type { ReactNode } from 'react';

import { CircleLabel } from '@/components/CircleLabel';
import type { Theme } from '@/theme/themes';

import { OverlappingList } from './OverlappingList';

import loc from '/loc';

export type OverlappingListWithHasMoreCountProps = {
  items: ReactNode[];
  offsetSize: number;
  hasMoreCount: {
    backgroundColor: string;
    circleSize: number;
    count: number;
    fontColor?: keyof Theme['colors'];
    fontSize: number;
  };
};

export const OverlappingListWithHasMoreCount = ({
  items,
  offsetSize,
  hasMoreCount: { backgroundColor, circleSize, fontColor, fontSize, count },
}: OverlappingListWithHasMoreCountProps) => {
  return (
    <OverlappingList
      items={
        count > 0
          ? [
              ...items,
              <CircleLabel
                key="circle"
                backgroundColor={backgroundColor}
                circleSize={circleSize}
                fontColor={fontColor}
                fontSize={fontSize}
                text={loc.formatString(loc._.plus, { count })}
              />,
            ]
          : items
      }
      offsetSize={offsetSize}
    />
  );
};
