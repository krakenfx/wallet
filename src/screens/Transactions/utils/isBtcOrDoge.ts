export function isBtcOrDoge(walletType: string) {
  return ['HDsegwitBech32', 'dogecoin'].includes(walletType);
}
