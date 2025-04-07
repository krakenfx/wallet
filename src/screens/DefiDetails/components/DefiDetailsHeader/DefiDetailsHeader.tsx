import { StyleSheet, View } from 'react-native';

import { useDefiDetailsContext } from '../DefiDetailsContext';

import { DefiDetailsHeaderBalance } from './DefiDetailsHeaderBalance';
import { DefiDetailsHeaderDailyChange } from './DefiDetailsHeaderDailyChange';
import { DefiDetailsHeaderProtocol } from './DefiDetailsHeaderProtocol';
import { DefiDetailsHeaderSkeleton } from './DefiDetailsHeaderSkeleton';

export const DefiDetailsHeader = () => {
  const { isPending, protocolDescription, protocolName, position } = useDefiDetailsContext();
  const hasPosition = !isPending && position;
  const noPosition = !isPending && !position;

  return (
    <View style={styles.container}>
      {isPending && <DefiDetailsHeaderSkeleton />}
      {hasPosition && (
        <>
          <DefiDetailsHeaderBalance position={position} />
          <DefiDetailsHeaderDailyChange balanceUsd={position.positionUsdValue} />
        </>
      )}
      {noPosition && <DefiDetailsHeaderProtocol protocolName={protocolName} protocolDescription={protocolDescription} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 186,
  },
});
