import * as bip39 from 'bip39';

import crypto from 'crypto';

export function generateMnemonic() {
  const buf = crypto.randomBytes(16);
  return bip39.entropyToMnemonic(buf.toString('hex'));
}
