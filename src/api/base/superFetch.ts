const activeControllers = new Map<string, AbortController>();

export const cancelActiveRequests = () => {
  activeControllers.forEach(controller => controller.abort());
};

export async function superFetch(url: RequestInfo, opts: RequestInit = {}, timeout = 15000) {
  const headers = opts.headers instanceof Headers ? opts.headers : new Headers(opts.headers ?? {});
  const requestId = headers.get('x-request-id') ?? '';

  
  if (typeof url === 'string') {
    const method = opts?.method ?? 'GET';
    console.log(`${method} ${url} x-request-id: ${requestId}`);
  } else {
    const method = url?.method ?? opts?.method ?? 'GET';
    console.log(`${method} ${url.url} x-request-id: ${requestId}`);
  }

  const controller = new AbortController();
  activeControllers.set(requestId, controller);
  const id = setTimeout(() => controller.abort(), timeout);
  const startTime = +new Date();

  let response;
  try {
    response = await fetch(url, {
      ...opts,
      signal: controller.signal,
    });
    clearTimeout(id);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.log(`request timeout: ${url} x-request-id: ${requestId}`);
      throw new Error(`Request to ${url2domain(String(url))} timed out`); 
    } else {
      console.error(`request to ${String(url)} failed with error: ${err instanceof Error ? err.message : String(err)} x-request-id: ${requestId}`);
      throw err;
    }
  } finally {
    activeControllers.delete(requestId);
  }

  const endTime = +new Date();
  if (endTime - startTime > 3 * 1000) {
    let uri2print = '';
    if (typeof url === 'string') {
      uri2print = url;
    } else {
      uri2print = url.url;
    }
    console.log(`warning: API call to ${uri2print} took ${(endTime - startTime) / 1000} sec; x-request-id: ${requestId}`);
  }

  if (!response.headers.has('x-request-id')) {
    response.headers.append('x-request-id', requestId);
  }

  return response;
}

function url2domain(url: string): string {
  return url.replace('http://', '').replace('https://', '').split('/')[0];
}
