import { StyleSheet } from 'react-native';
import { getBuildNumber, getVersion } from 'react-native-device-info';

import { Label } from '@/components/Label';

import gitInfo from '/git-info.json';
import loc from '/loc';

export const BuildInfo = () => {
  const branch = __DEV__ ? `(${gitInfo?.currentBranch?.trim()})` : '';
  const commit = gitInfo?.commitSHA?.substring(0, 6) ?? '';
  return (
    <Label testID="BuildInfo" type="regularCaption1" color="light50" style={styles.infoLabel}>
      {`${loc._.appName} ${getVersion()} ${branch}\n Build ${getBuildNumber()} (${commit})`}
    </Label>
  );
};

const styles = StyleSheet.create({
  infoLabel: {
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
});
