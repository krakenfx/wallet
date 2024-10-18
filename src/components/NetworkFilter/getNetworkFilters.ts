import { NETWORK_FILTERS, UINetworkFilters } from './types';

export function getNetworkFilters(wasPressed: UINetworkFilters, prevNetworkFilters: NETWORK_FILTERS[], allNetworkFiltersLength: number): NETWORK_FILTERS[] {
  
  if (wasPressed === 'all') {
    return [];
  }

  
  const prevNetworkFiltersSet = new Set(prevNetworkFilters);

  if (prevNetworkFiltersSet.has(wasPressed)) {
    prevNetworkFiltersSet.delete(wasPressed);
  } else {
    prevNetworkFiltersSet.add(wasPressed);
  }

  
  const areAllNetworkFiltersSelected = allNetworkFiltersLength === prevNetworkFiltersSet.size;
  if (areAllNetworkFiltersSelected) {
    return [];
  }

  return [...prevNetworkFiltersSet];
}
