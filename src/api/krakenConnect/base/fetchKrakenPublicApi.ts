import type { SupportedPublicApiPaths } from './supportedPaths';

import { KRAKEN_API_URI } from '/config';

interface PublicApiParams {
  path: SupportedPublicApiPaths;
  params: string;
}

export const fetchKrakenPublicApi = async <T>({ path, params }: PublicApiParams): Promise<{ result: T | null; error: any }> => {
  const response = await fetch(KRAKEN_API_URI + path + params);
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
