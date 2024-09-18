import { Locale, format } from 'date-fns';

export const formatPasskeyDate = (date: Date, locale?: Locale) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss', { locale });
};
