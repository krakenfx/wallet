export async function retryPromise<T>(operation: () => Promise<T>, maxRetries = 3, retryDelayMs = 25): Promise<T | false> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Operation failed, retrying (${retries + 1}/${maxRetries})`, error);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      retries++;
    }
  }
  return false;
}
