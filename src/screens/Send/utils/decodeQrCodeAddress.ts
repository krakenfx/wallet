import { decode } from 'bip21';

const PREFIX_REGEX = /^[^:]*:/;
const SUFFIX_REGEX = /[@?].*/;

export interface DecodedQrCodeAddress {
  address: string;
  isEip681: boolean;
  options?: {
    amount?: number;
  };
}

const EIP_681_REGEX = /^ethereum:0x[a-fA-F0-9]{40}(@\d+)?\/[a-zA-Z_][a-zA-Z0-9_]*\?/;

const parseEip681Address = (data: string): string | undefined => {
  try {
    const url = new URL(data);

    return url.searchParams.get('address') || undefined;
  } catch (e) {
    const addressMatch = data.match(/[?&]address=([^&]*)/);
    return addressMatch ? decodeURIComponent(addressMatch[1]) : undefined;
  }
};

const isEip681Format = (data: string): boolean => {
  return EIP_681_REGEX.test(data);
};

export const decodeQrCodeAddress = (data?: string): DecodedQrCodeAddress | undefined => {
  if (!data) {
    return undefined;
  }

  if (isEip681Format(data)) {
    const address = parseEip681Address(data);
    if (address) {
      return {
        address,
        isEip681: true,
      };
    }
  }

  try {
    const bip21Data = decode(data);
    return {
      address: bip21Data.address,
      isEip681: false,
      options: bip21Data.options,
    };
  } catch (e) {
    const cleanedAddress = data.replace(PREFIX_REGEX, '').replace(SUFFIX_REGEX, '');
    return {
      address: cleanedAddress,
      isEip681: false,
    };
  }
};
