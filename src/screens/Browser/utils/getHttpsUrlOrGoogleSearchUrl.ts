import { createGoogleSearchUrl } from './createGoogleSearchUrl';
import { getHttpsUrl } from './getHttpsUrl';

export function getHttpsUrlOrGoogleSearchUrl(possibleUrl: string): string {
  const httpsUrl = getHttpsUrl(possibleUrl);

  return httpsUrl ?? createGoogleSearchUrl(possibleUrl);
}
