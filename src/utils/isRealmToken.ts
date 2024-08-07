import { RealmToken } from '@/realm/tokens';
import { RemoteAsset } from '@/types';
import { isRealmObject } from '@/utils/isRealmObject';

export const isRealmToken = (token: RealmToken | RemoteAsset): token is RealmToken => isRealmObject(token);
