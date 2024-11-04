import type { ExploreContentRow } from '@/api/types';

const isContentRow = (row: unknown): row is ExploreContentRow => {
  const xRow = row as ExploreContentRow;
  return xRow.content !== undefined && xRow.variant !== undefined && xRow.id !== undefined;
};

export const isValidExploreContent = (content: unknown): content is ExploreContentRow[] => {
  if (!Array.isArray(content)) {
    return false;
  }
  return content.every(isContentRow);
};
