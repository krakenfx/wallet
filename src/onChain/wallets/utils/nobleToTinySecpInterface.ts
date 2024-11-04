import { schnorr, secp256k1 } from '@noble/curves/secp256k1';

import type { TinySecp256k1Interface as TinySecp256k1InterfaceBip } from 'bip32';
import type { TinySecp256k1Interface } from 'ecpair';

export const nobleAdapter: TinySecp256k1Interface & TinySecp256k1InterfaceBip = {
  isPoint(p: Uint8Array): boolean {
    try {
      secp256k1.ProjectivePoint.fromHex(p);
      return true;
    } catch (e) {
      return false;
    }
  },
  pointCompress(p: Uint8Array, compressed: boolean = true): Uint8Array {
    const point = secp256k1.ProjectivePoint.fromHex(p);
    return point.toRawBytes(compressed);
  },
  isPrivate(d: Uint8Array): boolean {
    return secp256k1.utils.isValidPrivateKey(d);
  },
  pointFromScalar(d: Uint8Array, compressed: boolean = true): Uint8Array | null {
    try {
      const point = secp256k1.getPublicKey(d, compressed);
      return point;
    } catch (e) {
      return null;
    }
  },
  sign(h: Uint8Array, d: Uint8Array, e?: Uint8Array): Uint8Array {
    const opts = e ? { extraEntropy: e } : undefined;
    const signature = secp256k1.sign(h, d, opts);
    return signature.toCompactRawBytes();
  },
  signSchnorr(h: Uint8Array, d: Uint8Array, e?: Uint8Array): Uint8Array {
    return schnorr.sign(h, d, e);
  },
  verify(h: Uint8Array, Q: Uint8Array, signature: Uint8Array, strict: boolean = true): boolean {
    const options = { lowS: strict };
    return secp256k1.verify(signature, h, Q, options);
  },
  verifySchnorr(h: Uint8Array, Q: Uint8Array, signature: Uint8Array): boolean {
    return schnorr.verify(signature, h, Q);
  },

  pointAddScalar(p: Uint8Array, tweak: Uint8Array, compressed: boolean = true): Uint8Array | null {
    try {
      const point = secp256k1.ProjectivePoint.fromHex(p).add(secp256k1.ProjectivePoint.fromPrivateKey(tweak));
      return point.toRawBytes(compressed);
    } catch (e) {
      return null;
    }
  },
  privateAdd(d: Uint8Array, tweak: Uint8Array): Uint8Array | null {
    try {
      const privateKeyNum = secp256k1.utils.normPrivateKeyToScalar(d);
      const tweakNum = secp256k1.utils.normPrivateKeyToScalar(tweak);
      const addedPrivateKey = schnorr.utils.mod(privateKeyNum + tweakNum, secp256k1.CURVE.n);
      return schnorr.utils.numberToBytesBE(addedPrivateKey, 32);
    } catch (e) {
      return null;
    }
  },
};
