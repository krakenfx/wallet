import { KRAKEN_CONNECT_PERMISSIONS } from '../consts';

import { KRAKEN_API_URI, KRAKEN_CONNECT_CLIENT_ID, URLs } from '/config';
import { handleError } from '/helpers/errorHandler';

export type ApiKeyResponse = {
  api_key: string;
  secret: string;
};

const tokenEndpoint = `${KRAKEN_API_URI}/oauth/token`;
const fastKeyEndpoint = `${KRAKEN_API_URI}/oauth/fast-api-key`;

export async function fetchFastApiKey(code: string, verification: string): Promise<ApiKeyResponse> {
  try {
    const tokenBodyOptions = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: URLs.oauthRedirect,
      code_verifier: verification,
    };
    const tokenBodyParams = new URLSearchParams(tokenBodyOptions);
    const clientId = Buffer.from(`${KRAKEN_CONNECT_CLIENT_ID}:`).toString('base64');
    const tokenFetchParams = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${clientId}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenBodyParams.toString(),
    };

    const tokenResponse = await fetch(tokenEndpoint, tokenFetchParams);
    const tokenJson = await tokenResponse.json();
    const { access_token } = tokenJson;

    if (!access_token) {
      const tokenError = new Error('Error fetching oauth access_token');
      handleError(tokenError, 'ERROR_CONTEXT_PLACEHOLDER');
      throw tokenError;
    }

    const fastKeyFetchParams = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key_name: `krakenWalletApiKey_${Date.now().toString()}`,
        ip_allowlist: null,
        nonce_window: null,
        permissions: KRAKEN_CONNECT_PERMISSIONS,
        query_from: 0,
        query_to: 0,
        valid_until: 0,
      }),
    };

    const response = await fetch(fastKeyEndpoint, fastKeyFetchParams);
    const fastApiKeyJson = await response.json();
    const { result } = fastApiKeyJson;

    if (!('api_key' in result) || !('secret' in result)) {
      const apiKeyError = new Error('Invalid fast api keys response');
      handleError(apiKeyError, 'ERROR_CONTEXT_PLACEHOLDER');
      throw apiKeyError;
    }
    return result;
  } catch (error) {
    console.error(error);
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    throw new Error('Error fetching fast api keys');
  }
}
