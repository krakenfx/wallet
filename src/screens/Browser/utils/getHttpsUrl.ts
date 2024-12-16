export function getHttpsUrl(url: string): string | null {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    try {
      parsedUrl = new URL('http://' + url);
    } catch {
      return null;
    }
  }

  if (!isValidHostname(parsedUrl.hostname)) {
    return null;
  }

  const { host, pathname, search, hash } = parsedUrl;
  return `https://${host}${pathname}${search}${hash}`;
}

function isValidHostname(hostname: string): boolean {
  const hostnameRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,}|xn--[a-zA-Z0-9-]+))$/;

  return hostnameRegex.test(hostname);
}
