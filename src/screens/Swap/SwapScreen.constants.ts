import { getNetworkFilterFromCaip } from '@/components/NetworkFilter/getNetworkFilterFromCaip';
import type { UINetworkFilter } from '@/components/NetworkFilter/types';
import { Networks } from '@/onChain/wallets/registry';

export const SOURCE_ASSET_SHEET_OFFSET = 105;
export const TARGET_ASSET_SHEET_OFFSET = 200;
export const SWAP_LIST_CACHE_DURATION = 3600 * 1000;
export const ROUTE_VALIDITY_PERIOD_MS = 45 * 1000;
export const ROUTE_OPTIONS_FLASH_START = ROUTE_VALIDITY_PERIOD_MS - 2 * 1000;
export const ROUTE_OPTIONS_FLASH_TRIGGER = ROUTE_OPTIONS_FLASH_START / ROUTE_VALIDITY_PERIOD_MS;
export const ROUTE_OPTIONS_FLASH_OPACITY_STEPS = [0.2, 1, 0.2, 1, 0.2];

export const SWAP_NETWORKS = [
  Networks.ethereum,
  Networks.ink,
  Networks.arbitrum,
  Networks.optimism,
  Networks.base,
  Networks.avalanche,
  Networks.linea,
  Networks.blast,
  Networks.polygon,
  Networks.solana,
];
export const SWAP_NETWORKS_CAIP_IDS = SWAP_NETWORKS.map(n => n.caipId);
export const SWAP_NETWORK_FILTER = SWAP_NETWORKS_CAIP_IDS.map(getNetworkFilterFromCaip);
export const SWAP_NETWORK_UI_FILTER: UINetworkFilter[] = ['all', ...SWAP_NETWORK_FILTER];

export const SUCCESS_TIMEOUT = 2000;
export const AMOUNT_TYPING_DEBOUNCE_DELAY = 800;

export enum BroadcastState {
  NONE = 'NONE',
  WARNING = 'WARNING',
  LOADING = 'LOADING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export const DEFAULT_SLIPPAGE = 0.5;
export const FIXED_SLIPPAGE_PRESET_OPTIONS = [0.5, 1, 3] as const;
export const SLIPPAGE_LOW = 0.5;
export const SLIPPAGE_HIGH = 5;
export const SLIPPAGE_UNSUPPORTED = 50;
