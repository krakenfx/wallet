import { Image, StyleSheet, View } from 'react-native';

import type { Position } from '@/components/DefiProtocolPositions/DefiProtocolPositions.types';
import { NetworkIcon } from '@/components/NetworkIcon';
import { useTheme } from '@/theme/themes';

import { DefiDetailsInfoItem } from './DefiDetailsInfoItem';

import loc from '/loc';

type Props = {
  position: Position;
  protocolLogo: string;
  protocolName: string;
};

export const DefiDetailsInfoPool: React.FC<Props> = ({ position, protocolLogo, protocolName }) => {
  const { colors } = useTheme();
  const network = position.vaultNetwork ? position.vaultNetwork : '-';
  const tvl = '-';
  const poolType = position.isDebt ? loc.earn.debt : loc.earn.liquidityPool;
  const networkIcon = network !== '-' ? <NetworkIcon networkName={network} size={16} /> : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.dark15 }]}>
      <View style={styles.column}>
        <DefiDetailsInfoItem
          label={loc.earn.detailsSheet.info.protocol}
          value={protocolName}
          prefix={<Image style={styles.protocolLogo} source={{ uri: protocolLogo }} />}
          style={styles.capitalize}
        />
        <DefiDetailsInfoItem label={loc.earn.detailsSheet.info.network} value={network} prefix={networkIcon} style={styles.capitalize} />
      </View>
      <View style={styles.column}>
        <DefiDetailsInfoItem label={loc.earn.detailsSheet.info.type} value={poolType} />
        <DefiDetailsInfoItem label={loc.earn.tvl} value={tvl} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 12,
    paddingLeft: 16,
    gap: 16,
    borderRadius: 16,
  },
  column: {
    flex: 1,
    gap: 16,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  protocolLogo: {
    height: 16,
    width: 16,
    borderRadius: 10,
  },
});
