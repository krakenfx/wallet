import type { TopVaultsResponse } from '@/api/fetchTopVaults';
import type { CardData } from '@/components/DefiDiscoveryPreview/DefiDiscoveryPreview.types';
import { adaptTopVaultToCardData } from '@/utils/adaptTopVaultToCardData';

import { useTopVaultsQuery } from './useTopVaultsQuery';

const selectCardData = (topVaults: TopVaultsResponse): CardData[] => topVaults.bestVaults.map(adaptTopVaultToCardData);

export const useTopVaultsCardDataQuery = () => useTopVaultsQuery(selectCardData);
