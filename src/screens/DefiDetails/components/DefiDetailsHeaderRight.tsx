import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

type Props = {
  protocolLogo: string;
  protocolName: string;
  vaultType: string;
};

export const DefiDetailsHeaderRight = ({ protocolLogo, protocolName, vaultType }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Label style={styles.protocolName}>{protocolName}</Label>
        <Label type="regularCaption1" color="light50" style={styles.vaultType}>
          {vaultType}
        </Label>
      </View>
      <Image style={styles.protocolLogo} source={{ uri: protocolLogo }} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
