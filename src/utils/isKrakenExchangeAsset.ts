import type { KrakenAssetSupported } from '@/reactQuery/hooks/krakenConnect/types';
import type { RealmToken } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';

export const isKrakenExchangeAsset = (token: RealmToken | RemoteAsset | KrakenAssetSupported): token is KrakenAssetSupported => 'isSupported' in token;
