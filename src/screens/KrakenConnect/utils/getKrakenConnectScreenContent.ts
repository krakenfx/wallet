import type { KarkenConnectScreenType } from '../types';

type ScreenArgs = {
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  hasCredentials: boolean;
  isConnected: boolean;
  connectionError: null | string;
  error: null | { message?: string; stack?: string };
};

export const getKrakenConnectScreenContent = ({
  isFetching,
  isLoading,
  isError,
  hasCredentials,
  isConnected,
  connectionError,
  error,
}: ScreenArgs): KarkenConnectScreenType => {
  if (error) {
    return 'error';
  }
  if (connectionError) {
    return 'error';
  }
  if (isError) {
    return 'error';
  }
  if (isFetching || isLoading) {
    return 'loading';
  }
  if (!isConnected) {
    return 'landing';
  }
  if (!hasCredentials) {
    return 'landing';
  }
  if (hasCredentials && isConnected) {
    return 'connected';
  }
  return 'landing';
};
