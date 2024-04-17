import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';

import { superFetch } from '@/api/base/superFetch';

const NFT_IMAGE_IS_SVG: Record<string, boolean> = {};

(async () => {
  const cacheValue = await AsyncStorage.getItem('isSvgCache');

  if (cacheValue) {
    Object.assign(NFT_IMAGE_IS_SVG, JSON.parse(cacheValue));
  }
})();

export function isContentTypeSvg(contentType: string) {
  return contentType === 'image/svg+xml';
}

export async function isSvgImage(imageUrl?: string | null) {
  if (!imageUrl) {
    return;
  }

  const cached = NFT_IMAGE_IS_SVG[imageUrl];
  if (typeof cached === 'boolean') {
    return cached;
  }

  const result = await superFetch(imageUrl, {
    method: 'HEAD',
  });

  const isSvg = isContentTypeSvg(result.headers.get('content-type') ?? '');

  NFT_IMAGE_IS_SVG[imageUrl] = isSvg;
  persistCache();

  return isSvg;
}

const persistCache = debounce(() => {
  AsyncStorage.setItem('isSvgCache', JSON.stringify(NFT_IMAGE_IS_SVG));
}, 5000);
