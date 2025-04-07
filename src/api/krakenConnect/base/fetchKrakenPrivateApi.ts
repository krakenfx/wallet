import { isEmpty } from 'lodash';

import { getHarmony } from '@/api/base/apiFactory';

import type { KrakenConnectProxyRequest } from '@/api/types';

import { createAuthenticationSignature } from './createAuthenticationSignature';

import type { SupportedPrivateApiPaths } from './supportedPaths';

import { KRAKEN_API_URI } from '/config';
import { handleError } from '/helpers/errorHandler';

export interface PrivateApiSecureParams {
  apiKey: string;
  privateKey: string;
}

interface Params extends PrivateApiSecureParams {
  path: SupportedPrivateApiPaths;
  method: 'POST' | 'GET';
  body?: Record<string, unknown>;
  tokenId?: string;
}

export const fetchKrakenPrivateApi = async <T>({ body = {}, path, privateKey, apiKey, method, tokenId }: Params): Promise<{ result: T | null; error: any }> => {
  const nonce = Date.now().toString();
  const bodyWithNonce = { ...body, nonce };
  const bodySerialised = JSON.stringify(bodyWithNonce);

  const signature = createAuthenticationSignature(privateKey, path, nonce, bodySerialised);

  const apiURI = KRAKEN_API_URI;

  const httpOptions: {
    headers: KrakenConnectProxyRequest['headers'];
  } = {
    headers: {
      'API-Key': apiKey,
      'API-Sign': signature,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let response;
  const harmony = await getHarmony();
  try {
    response = await harmony.POST('/v1/krakenConnectProxy', {
      body: { apiURI: `${apiURI}${path}`, method, headers: httpOptions.headers, body: bodySerialised, tokenId },
    });
  } catch (e) {
    handleError('Error getting Kraken Connect response', 'ERROR_CONTEXT_PLACEHOLDER');
    return {
      result: null,
      error: e,
    };
  }

  if (!isEmpty(response.error) || response.error.length > 0) {
    console.error('Error from Kraken Connect', response.error);
    const errorMessage = Array.isArray(response.error) ? response.error.join('; ') : String(response.error);
    throw new Error(errorMessage);
  }

  return {
    result: response.result as T,
    error: response.error,
  };
};
