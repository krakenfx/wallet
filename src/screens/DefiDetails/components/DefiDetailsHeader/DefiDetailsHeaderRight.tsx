import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

type Props = {
  protocolLogo: string;
  protocolName: string;
  restrictWidth?: boolean;
  vaultType: string;
};

export const DefiDetailsHeaderRight = ({ protocolLogo, protocolName, restrictWidth, vaultType }: Props) => {
  return (
    <View style={[styles.container, restrictWidth && styles.restrictWidth]}>
      <View style={[styles.labels, restrictWidth && styles.flex]}>
        <Label style={styles.protocolName} numberOfLines={1}>
          {protocolName}
        </Label>
        <Label type="regularCaption1" color="light50" style={styles.vaultType} numberOfLines={1}>
          {vaultType}
        </Label>
      </View>
      <Image style={styles.protocolLogo} source={{ uri: protocolLogo }} />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  labels: {
    alignItems: 'flex-end',
  },
  protocolName: {
    textTransform: 'capitalize',
  },
  vaultType: {
    textTransform: 'capitalize',
  },
  protocolLogo: {
    height: 32,
    width: 32,
    borderRadius: 10,
  },
  restrictWidth: {
    flex: 1,
    maxWidth: 150,
    overflow: 'hidden',
  },
});
