import argon2 from 'react-native-argon2';

import crypto from 'crypto';

const argon2config = {
  iterations: 1,
  memory: 46 * 1024,
  parallelism: 1,
  hashLength: 32,
  mode: 'argon2id',
};

export async function encrypt(data: Int8Array | string, password: string, deviceID: string): Promise<string | Int8Array> {
  let int8arrayMode = false;
  if (data instanceof Int8Array) {
    data = JSON.stringify([...data]);
    int8arrayMode = true;
  }

  const keyRaw = await argon2(normalize(password), deviceID, argon2config);
  const key = Buffer.from(keyRaw.rawHash, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv, { authTagLength: 16 });

  let encryptedHex = cipher.update(data, 'utf8', 'hex');
  encryptedHex += cipher.final('hex');
  const tag = cipher.getAuthTag();

  if (int8arrayMode) {
    return new Int8Array(Buffer.concat([iv, tag, Buffer.from(encryptedHex, 'hex')]));
  }

  return [iv.toString('hex'), tag.toString('hex'), encryptedHex].join(':');
}

export async function decrypt(data: Int8Array | string, password: string, deviceID: string): Promise<string | Int8Array> {
  let int8arrayMode = false;
  let ivHex: string, tagHex: string, encryptedHex: string;

  if (data instanceof Int8Array) {
    int8arrayMode = true;
    const int8buf = Buffer.from(data);

    ivHex = int8buf.slice(0, 16).toString('hex');

    tagHex = int8buf.slice(16, 32).toString('hex');

    encryptedHex = int8buf.slice(32).toString('hex');
  } else {
    [ivHex, tagHex, encryptedHex] = data.split(':');
  }

  const keyRaw = await argon2(normalize(password), deviceID, argon2config);
  const key = Buffer.from(keyRaw.rawHash, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'), { authTagLength: 16 });
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  if (decrypted && int8arrayMode) {
    return new Int8Array(JSON.parse(decrypted));
  }

  return decrypted;
}

function normalize(inp: string): string {
  return inp.normalize('NFC');
}
