import { format, isToday, isYesterday } from 'date-fns';
import { de, enGB, enUS, es, fr, it, nl, ptBR, ru, tr, uk, vi } from 'date-fns/locale';

import { getCurrentLanguage } from './';

export const formatTransactionGroupDate = (time: Date | string) => {
  const date = new Date(time);

  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'd MMMM yyyy');
};

export const getDateLocale = () => {
  switch (getCurrentLanguage()) {
    case 'en-US':
      return enUS;
    case 'en-GB':
      return enGB;
    case 'de-DE':
      return de;
    case 'es-ES':
      return es;
    case 'fr-FR':
      return fr;
    case 'it-IT':
      return it;
    case 'nl-NL':
      return nl;
    case 'pt-BR':
      return ptBR;
    case 'ru-RU':
      return ru;
    case 'tr-TR':
      return tr;
    case 'uk-UA':
      return uk;
    case 'vi-VN':
      return vi;
    default:
      return enUS;
  }
};
