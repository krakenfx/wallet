import type { NETWORK_FILTER } from './types';

export function getNetworkFilterFromCaip(caipId: string): NETWORK_FILTER {
  return `${caipId}/` as NETWORK_FILTER;
}
