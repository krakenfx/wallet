import b58 from 'bs58check';
import { flatMap } from 'lodash';

import { Buffer } from 'buffer';

import { multiGetHistoryByAddress, waitTillConnected } from '../blueElectrumModules/BlueElectrumTyped';


export async function refreshSequence(startingIndex: number, getAddress: (c: number) => Promise<string>) {
  await waitTillConnected();

  
  
  const maxIndex = 1000;

  
  const gapLimit = 20;

  
  const generateChunkAddresses = async (chunkNum: number) => {
    const ret = [];
    for (let c = gapLimit * chunkNum; c < gapLimit * (chunkNum + 1); c++) {
      ret.push(await getAddress(c));
    }
    return ret;
  };

  let lastChunkWithUsedAddressesNum: number | null = null;
  let lastHistoriesWithUsedAddresses = null;

  
  for (let c = 0; c < Math.round(maxIndex / gapLimit); c++) {
    const histories = await multiGetHistoryByAddress(await generateChunkAddresses(c));
    const historiesFlat = flatMap(Object.values(histories));
    if (historiesFlat.length > 0) {
      
      lastChunkWithUsedAddressesNum = c;
      lastHistoriesWithUsedAddresses = histories;
    } else {
      
      break;
    }
  }

  let lastUsedIndex = 0;

  if (lastHistoriesWithUsedAddresses && lastChunkWithUsedAddressesNum !== null) {
    
    for (let c = lastChunkWithUsedAddressesNum * gapLimit; c < lastChunkWithUsedAddressesNum * gapLimit + gapLimit; c++) {
      const address = await getAddress(c);
      if (lastHistoriesWithUsedAddresses[address] && lastHistoriesWithUsedAddresses[address].length > 0) {
        lastUsedIndex = Math.max(c, lastUsedIndex) + 1; 
      }
    }
  }

  return lastUsedIndex;
}


export function parseSecret(newSecret: string) {
  let secret = newSecret.trim().replace('bitcoin:', '').replace('BITCOIN:', '');
  let masterFingerprint: number | false = false;
  let _derivationPath: string = '';
  let label: string = '';
  let use_with_hardware_wallet = false;

  if (secret.startsWith('BC1')) {
    secret = secret.toLowerCase();
  }

  
  const re = /\[([^\]]+)\](.*)/;
  const m = secret.match(re);
  if (m && m.length === 3) {
    const values = m[1].split('/');
    let [hexFingerprint] = values;
    const [_, ...derivationPathArray] = values;
    const derivationPath = `m/${derivationPathArray.join('/').replace(/h/g, "'")}`;
    if (hexFingerprint.length === 8) {
      hexFingerprint = Buffer.from(hexFingerprint, 'hex').reverse().toString('hex');
      masterFingerprint = parseInt(hexFingerprint, 16);
      _derivationPath = derivationPath;
    }
    secret = m[2];
  }

  try {
    let parsedSecret;
    
    if (secret.trim().length > 0) {
      try {
        parsedSecret = JSON.parse(secret);
      } catch (e) {
        parsedSecret = JSON.parse(newSecret);
      }
    } else {
      parsedSecret = JSON.parse(newSecret);
    }
    if (parsedSecret && parsedSecret.keystore && parsedSecret.keystore.xpub) {
      if (parsedSecret.keystore.ckcc_xfp) {
        
        masterFingerprint = Number(parsedSecret.keystore.ckcc_xfp);
      } else if (parsedSecret.keystore.root_fingerprint) {
        masterFingerprint = Number(parsedSecret.keystore.root_fingerprint);
      }
      if (parsedSecret.keystore.label) {
        label = parsedSecret.keystore.label;
      }
      if (parsedSecret.keystore.derivation) {
        _derivationPath = parsedSecret.keystore.derivation;
      }
      secret = parsedSecret.keystore.xpub;

      if (parsedSecret.keystore.type === 'hardware') {
        use_with_hardware_wallet = true;
      }
    }
    
    if (parsedSecret && parsedSecret.ExtPubKey && parsedSecret.MasterFingerprint && parsedSecret.AccountKeyPath) {
      secret = parsedSecret.ExtPubKey;
      const mfp = Buffer.from(parsedSecret.MasterFingerprint, 'hex').reverse().toString('hex');
      masterFingerprint = parseInt(mfp, 16);
      _derivationPath = parsedSecret.AccountKeyPath.startsWith('m/') ? parsedSecret.AccountKeyPath : `m/${parsedSecret.AccountKeyPath}`;
      if (parsedSecret.CoboVaultFirmwareVersion) {
        use_with_hardware_wallet = true;
      }
    }
    /* eslint-disable-next-line no-empty */
  } catch (_: unknown) {}

  if (!_derivationPath) {
    if (secret.startsWith('xpub')) {
      _derivationPath = "m/44'/0'/0'"; 
    } else if (secret.startsWith('ypub')) {
      _derivationPath = "m/49'/0'/0'"; 
    } else if (secret.startsWith('zpub')) {
      _derivationPath = "m/84'/0'/0'"; 
    }
  }

  return {
    label,
    secret,
    _derivationPath,
    masterFingerprint,
    use_with_hardware_wallet,
  };
}


export const XPUB_PREFIX = '0488b21e';

export const YPUB_PREFIX = '049d7cb2';

export const ZPUB_PREFIX = '04b24746';

export function setXPubPrefix(xpub: string, prefix: string) {
  let data = b58.decode(xpub);
  data = data.slice(4);
  data = Buffer.concat([Buffer.from(prefix, 'hex'), data]);
  return b58.encode(data);
}
