import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import NameResolver from '@/api/NameResolver';
import { Network } from '@/onChain/wallets/base';

import { handleError } from '/helpers/errorHandler';

export const useNameResolver = (network: Network, name: string) => {
  const nameResolver = useRef(new NameResolver(network));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resolved, setResolved] = useState<{ name: string; address: string }>();
  const [failedName, setFailedName] = useState<string>();
  const [hasError, setHasError] = useState<boolean>();
  const isNetworkSupported = nameResolver.current.isNetworkSupported();
  const isValidName = isNetworkSupported && nameResolver.current.isValidName(name);
  const isSuspicious = isNetworkSupported && nameResolver.current.isSuspicious(name);

  const canResolve = isValidName && !resolved && !failedName;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resolveDebounced = useCallback(
    debounce(async query => {
      setIsLoading(true);
      setFailedName(undefined);
      setHasError(false);
      try {
        setResolved({ name: query, address: await nameResolver.current.resolveName(query) });
        setFailedName(undefined);
      } catch (e) {
        setResolved(undefined);
        setFailedName(query);
        if (e !== NameResolver.RESOLVED_NAME_NONE) {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
          setHasError(true);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    const wasFailedButNameChanged = failedName && failedName !== name;
    const wasValidButNameChanged = resolved && resolved.name !== name;
    if (!isValidName || wasFailedButNameChanged || wasValidButNameChanged) {
      setResolved(undefined);
      setFailedName(undefined);
    }
  }, [failedName, isValidName, name, resolved]);

  useEffect(() => {
    if (canResolve) {
      resolveDebounced(name);
    }
  }, [canResolve, name, resolveDebounced]);

  return {
    isNetworkSupported,
    isLoading,
    unresolved: !!failedName,
    hasError,
    resolved,
    isValidName,
    isSuspicious,
  };
};
