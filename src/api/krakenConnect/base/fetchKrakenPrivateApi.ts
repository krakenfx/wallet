import { createAuthenticationSignature } from './createAuthenticationSignature';

import type { SupportedPrivateApiPaths } from './supportedPaths';

import { KRAKEN_API_URI } from '/config';

interface Params {
  body?: string[][] | Record<string, string> | string | URLSearchParams;
  path: SupportedPrivateApiPaths;
  apiKey: string;
  privateKey: string;
  method: 'POST' | 'GET';
}

export const fetchKrakenPrivateApi = async <T>({ body, path, privateKey, apiKey, method }: Params): Promise<{ result: T | null; error: any }> => {
  const nonce = Date.now().toString();
  const inputParameters = new URLSearchParams(body).toString();
  const apiPostBodyData = 'nonce=' + nonce + '&' + inputParameters;
  const signature = createAuthenticationSignature(privateKey, path, nonce, apiPostBodyData);

  const httpOptions = {
    headers: {
      'API-Key': apiKey,
      'API-Sign': signature,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const response = await fetch(KRAKEN_API_URI + path, {
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
