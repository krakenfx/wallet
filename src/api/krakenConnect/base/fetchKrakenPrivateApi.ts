import { createAuthenticationSignature } from './createAuthenticationSignature';

import type { SupportedPrivateApiPaths } from './supportedPaths';

import { KRAKEN_API_URI, KRAKEN_BETA_API_URI } from '/config';

export interface PrivateApiSecureParams {
  apiKey: string;
  privateKey: string;
  cfToken: string;
}

interface Params extends PrivateApiSecureParams {
  body?: string[][] | Record<string, string> | string | URLSearchParams;
  path: SupportedPrivateApiPaths;
  method: 'POST' | 'GET';
}

export const fetchKrakenPrivateApi = async <T>({ body, path, privateKey, apiKey, method, cfToken }: Params): Promise<{ result: T | null; error: any }> => {
  const nonce = Date.now().toString();
  const inputParameters = new URLSearchParams(body).toString();
  const apiPostBodyData = 'nonce=' + nonce + '&' + inputParameters;
  const signature = createAuthenticationSignature(privateKey, path, nonce, apiPostBodyData);

  const apiURI = cfToken ? KRAKEN_BETA_API_URI : KRAKEN_API_URI;

  const httpOptions = {
    headers: {
      'CF-Access-Token': cfToken,
      'API-Key': apiKey,
      'API-Sign': signature,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const response = await fetch(apiURI + path, {
    method,
    headers: httpOptions.headers,
    body: apiPostBodyData,
  });

  const json = await response.json();

  if (!response.ok) {
    return {
      result: null,
      error: json.error,
    };
  }

  return {
    result: json.result as T,
    error: null,
  };
};
