import crypto from 'crypto';

export function createAuthenticationSignature(apiPrivateKey: string, path: string, nonce: string, apiPostBodyData: string) {
  const apiPost = nonce + apiPostBodyData;
  const secret = Buffer.from(apiPrivateKey, 'base64');
  const sha256 = crypto.createHash('sha256');
  const hash256 = sha256.update(apiPost).digest('binary');
  const hmac512 = crypto.createHmac('sha512', secret);
  const signatureString = hmac512.update(path + hash256, 'binary').digest('base64');
  return signatureString;
}
