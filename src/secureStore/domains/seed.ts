import { loadMnemonicSlow } from '@/utils/loadMnemonicSlow';

import { KeychainKey, setInKeychain } from '../keychain';
import { arrayBufferToHexString } from '../utils';

export async function setSeedInKeychain(mnemonic: string): Promise<ArrayBuffer> {
  const seedBuffer = await loadMnemonicSlow(mnemonic);
  const seedBufferString = arrayBufferToHexString(seedBuffer);
  await setInKeychain(KeychainKey.seedBufferKey, seedBufferString);
  await setInKeychain(KeychainKey.mnemonicKey, mnemonic);
  return seedBuffer;
}
