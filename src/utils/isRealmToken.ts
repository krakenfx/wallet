import type { RealmToken } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';
import { isRealmObject } from '@/utils/isRealmObject';

export const isRealmToken = (token: RealmToken | RemoteAsset): token is RealmToken => isRealmObject(token);
