import type { FC } from 'react';

import React from 'react';
import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';
import type { DefiSublabel } from '@/realm/defi';

interface SubLabelProps {
  text: string | number;
}

const SubLabel: FC<SubLabelProps> = ({ text }) => {
  const stringText = text.toString();
  const color = stringText.includes('APY') ? 'green400' : 'light75';
  return (
    <Label type="regularCaption1" color={color}>
      {text}
    </Label>
  );
};

interface SubLabelsProps {
  subLabels?: DefiSublabel[];
}

export const filterSubLabels = (subLabels: DefiSublabel[] | undefined) =>
  subLabels
    ? subLabels
        .filter(l => l.type !== 'dollar')
        .slice(0)
        .reverse()
    : [];

export const SubLabels: FC<SubLabelsProps> = ({ subLabels }) => {
  return (
    <Label type="regularCaption1" numberOfLines={1} ellipsizeMode="tail" style={styles.container}>
      {filterSubLabels(subLabels).map((i: DefiSublabel) => (
        <SubLabel key={i.label} text={i.label + ' '} />
      ))}
    </Label>
  );
};

export const styles = StyleSheet.create({
  container: {
    maxWidth: 150,
    marginTop: 3,
  },
});
