
export function removeProtocol(url: string): string {
  return url.replace(/(^[\w-]+:|^)\/\//, '');
}


export function removeWWWSubdomain(url: string): string {
  return url.replace(/(?<=\/|^)www\./i, '');
}


export const untilFirstBackslash = /^[^/]*/;
export const untilFirstColon = /^[^:]*/;
export const untilSecondColon = /^[^:]*:[^:]*/;

export const stripEmoji = (s: string) => {
  return s.replace(/[\u{0080}-\u{FFFFF}]*/gu, '');
};

export const sanitizeUrl = (url: string) => {
  return removeWWWSubdomain(stripEmoji(url));
};
