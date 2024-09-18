import React, { ReactNode } from 'react';

import { CircleLabel } from '@/components/CircleLabel';

import { OverlappingList } from './OverlappingList';

import loc from '/loc';

type Props = {
  items: ReactNode[];
  offsetSize: number;
  hasMoreCount: {
    backgroundColor: string;
    circleSize: number;
    fontSize: number;
    count: number;
  };
};

export const OverlappingListWithHasMoreCount = ({ items, offsetSize, hasMoreCount: { backgroundColor, circleSize, fontSize, count } }: Props) => {
  return (
    <OverlappingList
      items={
        count > 0
          ? [
              ...items,
              <CircleLabel backgroundColor={backgroundColor} circleSize={circleSize} fontSize={fontSize} text={loc.formatString(loc._.plus, { count })} />,
            ]
          : items
      }
      offsetSize={offsetSize}
    />
  );
};
