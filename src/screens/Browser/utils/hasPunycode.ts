export function hasPunycode(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;

    return hostname.includes('xn--');
  } catch (e) {
    return false;
  }
}
