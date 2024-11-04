import type { RemoteAsset } from '@/types';

import type { Item } from '../types';

export function isRemoteAsset(item: Item): item is RemoteAsset {
  return 'type' in item && item.type === 'remoteAsset';
}
