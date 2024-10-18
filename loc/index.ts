import Localization from 'react-localization';

import de_DE from './de-DE.json';
import en_GB from './en-GB.json';
import en_US from './en-US.json';
import es_ES from './es-ES.json';
import fr_FR from './fr-FR.json';
import it_IT from './it-IT.json';

import { languages } from './languages';
import nl_NL from './nl-NL.json';
import pl_PL from './pl-PL.json';
import pt_BR from './pt-BR.json';
import ru_RU from './ru-RU.json';
import tr_TR from './tr-TR.json';
import uk_UA from './uk-UA.json';
import vi_VN from './vi-VN.json';

export type LanguageTag = (typeof languages)[number]['tag'];

type BackendSupportedLanguages = 'en' | 'de' | 'es' | 'fr' | 'it' | 'pt' | 'ru' | 'vi' | 'pl';


export const getIanaLanguage = (): BackendSupportedLanguages => {
  switch (getCurrentLanguage()) {
    case 'en-US':
      return 'en';
    case 'de-DE':
      return 'de';
    case 'es-ES':
      return 'es';
    case 'fr-FR':
      return 'fr';
    case 'it-IT':
      return 'it';
    case 'pt-BR':
      return 'pt';
    case 'pl-PL':
      return 'pl';
    case 'ru-RU':
      return 'ru';
    case 'vi-VN':
      return 'vi';
    default:
      return 'en';
  }
};

type StringsJSON = typeof en_US;

const config = {
  'en-US': en_US,
  'en-GB': en_GB,
  'de-DE': de_DE,
  'es-ES': es_ES,
  'fr-FR': fr_FR,
  'it-IT': it_IT,
  'nl-NL': nl_NL,
  'pt-BR': pt_BR,
  'pl-PL': pl_PL,
  'ru-RU': ru_RU,
  'tr-TR': tr_TR,
  'uk-UA': uk_UA,
  'vi-VN': vi_VN,
} satisfies Partial<Record<LanguageTag, object>>;


export const loc = new Localization<StringsJSON>(config as Record<LanguageTag, StringsJSON>);

export const getCurrentLanguage = () => loc.getLanguage() as LanguageTag;

export const saveLanguage = (tag: LanguageTag) => loc.setLanguage(tag);

export default loc;
