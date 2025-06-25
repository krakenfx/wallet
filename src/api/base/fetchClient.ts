import { QueryClient } from '@tanstack/react-query';
import { randomUUID } from 'crypto';

export class HTTPError extends Error {
  constructor(
    readonly response: Response,
    readonly requestId: string,
  ) {
    super(`HTTP ${response.status} ${response.statusText}`);
  }
}

export const DEFAULT_CACHE_TIME = 10 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_CACHE_TIME,
    },
  },
});

export const cancelActiveRequestsAndInvalidateCache = () => {
  queryClient.cancelQueries();
  queryClient.invalidateQueries();
};

export async function fetchClient(url: RequestInfo, opts: RequestInit = {}) {
  const headers = opts.headers instanceof Headers ? opts.headers : new Headers(opts.headers ?? {});
  if (!headers.has('x-request-id')) {
    headers.set('x-request-id', randomUUID());
  }
  const requestId = headers.get('x-request-id')!;

  let urlString;
  let method;

  if (typeof url === 'string') {
    method = opts?.method ?? 'GET';
    urlString = url;
    console.log(`${method} ${url} x-request-id: ${requestId}`);
  } else {
    method = url?.method ?? opts?.method ?? 'GET';
    urlString = url.url;
    console.log(`${method} ${url.url} x-request-id: ${requestId}`);
  }

  if (method === 'POST' && opts.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const queryFn = ({ signal }: { signal?: AbortSignal } = {}) =>
    fetch(url, { ...opts, headers, signal });

  let response;

  try {
    if (method === 'POST') {
      response = await queryFn();
    } else {
      response = await queryClient.fetchQuery({
        queryKey: [urlString],
        queryFn: queryFn,
      });
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.log(`request timeout: ${url} x-request-id: ${requestId}`);
      throw new Error(`Request to ${url2domain(String(url))} timed out`);
    } else {
      console.error(`request to ${String(url)} failed with error: ${err instanceof Error ? err.message : String(err)} x-request-id: ${requestId}`);
      throw err;
    }
  }
  if (!response.headers.has('x-request-id')) {
    response.headers.append('x-request-id', requestId);
  }

  if (!response.ok) {
    throw new HTTPError(response, requestId);
  }

  return response;
}

function url2domain(url: string): string {
  return url.replace('http://', '').replace('https://', '').split('/')[0];
}
