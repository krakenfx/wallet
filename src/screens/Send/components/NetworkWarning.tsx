import type React from 'react';

import { Alert, StyleSheet } from 'react-native';

import { CardWarning } from '@/components/CardWarning';
import { SvgIcon } from '@/components/SvgIcon';

import loc from '/loc';

export const NetworkWarning: React.FC<{ networkName: string }> = ({ networkName }) => {
  const title = loc.formatString(loc.send.networkWarning.alertTitle, { networkName }).toString();

  const showAlert = () => {
    Alert.alert(title, loc.formatString(loc.send.networkWarning.alertBody, { networkName }).toString());
  };

  return (
    <CardWarning
      style={styles.container}
      onPress={showAlert}
      type="info"
      iconSize={18}
      description={title}
      elementRight={<SvgIcon name="info-circle" color="light50" size={18} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
});
