import type { SupportedPublicApiPaths } from './supportedPaths';

import { KRAKEN_API_URI, KRAKEN_BETA_API_URI } from '/config';

export interface PublicApiSecureParams {
  cfToken: string;
}

interface PublicApiParams extends PublicApiSecureParams {
  path: SupportedPublicApiPaths;
  params: string;
}

export const fetchKrakenPublicApi = async <T>({ path, params, cfToken }: PublicApiParams): Promise<{ result: T | null; error: any }> => {
  const apiURI = cfToken ? KRAKEN_BETA_API_URI : KRAKEN_API_URI;

  const response = await fetch(apiURI + path + params, {
    headers: {
      'CF-Access-Token': cfToken,
    },
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
