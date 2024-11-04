import type { NETWORK_FILTER, UINetworkFilter } from './types';

export function getNetworkFilters(wasPressed: UINetworkFilter, prevNetworkFilters: NETWORK_FILTER[]): NETWORK_FILTER[] {
  
  if (wasPressed === 'all') {
    return [];
  }

  
  const prevNetworkFiltersSet = new Set(prevNetworkFilters);

  if (prevNetworkFiltersSet.has(wasPressed)) {
    prevNetworkFiltersSet.delete(wasPressed);
  } else {
    prevNetworkFiltersSet.add(wasPressed);
  }

  return [...prevNetworkFiltersSet];
}
