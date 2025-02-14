import { startOfDay } from 'date-fns';
import groupBy from 'lodash/groupBy';

import { formatDate } from './formatDate';

import type { LanguageTag } from '/loc';

type Item = { time: number } | { timestamp: number };

export const groupItemsByDate = <T extends Item, R = string>(items: T[], language: LanguageTag, dateWrapper?: (dateFormatted: string) => R) => {
  return Object.entries(groupBy(items, item => startOfDay(('time' in item ? item.time : item.timestamp) * 1000)))
    .map(([date, items_]) => {
      const dateFormatted = formatDate(date, language);
      const dateItem = dateWrapper?.(dateFormatted) ?? (dateFormatted as R);

      return [dateItem, ...items_];
    })
    .flat();
};
