import type { RealmToken } from '@/realm/tokens';

import { isRealmObject } from './isRealmObject';

type Props = { assetId: string } | RealmToken;

export const tokenItemKeyExtractor = (item: Props, i: number) => {
  if (isRealmObject(item) && !item.isValid()) {
    return 'invalid_' + i;
  }

  return item.assetId;
};
