export class Timeout extends Error {}

export const timeout = <T>(prom: Promise<T>, time: number): Promise<T> =>
  Promise.race<T>([prom, new Promise((_r, rej) => setTimeout(() => rej(new Timeout()), time))]);
