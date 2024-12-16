import { getNetworkFilterFromCaip } from '@/components/NetworkFilter/getNetworkFilterFromCaip';
import type { UINetworkFilter } from '@/components/NetworkFilter/types';
import { Networks } from '@/onChain/wallets/registry';

import { isSwapSupportedForNetwork } from './utils/isSwapSupportedForToken';

export const SOURCE_ASSET_SHEET_OFFSET = 105;
export const TARGET_ASSET_SHEET_OFFSET = 200;
export const SWAP_LIST_CACHE_DURATION = 3600 * 1000;
export const ROUTE_VALIDITY_PERIOD_MS = 45 * 1000;
export const ROUTE_OPTIONS_FLASH_START = ROUTE_VALIDITY_PERIOD_MS - 2 * 1000;
export const ROUTE_OPTIONS_FLASH_TRIGGER = ROUTE_OPTIONS_FLASH_START / ROUTE_VALIDITY_PERIOD_MS;
export const ROUTE_OPTIONS_FLASH_OPACITY_STEPS = [0.2, 1, 0.2, 1, 0.2];

export const SWAP_NETWORKS = Object.values(Networks).filter(isSwapSupportedForNetwork);
export const SWAP_NETWORKS_CAIP_IDS = SWAP_NETWORKS.map(n => n.caipId);
export const SWAP_NETWORK_FILTER = SWAP_NETWORKS_CAIP_IDS.map(getNetworkFilterFromCaip);
export const SWAP_NETWORK_UI_FILTER: UINetworkFilter[] = ['all', ...SWAP_NETWORK_FILTER];

export const SUCCESS_TIMEOUT = 2000;

export enum BroadcastState {
  NONE = 'NONE',
  WARNING = 'WARNING',
  LOADING = 'LOADING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}
