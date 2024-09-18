import { useNavigationState } from '@react-navigation/native';
import { defaults, isEqual, remove } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Easing, runOnJS, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { FullWindowOverlay } from 'react-native-screens';

import { HideToastProps, Toast, ToastConfigProps, ToastState } from '@/components/Toast';
import { Routes } from '@/Routes';

import { ToastEmitter, toastEmitter } from './events';

const defaultProps: Partial<ToastConfigProps> = {
  duration: 4000,
  dismissMode: 'auto',
};

export const ToastManager: React.FC = () => {
  const [currentProps, setCurrentProps] = useState<ToastConfigProps>();
  const queue = useRef<ToastConfigProps[]>([]);
  const visibility = useSharedValue(0);

  const navigationState = useNavigationState(state => state);
  const [currentRouteName, setCurrentRouteName] = useState<Routes>();

  const toastVisibleForRoute = useMemo(() => {
    if (currentProps && 'blackListRoutes' in currentProps && currentProps.blackListRoutes !== undefined) {
      return !currentProps.blackListRoutes.includes(currentRouteName || ('' as Routes));
    }
    if (currentProps && 'whiteListRoutes' in currentProps && currentProps.whiteListRoutes !== undefined) {
      return currentProps.whiteListRoutes.includes(currentRouteName || ('' as Routes));
    }
    return true;
  }, [currentProps, currentRouteName]);

  useEffect(() => {
    const routeName = navigationState?.routes[navigationState.index ?? 0 ].name as Routes;
    setCurrentRouteName(routeName);
  }, [navigationState]);

  const removeToastByIdFromQueue = useCallback((id?: string) => {
    if (id) {
      remove(queue.current, toastObj => toastObj.id === id);
    }
  }, []);

  const hideToast = useCallback(() => {
    'worklet';
    visibility.value = withTiming(ToastState.OUT, { easing: Easing.in(Easing.ease) }, finished => {
      if (finished) {
        runOnJS(setCurrentProps)(undefined);
        visibility.value = ToastState.GONE;
      }
    });
  }, [visibility]);

  const showToast = useCallback(
    (newProps: ToastConfigProps) => {
      const mergedProps = defaults(newProps, defaultProps);
      if (currentProps) {
        
        if (![...queue.current, currentProps].find(props => isEqual(props, mergedProps))) {
          queue.current.unshift(newProps);
        }
        return;
      }
      setCurrentProps(mergedProps);
      visibility.value = withSequence(
        withTiming(ToastState.IN, { easing: Easing.out(Easing.ease) }),
        withDelay(
          mergedProps.duration!,
          withTiming(ToastState.IN, { duration: 0 }, finished => {
            if (finished && !['onlyManual', 'event'].includes(mergedProps.dismissMode || '')) {
              if (mergedProps?.id) {
                
                runOnJS(removeToastByIdFromQueue)(mergedProps.id);
              }
              hideToast();
            }
          }),
        ),
      );
    },
    [currentProps, hideToast, removeToastByIdFromQueue, visibility],
  );

  useEffect(() => {
    
    if (!currentProps) {
      const nextProps = queue.current?.pop();
      if (nextProps) {
        showToast(nextProps);
      }
    }
  }, [currentProps, showToast]);

  useEffect(() => {
    toastEmitter.on(ToastEmitter.showToastEvent, showToast);
    return () => {
      toastEmitter.off(ToastEmitter.showToastEvent, showToast);
    };
  }, [showToast]);

  const clearAllErrorToasts = useCallback(() => {
    remove(queue.current, toastObj => toastObj.type === 'error');
    if (currentProps?.type === 'error') {
      hideToast();
    }
  }, [currentProps?.type, hideToast]);

  useEffect(() => {
    toastEmitter.on(ToastEmitter.clearToastErrorsEvent, clearAllErrorToasts);
    return () => {
      toastEmitter.off(ToastEmitter.clearToastErrorsEvent, clearAllErrorToasts);
    };
  }, [clearAllErrorToasts]);

  const hideToastFromEvent = useCallback(
    ({ id }: HideToastProps) => {
      if (currentProps?.id === id) {
        hideToast();
      }
      
      removeToastByIdFromQueue(id);
    },
    [currentProps?.id, hideToast, removeToastByIdFromQueue],
  );

  useEffect(() => {
    toastEmitter.on(ToastEmitter.hideToastEvent, hideToastFromEvent);
    return () => {
      toastEmitter.off(ToastEmitter.hideToastEvent, hideToastFromEvent);
    };
  }, [hideToastFromEvent]);

  const Container = Platform.OS === 'ios' ? FullWindowOverlay : View;

  return currentProps ? (
    <Container style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {toastVisibleForRoute && <Toast {...currentProps} visibility={visibility} onDismiss={hideToast} />}
    </Container>
  ) : null;
};
