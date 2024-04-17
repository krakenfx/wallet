import { useState } from 'react';

import { NETWORK_FILTERS } from './types';

export const useNetworkFilter = () => {
  return useState<NETWORK_FILTERS[]>([]);
};
