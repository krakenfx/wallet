import { useEffect } from 'react';
import { getBuildNumber, getVersion } from 'react-native-device-info';

import { realmConfig } from '@/realm/realmSchema';
import { useDeviceInfo } from '@/screens/DebugScreen';

import gitInfo from '/git-info.json';
import loc from '/loc';

export const useDebugInfo = () => {
  const deviceInfo = useDeviceInfo();
  useEffect(() => {
    const branch = __DEV__ ? `(${gitInfo?.currentBranch?.trim()})` : '';
    const commit = gitInfo?.commitSHA?.substring(0, 6) ?? '';
    const buildInfo = `${loc._.appName} ${getVersion()} ${branch}\n Build ${getBuildNumber()} (${commit})`;
    console.log('---- APP VERSION DETAILS ----');
    console.log('Build info: ', buildInfo);
    console.log('Realm schema version: ', realmConfig.schemaVersion);
    console.log('Device info: ', JSON.stringify(deviceInfo, null, 2));
  }, [deviceInfo]);
};
