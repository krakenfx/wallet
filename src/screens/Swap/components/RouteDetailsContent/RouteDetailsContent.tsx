import type React from 'react';

import { StyleSheet, View } from 'react-native';

import { RouteAccordion, type RouteAccordionProps } from '../RouteAccordion';
import { RouteDetailsRow, type RouteDetailsRowProps } from '../RouteDetailsRow';

import type { MergeExclusive } from 'type-fest';

type CollapsibleProps = {
  collapsible: true;
} & Omit<RouteAccordionProps, 'rightElement' | 'leftElement'>;

type NonCollapsibleProps = {
  collapsible?: false;
};

type OwnProps = {
  rows: RouteDetailsRowProps[];
};

type Props = OwnProps & MergeExclusive<CollapsibleProps, NonCollapsibleProps>;

export const RouteDetailsContent: React.FC<Props> = ({ collapsible, rows, ...accordionProps }) => {
  const [firstRow, ...otherRows] = rows;

  const content = (
    <>
      {otherRows.map((row, index) => (
        <RouteDetailsRow key={index} {...row} />
      ))}
    </>
  );

  if (!collapsible) {
    return (
      <View style={styles.content}>
        <RouteDetailsRow {...firstRow} />
        {content}
      </View>
    );
  }

  return (
    <RouteAccordion style={styles.gap} contentStyle={styles.content} leftElement={firstRow.labelLeft} rightElement={firstRow.labelRight} {...accordionProps}>
      {content}
    </RouteAccordion>
  );
};

const styles = StyleSheet.create({
  gap: {
    marginBottom: 1,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 16,
  },
});
