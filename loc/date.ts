import { de, enGB, enUS, es, fr, it, nl, pl, ptBR, ru, tr, uk, vi } from 'date-fns/locale';

import { LanguageTag, getCurrentLanguage } from './';

export const getDateLocale = (currentLanguage?: LanguageTag) => {
  const _currentLanguage = currentLanguage || getCurrentLanguage();

  switch (_currentLanguage) {
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
    case 'pl-PL':
      return pl;
    default:
      return enUS;
  }
};
