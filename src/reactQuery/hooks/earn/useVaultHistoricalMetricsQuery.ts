import { useQuery } from '@tanstack/react-query';

import { fetchVaultHistoricalMetrics } from '@/api/earn/fetchVaultHistoricalMetrics';
import { interpolateMultiDimensionalDataset } from '@/utils/interpolateDataset';

import { ONE_HOUR } from './consts';

export type TimePeriod = 'ALL' | 'YEAR' | 'MONTH' | 'WEEK' | 'DAY';

export const TARGET_DATASET_LENGTH = 36;
const ONE_HOUR_IN_SECONDS = 3600;
const THIRTY_DAYS_IN_SECONDS = 2592000;

const VAULT_METRICS_PARAMS: Record<TimePeriod, { count: number; intervalInSeconds: number }> = {
  ['DAY']: { count: 24, intervalInSeconds: ONE_HOUR_IN_SECONDS },
  ['WEEK']: { count: 14, intervalInSeconds: 12 * ONE_HOUR_IN_SECONDS },
  ['MONTH']: { count: 30, intervalInSeconds: 24 * ONE_HOUR_IN_SECONDS },
  ['YEAR']: { count: 13, intervalInSeconds: THIRTY_DAYS_IN_SECONDS },
  ['ALL']: { count: 61, intervalInSeconds: THIRTY_DAYS_IN_SECONDS },
};

export const useVaultHistoricalMetricsQuery = (vaultAddress: string, vaultNetwork: string, timePeriod: TimePeriod) => {
  const queryKey = 'defi-vault-metrics';
  const dataPoint = VAULT_METRICS_PARAMS[timePeriod];
  const fromTimestamp = calculateEarliestTimestamp(dataPoint.intervalInSeconds, dataPoint.count);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  return useQuery({
    queryKey: [queryKey, vaultAddress, vaultNetwork, dataPoint.count, dataPoint.intervalInSeconds],
    staleTime: ONE_HOUR,
    gcTime: Infinity,
    select: d => interpolateMultiDimensionalDataset(selectDataPointSimple(d), TARGET_DATASET_LENGTH),
    queryFn: () =>
      fetchVaultHistoricalMetrics(vaultNetwork, vaultAddress, {
        perPage: dataPoint.count,
        fromTimestamp,
        toTimestamp: currentTimestamp,
        granularity: dataPoint.intervalInSeconds,
      }),
  });
};

export type VaultMetricsDataPoint = {
  timestamp: number;
  blockNumber: number;
  apy: {
    base: number;
    rewards?: number;
    total: number;
  };
  tvlDetails: {
    tvlNative: string;
    tvlUsd: string;
    lockedNative: string;
    lockedUsd: string;
    liquidNative: string;
    liquidUsd: string;
  };
};

export type DataPointSimple = {
  timestamp: number;
  apy: number;
  tvl: number;
};

function calculateEarliestTimestamp(intervalInSeconds: number, numberOfIntervals: number): number {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const earliestTimestamp = currentTimestamp - numberOfIntervals * intervalInSeconds;

  return earliestTimestamp;
}

function selectDataPointSimple(data: VaultMetricsDataPoint[]): DataPointSimple[] {
  return data.map(d => ({ timestamp: d.timestamp, apy: d.apy.total, tvl: Number(d.tvlDetails.tvlUsd) }));
}
