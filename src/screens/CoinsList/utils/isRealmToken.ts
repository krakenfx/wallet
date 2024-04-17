import { RealmToken } from '@/realm/tokens';
import { isRealmObject } from '@/utils/isRealmObject';

import { RemoteAsset } from '../types';

export const isRealmToken = (token: RealmToken | RemoteAsset): token is RealmToken => isRealmObject(token);
