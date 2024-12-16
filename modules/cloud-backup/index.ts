import { parseISO } from 'date-fns';
import { NativeModules, Platform } from 'react-native';

import { getOSMajorVersionNumber } from '@/utils/getOSMajorVersionNumber';

interface CredentialResult {
  credentialID: string;
}

export interface ReadResult extends CredentialResult {
  data: string;
}

export interface CloudBackupMetadata extends CredentialResult {
  date: Date;
  device: string;
  name: string;
}

type CloudBackupErrorCodeKey =
  | 'user_canceled'
  | 'no_credentials_found'
  | 'failed'
  | 'blob_mutation_failed'
  | 'unexpected_credential_type'
  | 'synchronization_failed'
  | 'data_conversion_failed'
  | 'create_challenge_failed'
  | 'unknown';

type CloudBackupErrorCode = {
  [K in CloudBackupErrorCodeKey]: K;
};

interface CloudBackupNativeInterface {
  register(accountName: string): Promise<CredentialResult>;

  readData(credentialID: string | null): Promise<ReadResult>;

  writeData(credentialID: string, data: string): Promise<CredentialResult>;

  getKnownCredentials(): Promise<string[]>;

  setKnownCredentials(credentials: string[]): Promise<void>;

  addKnownCredential(credential: string): Promise<void>;

  errorCode: CloudBackupErrorCode;
}

const CloudBackup = NativeModules.CloudBackup as CloudBackupNativeInterface;

const reject = () => Promise.reject('Passkey module requires iOS 17.0 or above');

export const CLOUD_BACKUP_DELETED = 'DELETED';

export const isPasskeySupported = (() => {
  if (Platform.OS !== 'ios') {
    return false;
  }

  return getOSMajorVersionNumber() >= 17;
})();

export const CloudBackupError = (isPasskeySupported ? CloudBackup.errorCode : {}) as CloudBackupErrorCode;

const backupToString = (b: CloudBackupMetadata): string =>
  JSON.stringify(b, (key, value) => (key === 'date' && value instanceof Date ? value.toISOString() : value));

const backupFromString = (s: string): CloudBackupMetadata =>
  JSON.parse(s, (key, value) => (key === 'date' && typeof value === 'string' ? parseISO(value) : value));

export const CloudBackupManager = isPasskeySupported
  ? {
      register: CloudBackup.register,
      readData: CloudBackup.readData,
      writeData: CloudBackup.writeData,
      getKnownBackups: async (): Promise<CloudBackupMetadata[]> => {
        const credentials = await CloudBackup.getKnownCredentials();
        return credentials.map(backupFromString);
      },
      setKnownBackups: async (backups: CloudBackupMetadata[]) => {
        const credentials = backups.map(backupToString);
        return CloudBackup.setKnownCredentials(credentials);
      },
      addKnownBackup: async (backup: CloudBackupMetadata) => {
        return CloudBackup.addKnownCredential(backupToString(backup));
      },
    }
  : {
      register: reject,
      readData: reject,
      writeData: reject,
      getKnownBackups: reject,
      setKnownBackups: reject,
      addKnownBackup: reject,
    };
