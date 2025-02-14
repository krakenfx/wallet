import isEmpty from 'lodash/isEmpty';

import { createAuthenticationSignature } from './createAuthenticationSignature';

import type { SupportedPrivateApiPaths } from './supportedPaths';

import { KRAKEN_API_URI, KRAKEN_BETA_API_URI } from '/config';
import { handleError } from '/helpers/errorHandler';

export interface PrivateApiSecureParams {
  apiKey: string;
  privateKey: string;
  cfToken: string;
}

interface Params extends PrivateApiSecureParams {
  body?: Record<string, unknown>;
  path: SupportedPrivateApiPaths;
  method: 'POST' | 'GET';
}

export const fetchKrakenPrivateApi = async <T>({ body = {}, path, privateKey, apiKey, method, cfToken }: Params): Promise<{ result: T | null; error: any }> => {
  const nonce = Date.now().toString();
  const bodyWithNonce = { ...body, nonce };
  const bodySerialised = JSON.stringify(bodyWithNonce);

  const signature = createAuthenticationSignature(privateKey, path, nonce, bodySerialised);

  const apiURI = cfToken ? KRAKEN_BETA_API_URI : KRAKEN_API_URI;

  const httpOptions = {
    headers: {
      'CF-Access-Token': cfToken,
      'API-Key': apiKey,
      'API-Sign': signature,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const response = await fetch(apiURI + path, {
    method,
    headers: httpOptions.headers,
    body: bodySerialised,
  });

  let json;

  try {
    json = await response.json();
  } catch {
    handleError('Error in parsing Kraken Connect response', 'ERROR_CONTEXT_PLACEHOLDER');
    return {
      result: null,
      error: 'Error in parsing Kraken Connect response',
    };
  }

  if (!isEmpty(json.error)) {
    throw new Error(json.error);
  }

  return {
    result: json.result as T,
    error: json.error,
  };
};
