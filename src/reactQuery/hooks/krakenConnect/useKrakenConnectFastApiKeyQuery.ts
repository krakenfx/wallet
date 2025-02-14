import { useQuery } from '@tanstack/react-query';

import { fetchFastApiKey } from '@/api/krakenConnect/base/fetchFastApiKeys';
import { useKrakenConnectOauthVerification } from '@/realm/krakenConnect/useKrakenConnectOauthVerification';

export const useKrakenConnectFastApiKeyQuery = (enableQuery = false, code: string | null, state: string | null) => {
  const [challenge] = decodeURIComponent(state ?? '').split(',');
  const verification = useKrakenConnectOauthVerification(challenge ?? '');
  return useQuery({
    queryKey: ['useKrakenConnectFastApiKeyQuery', code, verification],
    enabled: enableQuery && !!code && !!challenge && !!verification,
    queryFn: () => {
      if (code && verification) {
        return fetchFastApiKey(code, verification);
      }
    },
  });
};
