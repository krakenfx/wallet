import { decode } from 'bip21';

type BIP21Data = ReturnType<typeof decode>;
const PREFIX_REGEX = /^[^:]*:/;
const SUFFIX_REGEX = /[@?].*/;

export const decodeQrCodeAddress = (data?: string): string | BIP21Data | undefined => {
  if (data) {
    try {
      return decode(data);
    } catch (e) {
      
      return data.replace(PREFIX_REGEX, '').replace(SUFFIX_REGEX, '');
    }
  }
};
