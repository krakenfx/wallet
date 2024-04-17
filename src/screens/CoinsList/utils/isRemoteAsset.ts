import { Item, RemoteAsset } from '../types';

export function isRemoteAsset(item: Item): item is RemoteAsset {
  return 'type' in item && item.type === 'remoteAsset';
}
