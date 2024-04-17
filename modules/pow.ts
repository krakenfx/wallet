import argon2 from 'react-native-argon2';

export async function solvePowChallenge(difficulty: number, challengeD: string): Promise<string> {
  const targetHash = BigInt(2 ** 256) - BigInt(2 ** 256 * difficulty);
  let attempts = 0;
  const t0 = Date.now();
  while (true) {
    const solution = attempts.toString(16);
    attempts++;
    const hash = await calculatePoW(challengeD, solution);
    if (hash < targetHash) {
      const t1 = Date.now();
      console.log(`FOUND SOLUTION after ${attempts} attempts and took ${(t1 - t0) / 1000} seconds`, solution);
      return solution;
    }
  }
}

export async function calculatePoW(challenge: string, solution: string): Promise<bigint> {
  const solutionHash = await argon2(solution, challenge, {
    mode: 'argon2d',
    iterations: 3,
    memory: 65536,
    hashLength: 32,
    parallelism: 4,
  });

  return BigInt(`0x${solutionHash.rawHash}`);
}
