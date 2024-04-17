import React, { ComponentProps } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { useTheme } from '@/theme/themes';

interface AddressQRCodeProps extends Pick<ComponentProps<typeof QRCode>, 'value' | 'logoSize' | 'size' | 'ecl' | 'onError'> {
  isLogoRendered?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AddressQRCode = ({ style, value, isLogoRendered = true, logoSize = 90, size = 300, ecl = 'H', onError = () => {} }: AddressQRCodeProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.qrCodeContainer, { borderColor: colors.light100 }, style]} testID="ReceiveAddressQRCodeContainer">
      <QRCode
        value={value}
        {...(isLogoRendered ? {} : {})}
        size={size}
        logoSize={logoSize}
        color={colors.background}
        backgroundColor={colors.light100}
        ecl={ecl}
        onError={onError}
        quietZone={0}
      />
    </View>
  );
};

export default AddressQRCode;

const styles = StyleSheet.create({
  qrCodeContainer: {
    borderWidth: 24,
    borderRadius: 16,
  },
});
