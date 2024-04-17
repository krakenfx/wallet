import DeviceInfo from 'react-native-device-info';

import { decrypt, encrypt } from '@/utils/encryption';

export const hexStringToBuffer = (value: string) => Buffer.from(value, 'hex');
export const arrayBufferToHexString = (value: ArrayBuffer) => Buffer.from(value).toString('hex');
export const hexStringToInt8Array = (value: string) => Int8Array.from(hexStringToBuffer(value));

export type Encoding = 'hex' | 'utf8';

export async function encryptValue(value: string, password: string, encoding: Encoding = 'hex'): Promise<string> {
  const deviceID = await DeviceInfo.getUniqueId();
  const data = encoding === 'hex' ? hexStringToInt8Array(value) : value;
  const encrypted = await encrypt(data, password, deviceID);
  if (encrypted instanceof Int8Array) {
    return arrayBufferToHexString(encrypted);
  } else {
    return encrypted;
  }
}

export async function decryptValue(value: string, password: string, encoding: Encoding = 'hex'): Promise<string> {
  const deviceID = await DeviceInfo.getUniqueId();
  const data = encoding === 'hex' ? hexStringToInt8Array(value) : value;
  const decrypted = await decrypt(data, password, deviceID);
  if (decrypted instanceof Int8Array) {
    return arrayBufferToHexString(decrypted);
  } else {
    return decrypted;
  }
}

export async function encryptBuffer(value: Int8Array, password: string): Promise<Int8Array> {
  const deviceID = await DeviceInfo.getUniqueId();
  const encrypted = await encrypt(value, password, deviceID);
  if (encrypted instanceof Int8Array) {
    return encrypted;
  } else {
    throw Error('Failed to encrypt');
  }
}

export async function decryptBuffer(value: Int8Array, password: string): Promise<Int8Array> {
  const deviceID = await DeviceInfo.getUniqueId();
  const decrypted = await decrypt(value, password, deviceID);
  if (decrypted instanceof Int8Array) {
    return decrypted;
  } else {
    throw Error('Failed to decrypt');
  }
}
