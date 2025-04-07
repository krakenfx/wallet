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

export interface KrakenConnectOauthVerification {
  challenge: string;
  verification: string;
}

export const REALM_TYPE_KRAKEN_OAUTH_VERIFICATION = 'KrakenConnectOauthVerification';

export const KrakenConnectOauthVerificationSchema: ObjectSchema = {
  name: REALM_TYPE_KRAKEN_OAUTH_VERIFICATION,
  properties: {
    challenge: 'string',
    verification: 'string',
  },
  primaryKey: 'challenge',
};

export type KrakenConnectSettingsType = 'accountsConnected' | 'dismissedCta';

export type KrakenConnectSettings = {
  name: KrakenConnectSettingsType;
  value: number[];
};
export const REALM_TYPE_KRAKEN_CONNECT_SETTINGS = 'krakenConnectSettings';
export const KrakenConnectSettingsSchema: ObjectSchema = {
  name: REALM_TYPE_KRAKEN_CONNECT_SETTINGS,
  properties: {
    name: 'string',
    value: {
      type: 'list',
      objectType: 'int',
      default: [],
    },
  },
  primaryKey: 'name',
};
