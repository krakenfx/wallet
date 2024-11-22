import type React from 'react';

import { noop } from 'lodash';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

import { useRealmTransaction } from './useRealmTransaction';

interface RealmQueueProps {
  addToRealmTransactionQueue: (queueName: string, callback: () => unknown) => unknown;
  commitRealmTransactionQueue: (queueName: string) => unknown;
  getFromLocalCache: <T>(queueName: string, fetchObjectName: string, key: string) => T | undefined;
  saveInLocalCache: <T>(queueName: string, fetchObjectName: string, key: string, value: T) => void;
  cancelAllQueues: () => void;
}

const RealmQueueContext = createContext<RealmQueueProps>({
  addToRealmTransactionQueue: noop,
  commitRealmTransactionQueue: noop,
  getFromLocalCache: () => undefined,
  saveInLocalCache: noop,
  cancelAllQueues: noop,
});

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

interface QueueWithName {
  [key: string]: (() => unknown)[];
}

interface LocalCache {
  [queueName: string]: {
    [fetchObjectName: string]: {
      [key: string]: unknown;
    };
  };
}

export const RealmQueueProvider = ({ children }: Props) => {
  const queue = useRef<QueueWithName>({});
  const localCache = useRef<LocalCache>({});

  const { runInTransaction } = useRealmTransaction();

  const addToRealmTransactionQueue = useCallback(function (queueName: string, callback: () => unknown) {
    if (!queue.current[queueName]) {
      queue.current[queueName] = [];
    }
    queue.current[queueName].push(callback);
  }, []);

  const commitRealmTransactionQueue = useCallback(
    (queueName: string) => {
      if (queue.current[queueName]?.length > 0) {
        runInTransaction(() => {
          for (const callback of queue.current[queueName]) {
            callback();
          }
        });
        delete queue.current[queueName];
        delete localCache.current[queueName];
      }
    },
    [runInTransaction],
  );

  const getFromLocalCache = useCallback(function <T>(queueName: string, fetchObjectName: string, key: string) {
    if (localCache.current && localCache.current[queueName] && localCache.current[queueName][fetchObjectName]) {
      return localCache.current[queueName][fetchObjectName][key] as T;
    }
    return undefined;
  }, []);

  const saveInLocalCache = useCallback(function <T>(queueName: string, fetchObjectName: string, key: string, value: T) {
    if (!localCache.current[queueName]) {
      localCache.current[queueName] = {};
    }
    const storage = localCache.current[queueName];

    if (!storage[fetchObjectName]) {
      storage[fetchObjectName] = {};
    }
    const storageForObjectName = storage[fetchObjectName];
    storageForObjectName[key] = value;
  }, []);

  const cancelAllQueues = useCallback(() => {
    localCache.current = {};
    queue.current = {};
  }, []);

  const contextValue = useMemo(
    () => ({
      addToRealmTransactionQueue,
      commitRealmTransactionQueue,
      getFromLocalCache,
      saveInLocalCache,
      cancelAllQueues,
    }),
    [addToRealmTransactionQueue, cancelAllQueues, commitRealmTransactionQueue, getFromLocalCache, saveInLocalCache],
  );

  return <RealmQueueContext.Provider value={contextValue}>{children}</RealmQueueContext.Provider>;
};

export const useRealmQueue = (): RealmQueueProps => useContext(RealmQueueContext);
