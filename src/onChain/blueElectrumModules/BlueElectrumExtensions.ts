import * as bitcoin from 'bitcoinjs-lib';


export function Legacy_scriptPubKeyToAddress(scriptPubKey: string): string | false {
  try {
    const scriptPubKey2 = Buffer.from(scriptPubKey, 'hex');
    return (
      bitcoin.payments.p2pkh({
        output: scriptPubKey2,
        network: bitcoin.networks.bitcoin,
      }).address ?? false
    );
  } catch (_) {
    return false;
  }
}


export function SegwitBech32_scriptPubKeyToAddress(scriptPubKey: string) {
  try {
    const scriptPubKey2 = Buffer.from(scriptPubKey, 'hex');
    return bitcoin.payments.p2wpkh({
      output: scriptPubKey2,
      network: bitcoin.networks.bitcoin,
    }).address;
  } catch (_) {
    return false;
  }
}


export function SegwitP2SH_scriptPubKeyToAddress(scriptPubKey: string) {
  try {
    const scriptPubKey2 = Buffer.from(scriptPubKey, 'hex');
    return bitcoin.payments.p2sh({
      output: scriptPubKey2,
      network: bitcoin.networks.bitcoin,
    }).address;
  } catch (_) {
    return false;
  }
}
