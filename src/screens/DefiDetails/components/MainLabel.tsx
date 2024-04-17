import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { RealmDefiToken } from '@/realm/defi';

import { useColorByCategory } from '../utils';

import loc from '/loc';

interface MainLabelProps {
  label?: string;
  category: string;
  value: number;
  tokens?: Realm.List<RealmDefiToken>;
}

interface PillProps {
  category: string;
  value: number;
}
const Pill: FC<PillProps> = ({ category, value }) => {
  const { isReward, isDebt, backgroundColor, color } = useColorByCategory(category, value);

  if (!isDebt && !isReward && !color) {
    return null;
  }

  const text = isDebt ? loc.defi.debt : loc.defi.claimable;

  return (
    <View style={[styles.pillContainer, { backgroundColor }]}>
      <Label color={color} type="boldCaption1">
        {text}
      </Label>
    </View>
  );
};

export const MainLabel: FC<MainLabelProps> = ({ label, category, tokens, value }) => {
  const mainLabel = tokens?.length === 1 && (tokens[0].tokens?.length ?? 0) <= 1 ? tokens[0].symbol : label;
  return (
    <Label type="boldTitle2" numberOfLines={1} ellipsizeMode="tail">
      <Label type="boldTitle2" style={styles.mainLabelContainer} numberOfLines={1} ellipsizeMode="tail">
        {mainLabel}
      </Label>
      <View>
        <Pill category={category} value={value} />
      </View>
    </Label>
  );
};

export const styles = StyleSheet.create({
  mainLabelContainer: {
    alignItems: 'center',
    maxWidth: 150,
  },
  pillContainer: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -6,
  },
});
