import { useObject } from '../RealmContext';

import { type KrakenConnectOauthVerification, REALM_TYPE_KRAKEN_OAUTH_VERIFICATION } from './schema';

export const useKrakenConnectOauthVerification = (challenge: string) => {
  const entry = useObject<KrakenConnectOauthVerification>(REALM_TYPE_KRAKEN_OAUTH_VERIFICATION, challenge, 'challenge');
  return entry?.verification;
};
