import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

type Props = { protocolName: string; protocolDescription?: string };

export const DefiDetailsHeaderProtocol = ({ protocolName, protocolDescription }: Props) => {
  return (
    <View style={styles.container}>
      <Label type="boldDisplay1" color="kraken" style={styles.protocoloName} numberOfLines={1} adjustsFontSizeToFit>
        {protocolName}
      </Label>
      <Label type="regularBody" color="light75" numberOfLines={3}>
        {protocolDescription}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    gap: 8,
    marginHorizontal: 24,
    minHeight: 150,
  },
  protocoloName: {
    textTransform: 'capitalize',
  },
});
