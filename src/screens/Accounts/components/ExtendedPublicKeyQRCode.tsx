import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { useTheme } from '@/theme/themes';

type Props = {
  value: string;
  size: number;
};

export const ExtendedPublicKeyQRCode = ({ value, size }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.qrCodeContainer, { borderColor: colors.light100 }]}>
      <QRCode value={value} size={size} logoSize={90} color={colors.background} backgroundColor={colors.light100} ecl="H" quietZone={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  qrCodeContainer: {
    marginBottom: 4,
    marginTop: 16,
    borderWidth: 24,
    borderRadius: 16,
  },
});
