import { isValidExploreContent } from '@/screens/Explore/utils/isValidExploreContent';

import { getHarmony } from './base/apiFactory';

import type { ExploreContentRow } from './types';

import { handleError } from '/helpers/errorHandler';

export async function fetchExploreFeed(slug?: string): Promise<ExploreContentRow[]> {
  const harmony = await getHarmony();
  const path = slug ? '/v1/explore/{pageSlug}' : '/v1/explore';
  const params = slug ? { params: { path: { pageSlug: slug } } } : {};

  try {
    const { content } = await harmony.GET(path, params);

    if (!isValidExploreContent(content)) {
      throw new Error('invalid Explore Content data');
    }

    return content;
  } catch (err) {
    handleError(err, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    throw new Error('Error fetching explore feed');
  }
}
