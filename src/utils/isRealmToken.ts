import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import type { RealmToken } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';
import { isRealmObject } from '@/utils/isRealmObject';

export const isRealmToken = (token: RealmToken | RemoteAsset | KrakenAssetSupported): token is RealmToken => isRealmObject(token);
