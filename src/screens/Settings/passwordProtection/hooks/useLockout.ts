import EventEmitter from 'eventemitter3';
import { useCallback, useEffect, useRef, useState } from 'react';

import { KeychainKey, getFromKeychain, removeFromKeychain, setInKeychain } from '@/secureStore/keychain';
import { useAppState } from '@/utils/useAppState';

import { BASE_LOCKOUT_PERIOD_MILLIS, FAILED_ATTEMPTS_STEP, LOCKOUT_PERIOD_MULTIPLIER } from '../consts';

import BootTime from '/modules/boot-time';

export const lockoutEmitter = new EventEmitter();

export enum LockoutEvents {
  syncData = 'syncData',
}

type Lock = {
  fromTime: number;
  durationInMillis: number;
};

export const useLockout = () => {
  const context = useRef(Math.random().toString()); 
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [currentLock, setCurrentLock] = useState<Lock>();
  const [isReady, setIsReady] = useState(false);

  const appState = useAppState();

  const clearLock = useCallback(async () => {
    await removeFromKeychain(KeychainKey.failedAttemptsKey);
    await removeFromKeychain(KeychainKey.lockoutKey);
    setFailedAttempts(0);
    setCurrentLock(undefined);
  }, []);

  const checkIfLockValid = useCallback(async (lock: Lock): Promise<boolean> => {
    const currentTimeSinceBooted = await BootTime.getTimeSinceBooted();
    if (currentTimeSinceBooted < lock.fromTime) {
      
      const durationInMillis: Lock = {
        durationInMillis: lock.durationInMillis,
        fromTime: currentTimeSinceBooted,
      };
      await setInKeychain(KeychainKey.lockoutKey, JSON.stringify(durationInMillis));
      return true;
    }
    return currentTimeSinceBooted < lock.fromTime + lock.durationInMillis;
  }, []);

  const getLatestLockFromKeychain = useCallback(async () => {
    const lockData = await getFromKeychain(KeychainKey.lockoutKey);
    if (lockData) {
      return JSON.parse(lockData) as Lock;
    }
  }, []);

  const syncDataFromKeychain = useCallback(async () => {
    const attempts = await getFromKeychain(KeychainKey.failedAttemptsKey);
    setFailedAttempts(attempts ? Number(attempts) : 0);
    const lock = await getLatestLockFromKeychain();
    if (lock) {
      if (!(await checkIfLockValid(lock))) {
        await clearLock();
      } else {
        setCurrentLock(lock);
      }
    }
    setIsReady(true);
  }, [checkIfLockValid, clearLock, getLatestLockFromKeychain]);

  useEffect(() => {
    if (appState === 'active') {
      syncDataFromKeychain();
    }
  }, [appState, syncDataFromKeychain]);

  const processSyncEvent = useCallback(
    (requestingContext: string) => {
      if (context.current !== requestingContext) {
        syncDataFromKeychain();
      }
    },
    [context, syncDataFromKeychain],
  );

  const dispatchSyncEvent = useCallback(() => lockoutEmitter.emit(LockoutEvents.syncData, context.current), []);

  const onFailedAttempt = useCallback(async () => {
    const currentFailedAttempts = failedAttempts + 1;
    if (currentFailedAttempts === FAILED_ATTEMPTS_STEP) {
      const currentTimeSinceBooted = await BootTime.getTimeSinceBooted();
      const existingLock = await getLatestLockFromKeychain();
      const newLock: Lock = {
        fromTime: currentTimeSinceBooted,
        durationInMillis: existingLock ? existingLock.durationInMillis * LOCKOUT_PERIOD_MULTIPLIER : BASE_LOCKOUT_PERIOD_MILLIS,
      };
      await setInKeychain(KeychainKey.lockoutKey, JSON.stringify(newLock));
      await removeFromKeychain(KeychainKey.failedAttemptsKey);
      setCurrentLock(newLock);
    } else {
      await setInKeychain(KeychainKey.failedAttemptsKey, String(currentFailedAttempts));
      setFailedAttempts(currentFailedAttempts);
    }
    dispatchSyncEvent();
  }, [dispatchSyncEvent, failedAttempts, getLatestLockFromKeychain]);

  const onSuccessfulAttempt = useCallback(() => {
    clearLock();
    dispatchSyncEvent();
  }, [clearLock, dispatchSyncEvent]);

  useEffect(() => {
    lockoutEmitter.on(LockoutEvents.syncData, processSyncEvent);
    return () => {
      lockoutEmitter.off(LockoutEvents.syncData, processSyncEvent);
    };
  }, [clearLock, onFailedAttempt, processSyncEvent]);

  return {
    isReady,
    isLocked: !!currentLock,
    onFailedAttempt,
    onSuccessfulAttempt,
    failedAttempts,
  };
};
