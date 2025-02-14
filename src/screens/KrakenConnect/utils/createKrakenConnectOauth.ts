import crypto from 'crypto';

import { KRAKEN_CONNECT_API_SCOPES } from '@/api/krakenConnect/consts';

import { KRAKEN_CONNECT_CLIENT_ID, KRAKEN_CONNECT_OAUTH_AUTH_URI, URLs } from '/config';

export const createKrakenConnectOauth = (accountNumber: number) => {
  const sha256 = crypto.createHash('sha256');
  const verification = crypto.randomBytes(20).toString('hex');
  const challenge = sha256.update(verification).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const stateString = `${challenge},${accountNumber}`;
  const paramsObj = {
    client_id: KRAKEN_CONNECT_CLIENT_ID,
    redirect_uri: URLs.oauthRedirect,
    response_type: 'code',
    scope: KRAKEN_CONNECT_API_SCOPES.join(' '),
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state: encodeURIComponent(stateString),
  };

  const urlParams = new URLSearchParams(paramsObj);
  const oathLink = `${KRAKEN_CONNECT_OAUTH_AUTH_URI}?${urlParams.toString()}`;

  return {
    verification,
    challenge,
    oathLink,
  };
};
