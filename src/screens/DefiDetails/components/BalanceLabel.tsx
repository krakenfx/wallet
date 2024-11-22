import type { FC } from 'react';

import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';
import type { RealmDefiToken } from '@/realm/defi';

interface Props {
  tokens?: Realm.List<RealmDefiToken>;
}

export const BalanceLabel: FC<Props> = ({ tokens }) => {
  if (tokens === undefined || tokens.length === 0) {
    return null;
  }

  const mainToken = tokens[0];
  let text = `${mainToken.balance?.toFixed(2)} ${mainToken.symbol}`;

  text = tokens.length > 1 ? text.concat(`+${tokens[1].symbol}`) : text;
  text = tokens.length > 2 ? text.concat('+…') : text;

  return (
    <Label type="regularCaption1" color="light50" numberOfLines={1} ellipsizeMode="tail" style={styles.container}>
      {text}
    </Label>
  );
};

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxWidth: 100,
    paddingTop: 1,
  },
});
