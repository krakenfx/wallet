import { format, isToday, isYesterday } from 'date-fns';

import loc from '/loc';
import type { LanguageTag } from '/loc';
import { getDateLocale } from '/loc/date';

export const formatTransactionGroupDate = (time: Date | string, currentLanguage: LanguageTag) => {
  const date = new Date(time);

  if (isToday(date)) {
    return loc._.today;
  }

  if (isYesterday(date)) {
    return loc._.yesterday;
  }

  return format(date, 'd MMMM yyyy', { locale: getDateLocale(currentLanguage) });
};
