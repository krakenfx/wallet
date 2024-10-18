import { getHarmony } from './base/apiFactory';
import { ExploreContentRow } from './types';

import { handleError } from '/helpers/errorHandler';

export async function fetchExploreFeed(): Promise<ExploreContentRow[]> {
  const harmony = await getHarmony();
  try {
    const { content } = await harmony.GET('/v1/explore', {});
    return content;
  } catch (err) {
    handleError(err, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    throw new Error('Error fetching explore feed');
  }
}
