import { getHarmony } from '@/api/base/apiFactory';

import { KeychainKey, getFromKeychain, setInKeychain } from '../keychain';

import { solvePowChallenge } from '/modules/pow';


export const powKeyExpiryCushion = 1000 * 60 * 3;
let getApiKeyPromise: Promise<string> | null = null;

type Credentials = {
  expiry: number;
  ts: number;
  key: string;
};

let credentials: Credentials | undefined;


async function solvePowAndGetKey(): Promise<string> {
  const temporaryHarmonyClient = await getHarmony();
  const powChallenge = await temporaryHarmonyClient.POST('/pow/request', {});
  const solved = await solvePowChallenge(powChallenge.difficulty, powChallenge.challenge.d);
  const powSubmission = await temporaryHarmonyClient.POST('/pow/submit', {
    body: {
      signature: powChallenge.signature,
      challenge: powChallenge.challenge,
      solution: solved,
    },
  });

  if (powSubmission && powSubmission.key) {
    credentials = {
      key: `Pow ${powSubmission.key}`,
      ts: powChallenge.challenge.ts,
      expiry: powChallenge.challenge.expiry,
    };
    await setInKeychain(KeychainKey.powKeyServiceNameKey, JSON.stringify(credentials));
    return credentials.key;
  }

  throw new Error('Could not get PoW Key');
}

export async function getApiKey(): Promise<string> {
  if (credentials && Date.now() <= credentials.expiry - powKeyExpiryCushion) {
    return credentials.key;
  }
  if (!getApiKeyPromise) {
    getApiKeyPromise = solvePowAndGetKey().finally(() => {
      
      getApiKeyPromise = null;
    });
  }
  return await getApiKeyPromise;
}


(async function rehydrateCredentials() {
  const credentialsFromKeychain = await getFromKeychain(KeychainKey.powKeyServiceNameKey);
  credentials = credentialsFromKeychain ? (JSON.parse(credentialsFromKeychain) as Credentials) : undefined;
})();
