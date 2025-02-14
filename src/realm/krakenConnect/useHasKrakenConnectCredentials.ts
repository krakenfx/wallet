import { useKrakenConnectCredentials } from './useKrakenConnectCredentials';

export const useHasKrakenConnectCredentials = () => {
  const { API_KEY, API_SECRET } = useKrakenConnectCredentials();
  return !!API_KEY && !!API_SECRET;
};
