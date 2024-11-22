import * as bip39 from 'bip39';

export async function loadMnemonicSlow(mnemonic: string): Promise<ArrayBuffer> {
  return await bip39.mnemonicToSeed(mnemonic);
}
