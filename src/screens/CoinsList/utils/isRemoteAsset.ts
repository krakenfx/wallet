import { RemoteAsset } from '@/types';

import { Item } from '../types';

export function isRemoteAsset(item: Item): item is RemoteAsset {
  return 'type' in item && item.type === 'remoteAsset';
}
