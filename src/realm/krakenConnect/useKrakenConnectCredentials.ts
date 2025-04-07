import { useObject } from '../RealmContext';

import { KRAKEN_CONNECT_CREDENTIALS_REALM_KEY, type KrakenConnectCredentials, REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS } from './schema';

export const useKrakenConnectCredentials = () => {
  const keys = useObject<KrakenConnectCredentials>(REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS, KRAKEN_CONNECT_CREDENTIALS_REALM_KEY, 'primaryKey');
  const apiKey = keys?.apiKey ?? '';
  const apiPrivateKey = keys?.apiPrivateKey ?? '';

  return {
    API_KEY: apiKey,
    API_SECRET: apiPrivateKey,
  };
};
