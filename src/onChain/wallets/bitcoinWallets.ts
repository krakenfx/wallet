import * as bitcoin from 'bitcoinjs-lib';

import { WalletData } from './base';
import { BitcoinElectrumTransport, BitcoinNetwork, deriveRoot } from './bitcoin';
import { XPUB_PREFIX, ZPUB_PREFIX } from './bitcoinHelpers';

const transport = new BitcoinElectrumTransport();

export { transport as electrumXTransport };


export const hdSegwitBech32Network = new BitcoinNetwork({
  segwitType: 'p2wpkh',
  derivationPath: {
    purpose: '84',
  },
  xpubPrefix: ZPUB_PREFIX,
  deriveAddress: hdNode => {
    
    return bitcoin.payments.p2wpkh({
      pubkey: hdNode.publicKey,
    }).address!;
  },
  updatePsbtInput: async (wallet: WalletData, psbtInput, inputUtxo) => {
    const pubkey = deriveRoot(wallet).derivePath(inputUtxo.derivationPath).publicKey;
    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey });
    return {
      ...psbtInput,
      witnessUtxo: {
        script: p2wpkh.output!,
        value: inputUtxo.value,
      },
    };
  },
});


export const hdLegacyP2PKHNetwork = new BitcoinNetwork({
  derivationPath: {
    purpose: '44',
  },
  xpubPrefix: XPUB_PREFIX,
  deriveAddress: hdNode => {
    return bitcoin.payments.p2pkh({
      pubkey: hdNode.publicKey,
    }).address!;
  },
  updatePsbtInput: async (wallet: WalletData, psbtInput, _inputUtxo) => {
    const txdataHex = null;
    if (!txdataHex) {
      
      
      
      throw new Error('Legacy Transactions not supported');
    }

    return {
      ...psbtInput,
      nonWitnessUtxo: Buffer.from(txdataHex, 'hex'),
    };
  },
});
