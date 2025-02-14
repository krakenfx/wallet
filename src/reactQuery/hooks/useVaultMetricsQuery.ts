import { useQuery } from '@tanstack/react-query';

import { interpolateMultiDimensionalDataset } from '@/utils/interpolateDataset';

export type TimePeriod = 'ALL' | 'YEAR' | 'MONTH' | 'WEEK' | 'DAY';

const SIX_HOURS = 6 * 3600000;
const TARGET_DATASET_LENGTH = 36;
const ONE_HOUR_IN_SECONDS = 3600;
const THIRTY_DAYS_IN_SECONDS = 2592000;

const VAULT_METRICS_PARAMS: Record<TimePeriod, [{ address: string; network: string }, { count: number; intervalInSeconds: number }]> = {
  ['DAY']: [
    { address: '0xd63070114470f685b75B74D60EEc7c1113d33a3D', network: 'mainnet' },
    { count: 24, intervalInSeconds: ONE_HOUR_IN_SECONDS },
  ],
  ['WEEK']: [
    { address: '0xd63070114470f685b75B74D60EEc7c1113d33a3D', network: 'mainnet' },
    { count: 14, intervalInSeconds: 12 * ONE_HOUR_IN_SECONDS },
  ],
  ['MONTH']: [
    { address: '0xd63070114470f685b75B74D60EEc7c1113d33a3D', network: 'mainnet' },
    { count: 31, intervalInSeconds: 24 * ONE_HOUR_IN_SECONDS },
  ],
  ['YEAR']: [
    { address: '0xd63070114470f685b75B74D60EEc7c1113d33a3D', network: 'mainnet' },
    { count: 13, intervalInSeconds: THIRTY_DAYS_IN_SECONDS },
  ],
  ['ALL']: [
    { address: '0xd63070114470f685b75B74D60EEc7c1113d33a3D', network: 'mainnet' },
    { count: 61, intervalInSeconds: THIRTY_DAYS_IN_SECONDS },
  ],
};

export const useVaultMetricsQuery = (timePeriod: TimePeriod) => {
  const queryKey = 'defi-vault-metrics';
  const [vault, dataPoint] = VAULT_METRICS_PARAMS[timePeriod];

  return useQuery({
    queryKey: [queryKey, vault.address, vault.network, dataPoint.count, dataPoint.intervalInSeconds],
    staleTime: SIX_HOURS,
    gcTime: Infinity,
    queryFn: () => fetchVaultMetrics(vault, dataPoint),
  });
};

export type VaultMetricsDataPoint = {
  timestamp: number;
  blockNumber: number;
  apy: {
    base: number;
    rewards: number;
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

export type VaultMetricsResult = DataPointSimple[];

type DataPoint = { count: number; intervalInSeconds: number };
type Vault = { address: string; network: string };

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

async function fetchVaultMetrics(vault: Vault, dataPoint: DataPoint): Promise<VaultMetricsResult> {
  const fromTimestamp = calculateEarliestTimestamp(dataPoint.intervalInSeconds, dataPoint.count);
  vault;
  fromTimestamp;

  return new Promise(resolve => {
    setTimeout(() => resolve(interpolateMultiDimensionalDataset(selectDataPointSimple(getMockData(dataPoint)), TARGET_DATASET_LENGTH)), 500);
  });
}

const getMockData = (dataPoint: DataPoint) => {
  return mockData[dataPoint.count + ':' + dataPoint.intervalInSeconds] ?? [];
};

function selectDataPointSimple(data: VaultMetricsDataPoint[]): DataPointSimple[] {
  return data.map(d => ({ timestamp: d.timestamp, apy: d.apy.total, tvl: Number(d.tvlDetails.tvlUsd) }));
}

const mockData = {
  [24 + ':' + 3600]: [
    {
      timestamp: 1736351999,
      blockNumber: 21580811,
      apy: {
        base: 2565,
        rewards: 3292,
        total: 5857,
      },
      tvlDetails: {
        tvlNative: '126139055972',
        tvlUsd: '126114',
        lockedNative: '101158662472',
        lockedUsd: '101139',
        liquidNative: '24980393500',
        liquidUsd: '24975',
      },
    },
    {
      timestamp: 1736355599,
      blockNumber: 21581109,
      apy: {
        base: 1826,
        rewards: 3625,
        total: 5451,
      },
      tvlDetails: {
        tvlNative: '126140598137',
        tvlUsd: '126116',
        lockedNative: '101160204637',
        lockedUsd: '101141',
        liquidNative: '24980393500',
        liquidUsd: '24975',
      },
    },
    {
      timestamp: 1736359199,
      blockNumber: 21581409,
      apy: {
        base: 1589,
        rewards: 3723,
        total: 5312,
      },
      tvlDetails: {
        tvlNative: '126142140325',
        tvlUsd: '126117',
        lockedNative: '101161746825',
        lockedUsd: '101142',
        liquidNative: '24980393500',
        liquidUsd: '24975',
      },
    },
    {
      timestamp: 1736362799,
      blockNumber: 21581709,
      apy: {
        base: 1473,
        rewards: 3783,
        total: 5256,
      },
      tvlDetails: {
        tvlNative: '126143682536',
        tvlUsd: '126119',
        lockedNative: '101163289036',
        lockedUsd: '101144',
        liquidNative: '24980393500',
        liquidUsd: '24975',
      },
    },
    {
      timestamp: 1736366399,
      blockNumber: 21582007,
      apy: {
        base: 1404,
        rewards: 3820,
        total: 5224,
      },
      tvlDetails: {
        tvlNative: '126145224771',
        tvlUsd: '126126',
        lockedNative: '101164831271',
        lockedUsd: '101150',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736369999,
      blockNumber: 21582306,
      apy: {
        base: 1358,
        rewards: 3842,
        total: 5200,
      },
      tvlDetails: {
        tvlNative: '126146767030',
        tvlUsd: '126128',
        lockedNative: '101166373530',
        lockedUsd: '101152',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736373599,
      blockNumber: 21582604,
      apy: {
        base: 1325,
        rewards: 3859,
        total: 5184,
      },
      tvlDetails: {
        tvlNative: '126148309312',
        tvlUsd: '126129',
        lockedNative: '101167915812',
        lockedUsd: '101153',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736377199,
      blockNumber: 21582904,
      apy: {
        base: 1300,
        rewards: 3883,
        total: 5183,
      },
      tvlDetails: {
        tvlNative: '126149851618',
        tvlUsd: '126131',
        lockedNative: '101169458118',
        lockedUsd: '101155',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736380799,
      blockNumber: 21583203,
      apy: {
        base: 1281,
        rewards: 3860,
        total: 5141,
      },
      tvlDetails: {
        tvlNative: '126151393947',
        tvlUsd: '126132',
        lockedNative: '101171000447',
        lockedUsd: '101156',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736384399,
      blockNumber: 21583500,
      apy: {
        base: 1266,
        rewards: 3878,
        total: 5144,
      },
      tvlDetails: {
        tvlNative: '126152936300',
        tvlUsd: '126134',
        lockedNative: '101172542800',
        lockedUsd: '101158',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736387999,
      blockNumber: 21583800,
      apy: {
        base: 1254,
        rewards: 3858,
        total: 5112,
      },
      tvlDetails: {
        tvlNative: '126154478676',
        tvlUsd: '126135',
        lockedNative: '101174085176',
        lockedUsd: '101159',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736391599,
      blockNumber: 21584098,
      apy: {
        base: 1243,
        rewards: 3841,
        total: 5084,
      },
      tvlDetails: {
        tvlNative: '126156021076',
        tvlUsd: '126137',
        lockedNative: '101175627576',
        lockedUsd: '101161',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736395199,
      blockNumber: 21584398,
      apy: {
        base: 1235,
        rewards: 3827,
        total: 5062,
      },
      tvlDetails: {
        tvlNative: '126157563499',
        tvlUsd: '126138',
        lockedNative: '101177169999',
        lockedUsd: '101162',
        liquidNative: '24980393500',
        liquidUsd: '24976',
      },
    },
    {
      timestamp: 1736398799,
      blockNumber: 21584697,
      apy: {
        base: 1194,
        rewards: 3815,
        total: 5009,
      },
      tvlDetails: {
        tvlNative: '126158511004',
        tvlUsd: '126139',
        lockedNative: '76693021966',
        lockedUsd: '76682',
        liquidNative: '49465489038',
        liquidUsd: '49457',
      },
    },
    {
      timestamp: 1736402399,
      blockNumber: 21584995,
      apy: {
        base: 1156,
        rewards: 3805,
        total: 4961,
      },
      tvlDetails: {
        tvlNative: '126159397275',
        tvlUsd: '126140',
        lockedNative: '76693908237',
        lockedUsd: '76683',
        liquidNative: '49465489038',
        liquidUsd: '49457',
      },
    },
    {
      timestamp: 1736405999,
      blockNumber: 21585291,
      apy: {
        base: 1123,
        rewards: 3797,
        total: 4920,
      },
      tvlDetails: {
        tvlNative: '126160283557',
        tvlUsd: '126141',
        lockedNative: '76694794519',
        lockedUsd: '76684',
        liquidNative: '49465489038',
        liquidUsd: '49457',
      },
    },
    {
      timestamp: 1736409599,
      blockNumber: 21585590,
      apy: {
        base: 1093,
        rewards: 3789,
        total: 4882,
      },
      tvlDetails: {
        tvlNative: '126161169849',
        tvlUsd: '126142',
        lockedNative: '76695680811',
        lockedUsd: '76685',
        liquidNative: '49465489038',
        liquidUsd: '49457',
      },
    },
    {
      timestamp: 1736413199,
      blockNumber: 21585889,
      apy: {
        base: 1067,
        rewards: 3782,
        total: 4849,
      },
      tvlDetails: {
        tvlNative: '126162056151',
        tvlUsd: '126143',
        lockedNative: '76696567113',
        lockedUsd: '76685',
        liquidNative: '49465489038',
        liquidUsd: '49458',
      },
    },
    {
      timestamp: 1736416799,
      blockNumber: 21586186,
      apy: {
        base: 1044,
        rewards: 3773,
        total: 4817,
      },
      tvlDetails: {
        tvlNative: '126162942463',
        tvlUsd: '126144',
        lockedNative: '76697453425',
        lockedUsd: '76686',
        liquidNative: '49465489038',
        liquidUsd: '49458',
      },
    },
    {
      timestamp: 1736420399,
      blockNumber: 21586484,
      apy: {
        base: 1023,
        rewards: 3764,
        total: 4787,
      },
      tvlDetails: {
        tvlNative: '126163828786',
        tvlUsd: '126145',
        lockedNative: '76698339748',
        lockedUsd: '76687',
        liquidNative: '49465489038',
        liquidUsd: '49458',
      },
    },
    {
      timestamp: 1736423999,
      blockNumber: 21586779,
      apy: {
        base: 1004,
        rewards: 3756,
        total: 4760,
      },
      tvlDetails: {
        tvlNative: '126164715119',
        tvlUsd: '126145',
        lockedNative: '76699226081',
        lockedUsd: '76688',
        liquidNative: '49465489038',
        liquidUsd: '49457',
      },
    },
    {
      timestamp: 1736427599,
      blockNumber: 21587079,
      apy: {
        base: 988,
        rewards: 3748,
        total: 4736,
      },
      tvlDetails: {
        tvlNative: '125162706931',
        tvlUsd: '125144',
        lockedNative: '76700112924',
        lockedUsd: '76689',
        liquidNative: '48462594007',
        liquidUsd: '48455',
      },
    },
    {
      timestamp: 1736431199,
      blockNumber: 21587376,
      apy: {
        base: 973,
        rewards: 3752,
        total: 4725,
      },
      tvlDetails: {
        tvlNative: '125163600422',
        tvlUsd: '125145',
        lockedNative: '76701006415',
        lockedUsd: '76690',
        liquidNative: '48462594007',
        liquidUsd: '48455',
      },
    },
    {
      timestamp: 1736434799,
      blockNumber: 21587673,
      apy: {
        base: 959,
        rewards: 3757,
        total: 4716,
      },
      tvlDetails: {
        tvlNative: '125164493924',
        tvlUsd: '125145',
        lockedNative: '76701899917',
        lockedUsd: '76690',
        liquidNative: '48462594007',
        liquidUsd: '48455',
      },
    },
  ],
  [14 + ':' + 43200]: [
    {
      timestamp: 1734519599,
      blockNumber: 21428978,
      apy: {
        base: 1614,
        rewards: 535,
        total: 2149,
      },
      tvlDetails: {
        tvlNative: '165268549790462',
        tvlUsd: '165261939',
        lockedNative: '165268549790462',
        lockedUsd: '165261939',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734562799,
      blockNumber: 21432553,
      apy: {
        base: 3380,
        rewards: 740,
        total: 4120,
      },
      tvlDetails: {
        tvlNative: '219074068034701',
        tvlUsd: '219065305',
        lockedNative: '219074068034701',
        lockedUsd: '219065305',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734605999,
      blockNumber: 21436127,
      apy: {
        base: 3526,
        rewards: 726,
        total: 4252,
      },
      tvlDetails: {
        tvlNative: '261151837075348',
        tvlUsd: '261153539',
        lockedNative: '261151837075348',
        lockedUsd: '261153539',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734656399,
      blockNumber: 21440308,
      apy: {
        base: 3099,
        rewards: 705,
        total: 3804,
      },
      tvlDetails: {
        tvlNative: '249535044092224',
        tvlUsd: '249536671',
        lockedNative: '249535044092224',
        lockedUsd: '249536671',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734710399,
      blockNumber: 21444783,
      apy: {
        base: 3121,
        rewards: 627,
        total: 3748,
      },
      tvlDetails: {
        tvlNative: '321367237343895',
        tvlUsd: '321363628',
        lockedNative: '321367237343895',
        lockedUsd: '321363628',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734753599,
      blockNumber: 21448359,
      apy: {
        base: 2976,
        rewards: 632,
        total: 3608,
      },
      tvlDetails: {
        tvlNative: '370502862153060',
        tvlUsd: '370498701',
        lockedNative: '370502862153060',
        lockedUsd: '370498701',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734796799,
      blockNumber: 21451938,
      apy: {
        base: 2644,
        rewards: 621,
        total: 3265,
      },
      tvlDetails: {
        tvlNative: '396332849482256',
        tvlUsd: '396316996',
        lockedNative: '396332849482256',
        lockedUsd: '396316996',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734839999,
      blockNumber: 21455509,
      apy: {
        base: 2359,
        rewards: 605,
        total: 2964,
      },
      tvlDetails: {
        tvlNative: '374758619477443',
        tvlUsd: '374743629',
        lockedNative: '374758619477443',
        lockedUsd: '374743629',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734883199,
      blockNumber: 21459089,
      apy: {
        base: 2268,
        rewards: 586,
        total: 2854,
      },
      tvlDetails: {
        tvlNative: '362300172388211',
        tvlUsd: '362278434',
        lockedNative: '362300172388211',
        lockedUsd: '362278434',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734926399,
      blockNumber: 21462661,
      apy: {
        base: 2224,
        rewards: 570,
        total: 2794,
      },
      tvlDetails: {
        tvlNative: '362834031759732',
        tvlUsd: '362812261',
        lockedNative: '362834031759732',
        lockedUsd: '362812261',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734969599,
      blockNumber: 21466235,
      apy: {
        base: 2136,
        rewards: 562,
        total: 2698,
      },
      tvlDetails: {
        tvlNative: '328689126075138',
        tvlUsd: '328675284',
        lockedNative: '328689126075138',
        lockedUsd: '328675284',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735012799,
      blockNumber: 21469807,
      apy: {
        base: 2143,
        rewards: 565,
        total: 2708,
      },
      tvlDetails: {
        tvlNative: '315798698293007',
        tvlUsd: '315785400',
        lockedNative: '315798698293007',
        lockedUsd: '315785400',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735055999,
      blockNumber: 21473378,
      apy: {
        base: 2181,
        rewards: 569,
        total: 2750,
      },
      tvlDetails: {
        tvlNative: '337168700236277',
        tvlUsd: '337152624',
        lockedNative: '337168700236277',
        lockedUsd: '337152624',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735106399,
      blockNumber: 21477557,
      apy: {
        base: 2212,
        rewards: 575,
        total: 2787,
      },
      tvlDetails: {
        tvlNative: '371455313376661',
        tvlUsd: '371437602',
        lockedNative: '371455313376661',
        lockedUsd: '371437602',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
  ],
  [31 + ':' + 86400]: [
    {
      timestamp: 1734519599,
      blockNumber: 21428978,
      apy: {
        base: 1614,
        rewards: 535,
        total: 2149,
      },
      tvlDetails: {
        tvlNative: '165268549790462',
        tvlUsd: '165261939',
        lockedNative: '165268549790462',
        lockedUsd: '165261939',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734605999,
      blockNumber: 21436127,
      apy: {
        base: 3526,
        rewards: 726,
        total: 4252,
      },
      tvlDetails: {
        tvlNative: '261151837075348',
        tvlUsd: '261153539',
        lockedNative: '261151837075348',
        lockedUsd: '261153539',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734692399,
      blockNumber: 21443293,
      apy: {
        base: 3067,
        rewards: 629,
        total: 3696,
      },
      tvlDetails: {
        tvlNative: '270031723428453',
        tvlUsd: '270028690',
        lockedNative: '270031723428453',
        lockedUsd: '270028690',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734796799,
      blockNumber: 21451938,
      apy: {
        base: 2644,
        rewards: 621,
        total: 3265,
      },
      tvlDetails: {
        tvlNative: '396332849482256',
        tvlUsd: '396316996',
        lockedNative: '396332849482256',
        lockedUsd: '396316996',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734883199,
      blockNumber: 21459089,
      apy: {
        base: 2268,
        rewards: 586,
        total: 2854,
      },
      tvlDetails: {
        tvlNative: '362300172388211',
        tvlUsd: '362278434',
        lockedNative: '362300172388211',
        lockedUsd: '362278434',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734969599,
      blockNumber: 21466235,
      apy: {
        base: 2136,
        rewards: 562,
        total: 2698,
      },
      tvlDetails: {
        tvlNative: '328689126075138',
        tvlUsd: '328675284',
        lockedNative: '328689126075138',
        lockedUsd: '328675284',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735055999,
      blockNumber: 21473378,
      apy: {
        base: 2181,
        rewards: 569,
        total: 2750,
      },
      tvlDetails: {
        tvlNative: '337168700236277',
        tvlUsd: '337152624',
        lockedNative: '337168700236277',
        lockedUsd: '337152624',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735142399,
      blockNumber: 21480542,
      apy: {
        base: 2235,
        rewards: 579,
        total: 2814,
      },
      tvlDetails: {
        tvlNative: '389840390003448',
        tvlUsd: '389842124',
        lockedNative: '389840390003448',
        lockedUsd: '389842124',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735228799,
      blockNumber: 21487693,
      apy: {
        base: 2090,
        rewards: 570,
        total: 2660,
      },
      tvlDetails: {
        tvlNative: '496650879067060',
        tvlUsd: '496655999',
        lockedNative: '496650879067060',
        lockedUsd: '496655999',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735315199,
      blockNumber: 21494849,
      apy: {
        base: 1972,
        rewards: 575,
        total: 2547,
      },
      tvlDetails: {
        tvlNative: '495012615021087',
        tvlUsd: '494987305',
        lockedNative: '495012615021087',
        lockedUsd: '494987305',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735401599,
      blockNumber: 21502017,
      apy: {
        base: 1880,
        rewards: 554,
        total: 2434,
      },
      tvlDetails: {
        tvlNative: '484504578659581',
        tvlUsd: '484504578',
        lockedNative: '484504578659581',
        lockedUsd: '484504578',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735487999,
      blockNumber: 21509181,
      apy: {
        base: 1888,
        rewards: 545,
        total: 2433,
      },
      tvlDetails: {
        tvlNative: '481052070351652',
        tvlUsd: '481038283',
        lockedNative: '481052070351652',
        lockedUsd: '481038283',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735574399,
      blockNumber: 21516344,
      apy: {
        base: 1887,
        rewards: 538,
        total: 2425,
      },
      tvlDetails: {
        tvlNative: '470529792295279',
        tvlUsd: '470548613',
        lockedNative: '470529792295279',
        lockedUsd: '470548613',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735660799,
      blockNumber: 21523501,
      apy: {
        base: 1775,
        rewards: 523,
        total: 2298,
      },
      tvlDetails: {
        tvlNative: '448291215547285',
        tvlUsd: '448284047',
        lockedNative: '448291215547285',
        lockedUsd: '448284047',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735804799,
      blockNumber: 21535449,
      apy: {
        base: 1598,
        rewards: 503,
        total: 2101,
      },
      tvlDetails: {
        tvlNative: '456545683001069',
        tvlUsd: '456531986',
        lockedNative: '456545683001069',
        lockedUsd: '456531986',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735891199,
      blockNumber: 21542621,
      apy: {
        base: 1537,
        rewards: 484,
        total: 2021,
      },
      tvlDetails: {
        tvlNative: '506633722605432',
        tvlUsd: '506636615',
        lockedNative: '506633722605432',
        lockedUsd: '506636615',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735977599,
      blockNumber: 21549778,
      apy: {
        base: 1491,
        rewards: 474,
        total: 1965,
      },
      tvlDetails: {
        tvlNative: '472197791115782',
        tvlUsd: '472188035',
        lockedNative: '472197791115782',
        lockedUsd: '472188035',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736063999,
      blockNumber: 21556945,
      apy: {
        base: 1453,
        rewards: 476,
        total: 1929,
      },
      tvlDetails: {
        tvlNative: '436565457453590',
        tvlUsd: '436544266',
        lockedNative: '436565457453590',
        lockedUsd: '436544266',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736150399,
      blockNumber: 21564090,
      apy: {
        base: 1403,
        rewards: 478,
        total: 1881,
      },
      tvlDetails: {
        tvlNative: '436793137550187',
        tvlUsd: '436782702',
        lockedNative: '436793137550187',
        lockedUsd: '436782702',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736236799,
      blockNumber: 21571259,
      apy: {
        base: 1379,
        rewards: 474,
        total: 1853,
      },
      tvlDetails: {
        tvlNative: '441214033644736',
        tvlUsd: '441190036',
        lockedNative: '441214033644736',
        lockedUsd: '441190036',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736323199,
      blockNumber: 21578418,
      apy: {
        base: 1367,
        rewards: 459,
        total: 1826,
      },
      tvlDetails: {
        tvlNative: '433816827939353',
        tvlUsd: '433801453',
        lockedNative: '433816827939353',
        lockedUsd: '433801453',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736409599,
      blockNumber: 21585590,
      apy: {
        base: 1349,
        rewards: 439,
        total: 1788,
      },
      tvlDetails: {
        tvlNative: '445595196424261',
        tvlUsd: '445544059',
        lockedNative: '445595196424261',
        lockedUsd: '445544059',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736495999,
      blockNumber: 21592743,
      apy: {
        base: 1345,
        rewards: 428,
        total: 1773,
      },
      tvlDetails: {
        tvlNative: '382415025909815',
        tvlUsd: '382399729',
        lockedNative: '382415025909815',
        lockedUsd: '382399729',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736582399,
      blockNumber: 21599906,
      apy: {
        base: 1878,
        rewards: 409,
        total: 2287,
      },
      tvlDetails: {
        tvlNative: '594466613850345',
        tvlUsd: '594443031',
        lockedNative: '594466613850345',
        lockedUsd: '594443031',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736668799,
      blockNumber: 21607074,
      apy: {
        base: 1963,
        rewards: 395,
        total: 2358,
      },
      tvlDetails: {
        tvlNative: '415453741020844',
        tvlUsd: '415428921',
        lockedNative: '415453741020844',
        lockedUsd: '415428921',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736755199,
      blockNumber: 21614231,
      apy: {
        base: 1996,
        rewards: 383,
        total: 2379,
      },
      tvlDetails: {
        tvlNative: '416113987716906',
        tvlUsd: '416057620',
        lockedNative: '416113987716906',
        lockedUsd: '416057620',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736841599,
      blockNumber: 21621386,
      apy: {
        base: 2023,
        rewards: 371,
        total: 2394,
      },
      tvlDetails: {
        tvlNative: '374485810823577',
        tvlUsd: '374458158',
        lockedNative: '374485810823577',
        lockedUsd: '374458158',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736935187,
      blockNumber: 21629144,
      apy: {
        base: 2049,
        rewards: 357,
        total: 2406,
      },
      tvlDetails: {
        tvlNative: '374636898921820',
        tvlUsd: '374619774',
        lockedNative: '374636898921820',
        lockedUsd: '374619774',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1737025199,
      blockNumber: 21636606,
      apy: {
        base: 2088,
        rewards: 355,
        total: 2443,
      },
      tvlDetails: {
        tvlNative: '373981726739555',
        tvlUsd: '373959299',
        lockedNative: '373981726739555',
        lockedUsd: '373959299',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
  ],
  [13 + ':' + 2592000]: [
    {
      timestamp: 1734519599,
      blockNumber: 21428978,
      apy: {
        base: 1614,
        rewards: 535,
        total: 2149,
      },
      tvlDetails: {
        tvlNative: '165268549790462',
        tvlUsd: '165261939',
        lockedNative: '165268549790462',
        lockedUsd: '165261939',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734605999,
      blockNumber: 21436127,
      apy: {
        base: 3526,
        rewards: 726,
        total: 4252,
      },
      tvlDetails: {
        tvlNative: '261151837075348',
        tvlUsd: '261153539',
        lockedNative: '261151837075348',
        lockedUsd: '261153539',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734692399,
      blockNumber: 21443293,
      apy: {
        base: 3067,
        rewards: 629,
        total: 3696,
      },
      tvlDetails: {
        tvlNative: '270031723428453',
        tvlUsd: '270028690',
        lockedNative: '270031723428453',
        lockedUsd: '270028690',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734796799,
      blockNumber: 21451938,
      apy: {
        base: 2644,
        rewards: 621,
        total: 3265,
      },
      tvlDetails: {
        tvlNative: '396332849482256',
        tvlUsd: '396316996',
        lockedNative: '396332849482256',
        lockedUsd: '396316996',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734883199,
      blockNumber: 21459089,
      apy: {
        base: 2268,
        rewards: 586,
        total: 2854,
      },
      tvlDetails: {
        tvlNative: '362300172388211',
        tvlUsd: '362278434',
        lockedNative: '362300172388211',
        lockedUsd: '362278434',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734969599,
      blockNumber: 21466235,
      apy: {
        base: 2136,
        rewards: 562,
        total: 2698,
      },
      tvlDetails: {
        tvlNative: '328689126075138',
        tvlUsd: '328675284',
        lockedNative: '328689126075138',
        lockedUsd: '328675284',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735055999,
      blockNumber: 21473378,
      apy: {
        base: 2181,
        rewards: 569,
        total: 2750,
      },
      tvlDetails: {
        tvlNative: '337168700236277',
        tvlUsd: '337152624',
        lockedNative: '337168700236277',
        lockedUsd: '337152624',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735142399,
      blockNumber: 21480542,
      apy: {
        base: 2238,
        rewards: 582,
        total: 2820,
      },
      tvlDetails: {
        tvlNative: '389840390003448',
        tvlUsd: '389842124',
        lockedNative: '389840390003448',
        lockedUsd: '389842124',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735228799,
      blockNumber: 21487693,
      apy: {
        base: 2203,
        rewards: 586,
        total: 2789,
      },
      tvlDetails: {
        tvlNative: '496650879067060',
        tvlUsd: '496655999',
        lockedNative: '496650879067060',
        lockedUsd: '496655999',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735315199,
      blockNumber: 21494849,
      apy: {
        base: 2148,
        rewards: 581,
        total: 2729,
      },
      tvlDetails: {
        tvlNative: '495012615021087',
        tvlUsd: '494987305',
        lockedNative: '495012615021087',
        lockedUsd: '494987305',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735401599,
      blockNumber: 21502017,
      apy: {
        base: 2055,
        rewards: 568,
        total: 2623,
      },
      tvlDetails: {
        tvlNative: '484504578659581',
        tvlUsd: '484504578',
        lockedNative: '484504578659581',
        lockedUsd: '484504578',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735487999,
      blockNumber: 21509181,
      apy: {
        base: 2000,
        rewards: 555,
        total: 2555,
      },
      tvlDetails: {
        tvlNative: '481052070351652',
        tvlUsd: '481038283',
        lockedNative: '481052070351652',
        lockedUsd: '481038283',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735574399,
      blockNumber: 21516344,
      apy: {
        base: 1972,
        rewards: 543,
        total: 2515,
      },
      tvlDetails: {
        tvlNative: '470529792295279',
        tvlUsd: '470548613',
        lockedNative: '470529792295279',
        lockedUsd: '470548613',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
  ],
  [61 + ':' + 2592000]: [
    {
      timestamp: 1734519599,
      blockNumber: 21428978,
      apy: {
        base: 1614,
        rewards: 535,
        total: 2149,
      },
      tvlDetails: {
        tvlNative: '165268549790462',
        tvlUsd: '165261939',
        lockedNative: '165268549790462',
        lockedUsd: '165261939',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734605999,
      blockNumber: 21436127,
      apy: {
        base: 3526,
        rewards: 726,
        total: 4252,
      },
      tvlDetails: {
        tvlNative: '261151837075348',
        tvlUsd: '261153539',
        lockedNative: '261151837075348',
        lockedUsd: '261153539',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734692399,
      blockNumber: 21443293,
      apy: {
        base: 3067,
        rewards: 629,
        total: 3696,
      },
      tvlDetails: {
        tvlNative: '270031723428453',
        tvlUsd: '270028690',
        lockedNative: '270031723428453',
        lockedUsd: '270028690',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734796799,
      blockNumber: 21451938,
      apy: {
        base: 2644,
        rewards: 621,
        total: 3265,
      },
      tvlDetails: {
        tvlNative: '396332849482256',
        tvlUsd: '396316996',
        lockedNative: '396332849482256',
        lockedUsd: '396316996',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734883199,
      blockNumber: 21459089,
      apy: {
        base: 2268,
        rewards: 586,
        total: 2854,
      },
      tvlDetails: {
        tvlNative: '362300172388211',
        tvlUsd: '362278434',
        lockedNative: '362300172388211',
        lockedUsd: '362278434',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1734969599,
      blockNumber: 21466235,
      apy: {
        base: 2136,
        rewards: 562,
        total: 2698,
      },
      tvlDetails: {
        tvlNative: '328689126075138',
        tvlUsd: '328675284',
        lockedNative: '328689126075138',
        lockedUsd: '328675284',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735055999,
      blockNumber: 21473378,
      apy: {
        base: 2181,
        rewards: 569,
        total: 2750,
      },
      tvlDetails: {
        tvlNative: '337168700236277',
        tvlUsd: '337152624',
        lockedNative: '337168700236277',
        lockedUsd: '337152624',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735142399,
      blockNumber: 21480542,
      apy: {
        base: 2238,
        rewards: 582,
        total: 2820,
      },
      tvlDetails: {
        tvlNative: '389840390003448',
        tvlUsd: '389842124',
        lockedNative: '389840390003448',
        lockedUsd: '389842124',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735228799,
      blockNumber: 21487693,
      apy: {
        base: 2203,
        rewards: 586,
        total: 2789,
      },
      tvlDetails: {
        tvlNative: '496650879067060',
        tvlUsd: '496655999',
        lockedNative: '496650879067060',
        lockedUsd: '496655999',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735315199,
      blockNumber: 21494849,
      apy: {
        base: 2148,
        rewards: 581,
        total: 2729,
      },
      tvlDetails: {
        tvlNative: '495012615021087',
        tvlUsd: '494987305',
        lockedNative: '495012615021087',
        lockedUsd: '494987305',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735401599,
      blockNumber: 21502017,
      apy: {
        base: 2055,
        rewards: 568,
        total: 2623,
      },
      tvlDetails: {
        tvlNative: '484504578659581',
        tvlUsd: '484504578',
        lockedNative: '484504578659581',
        lockedUsd: '484504578',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735487999,
      blockNumber: 21509181,
      apy: {
        base: 2000,
        rewards: 555,
        total: 2555,
      },
      tvlDetails: {
        tvlNative: '481052070351652',
        tvlUsd: '481038283',
        lockedNative: '481052070351652',
        lockedUsd: '481038283',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735574399,
      blockNumber: 21516344,
      apy: {
        base: 1972,
        rewards: 543,
        total: 2515,
      },
      tvlDetails: {
        tvlNative: '470529792295279',
        tvlUsd: '470548613',
        lockedNative: '470529792295279',
        lockedUsd: '470548613',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735660799,
      blockNumber: 21523501,
      apy: {
        base: 1926,
        rewards: 537,
        total: 2463,
      },
      tvlDetails: {
        tvlNative: '448291215547285',
        tvlUsd: '448284047',
        lockedNative: '448291215547285',
        lockedUsd: '448284047',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735804799,
      blockNumber: 21535449,
      apy: {
        base: 1859,
        rewards: 539,
        total: 2398,
      },
      tvlDetails: {
        tvlNative: '456545683001069',
        tvlUsd: '456531986',
        lockedNative: '456545683001069',
        lockedUsd: '456531986',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735891199,
      blockNumber: 21542621,
      apy: {
        base: 1838,
        rewards: 533,
        total: 2371,
      },
      tvlDetails: {
        tvlNative: '506633722605432',
        tvlUsd: '506636615',
        lockedNative: '506633722605432',
        lockedUsd: '506636615',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1735977599,
      blockNumber: 21549778,
      apy: {
        base: 1796,
        rewards: 529,
        total: 2325,
      },
      tvlDetails: {
        tvlNative: '472197791115782',
        tvlUsd: '472188035',
        lockedNative: '472197791115782',
        lockedUsd: '472188035',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736063999,
      blockNumber: 21556945,
      apy: {
        base: 1761,
        rewards: 525,
        total: 2286,
      },
      tvlDetails: {
        tvlNative: '436565457453590',
        tvlUsd: '436544266',
        lockedNative: '436565457453590',
        lockedUsd: '436544266',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736150399,
      blockNumber: 21564090,
      apy: {
        base: 1734,
        rewards: 522,
        total: 2256,
      },
      tvlDetails: {
        tvlNative: '436793137550187',
        tvlUsd: '436782702',
        lockedNative: '436793137550187',
        lockedUsd: '436782702',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736236799,
      blockNumber: 21571259,
      apy: {
        base: 1718,
        rewards: 517,
        total: 2235,
      },
      tvlDetails: {
        tvlNative: '441214033644736',
        tvlUsd: '441190036',
        lockedNative: '441214033644736',
        lockedUsd: '441190036',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736323199,
      blockNumber: 21578418,
      apy: {
        base: 1700,
        rewards: 513,
        total: 2213,
      },
      tvlDetails: {
        tvlNative: '433816827939353',
        tvlUsd: '433801453',
        lockedNative: '433816827939353',
        lockedUsd: '433801453',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736409599,
      blockNumber: 21585590,
      apy: {
        base: 1678,
        rewards: 508,
        total: 2186,
      },
      tvlDetails: {
        tvlNative: '445595196424261',
        tvlUsd: '445544059',
        lockedNative: '445595196424261',
        lockedUsd: '445544059',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736495999,
      blockNumber: 21592743,
      apy: {
        base: 1673,
        rewards: 503,
        total: 2176,
      },
      tvlDetails: {
        tvlNative: '382415025909815',
        tvlUsd: '382399729',
        lockedNative: '382415025909815',
        lockedUsd: '382399729',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736582399,
      blockNumber: 21599906,
      apy: {
        base: 1822,
        rewards: 494,
        total: 2316,
      },
      tvlDetails: {
        tvlNative: '594466613850345',
        tvlUsd: '594443031',
        lockedNative: '594466613850345',
        lockedUsd: '594443031',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736668799,
      blockNumber: 21607074,
      apy: {
        base: 1823,
        rewards: 487,
        total: 2310,
      },
      tvlDetails: {
        tvlNative: '415453741020844',
        tvlUsd: '415428921',
        lockedNative: '415453741020844',
        lockedUsd: '415428921',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736755199,
      blockNumber: 21614231,
      apy: {
        base: 1810,
        rewards: 482,
        total: 2292,
      },
      tvlDetails: {
        tvlNative: '416113987716906',
        tvlUsd: '416057620',
        lockedNative: '416113987716906',
        lockedUsd: '416057620',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736841599,
      blockNumber: 21621386,
      apy: {
        base: 1802,
        rewards: 476,
        total: 2278,
      },
      tvlDetails: {
        tvlNative: '374485810823577',
        tvlUsd: '374458158',
        lockedNative: '374485810823577',
        lockedUsd: '374458158',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1736935187,
      blockNumber: 21629144,
      apy: {
        base: 1790,
        rewards: 470,
        total: 2260,
      },
      tvlDetails: {
        tvlNative: '374636898921820',
        tvlUsd: '374619774',
        lockedNative: '374636898921820',
        lockedUsd: '374619774',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
    {
      timestamp: 1737025199,
      blockNumber: 21636606,
      apy: {
        base: 1777,
        rewards: 468,
        total: 2245,
      },
      tvlDetails: {
        tvlNative: '373981726739555',
        tvlUsd: '373959299',
        lockedNative: '373981726739555',
        lockedUsd: '373959299',
        liquidNative: '0',
        liquidUsd: '0',
      },
    },
  ],
};
