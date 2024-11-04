
export const untilFirstBackslash = /^[^/]*/;
export const untilSecondColon = /^[^:]*:[^:]*/;

export const stripEmoji = (s: string) => {
  return s.replace(/[\u{0080}-\u{FFFFF}]*/gu, '');
};


export const sanitizeUrl = (stringUrl: string) => {
  const strippedStringUrl = stripEmoji(stringUrl);

  try {
    const parsedUrl = new URL(strippedStringUrl);
    
    const trimmedHostname = parsedUrl.hostname.replace(/^www\./i, '');

    return `${parsedUrl.protocol}//${trimmedHostname}`;
  } catch {
    return strippedStringUrl;
  }
};
