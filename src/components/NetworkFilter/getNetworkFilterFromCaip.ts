import { NETWORK_FILTER } from './types';

export function getNetworkFilterFromCaip(caipId: string): NETWORK_FILTER {
  if (caipId.startsWith('solana:')) {
    return NETWORK_FILTER.solana;
  }
  return `${caipId}/` as NETWORK_FILTER;
}
