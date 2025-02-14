import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import { useDefiDetailsContext } from './DefiDetailsContext';

import loc from '/loc';

export const DefiDetailsTransactionsEmpty = () => {
  const { assetSymbol, protocolName } = useDefiDetailsContext();

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/transactions/zero_state_tx.png')} style={styles.image} />
      <Label type="boldTitle1" style={styles.label}>
        {loc.transactionTile.noTransactionsTitle}
      </Label>
      <Label type="regularBody" color="light75" style={styles.label}>
        {loc.formatString(loc.earn.detailsSheet.depositCta, { symbol: assetSymbol, protocol: protocolName })}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 183,
    marginBottom: 2,
  },
  label: {
    marginVertical: 2,
  },
});
