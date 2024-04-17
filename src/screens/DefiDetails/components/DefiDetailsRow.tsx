import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { RealmDefiPosition } from '@/realm/defi';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';

import { BalanceLabel } from './BalanceLabel';
import { DefiPositionImages } from './DefiPositionImages';
import { DefiPositionValue } from './DefiPositionValue';
import { MainLabel } from './MainLabel';
import { SubLabels, filterSubLabels } from './SubLabels';

interface Props {
  item: RealmDefiPosition;
}

export const DefiDetailsRow: FC<Props> = ({ item }) => {
  const usdValue = typeof item.usdValue === 'string' ? parseFloat(item.usdValue) : item.usdValue;
  const usdFiatRate = useCurrentUsdFiatRate();
  const defiValue = usdFiatRate * usdValue;

  const hasSubLabels = item.metadata.subLabels !== undefined && item.metadata.subLabels.length > 0 && filterSubLabels(item.metadata.subLabels).length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.leftInfo}>
        <DefiPositionImages images={item.metadata.imageUrls} />
        <View style={[styles.descriptionText, { justifyContent: hasSubLabels ? 'space-between' : 'center' }]}>
          <MainLabel label={item.metadata.label} category={item.category} tokens={item.tokens} value={defiValue} />
          {hasSubLabels && <SubLabels subLabels={item.metadata.subLabels} />}
        </View>
      </View>
      <View style={styles.amountContainer}>
        <DefiPositionValue value={defiValue} category={item.category} />

        <View>
          <BalanceLabel tokens={item.tokens} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  descriptionText: {
    marginHorizontal: 10,
  },
  amountContainer: {
    width: '30%',
    alignItems: 'flex-end',
  },

  amountText: {
    textAlign: 'right',
  },
});
