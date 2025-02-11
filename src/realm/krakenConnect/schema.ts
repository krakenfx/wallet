import type { ObjectSchema } from 'realm';

export interface KrakenConnectCredentials {
  primaryKey: string;
  apiKey: string;
  apiPrivateKey: string;
  date: number;
}
export const REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS = 'krakenConnectCredentials';
export const KRAKEN_CONNECT_CREDENTIALS_REALM_KEY = 'KRAKEN_CONNECT_CREDENTIALS_REALM_KEY';
export const KrakenConnectCredentialsSchema: ObjectSchema = {
  name: REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS,
  properties: {
    primaryKey: 'string',
    apiKey: 'string',
    apiPrivateKey: 'string',
    date: 'int',
  },
  primaryKey: 'primaryKey',
};
