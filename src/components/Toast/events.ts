import EventEmitter from 'eventemitter3';

import { HideToastProps, ToastConfigProps } from '@/components/Toast/Toast';

export const toastEmitter = new EventEmitter();

export enum ToastEmitter {
  showToastEvent = 'showToastEvent',
  hideToastEvent = 'hideToastEvent',
  clearToastErrorsEvent = 'clearToastErrorsEvent',
  hideToastsForRouteEvent = 'hideToastsForRouteEvent',
  showToastsForRouteEvent = 'showToastsForRouteEvent',
}

const emitShowToastEvent = (props: ToastConfigProps): Promise<void> => {
  toastEmitter.emit(ToastEmitter.showToastEvent, props);
  return new Promise(resolve => setTimeout(resolve, 100));
};

const emitHideToastEvent = ({ id }: HideToastProps) => {
  toastEmitter.emit(ToastEmitter.hideToastEvent, { id });
};

const emitClearAllErrors = () => {
  toastEmitter.emit(ToastEmitter.clearToastErrorsEvent);
};

const emitHideToastsForRoute = () => {
  toastEmitter.emit(ToastEmitter.hideToastsForRouteEvent);
};

const emitShowToastsForRoute = () => {
  toastEmitter.emit(ToastEmitter.showToastsForRouteEvent);
};

export {
  emitShowToastEvent as showToast,
  emitHideToastEvent as hideToast,
  emitClearAllErrors as clearAllToastErrors,
  emitHideToastsForRoute as hideToastsForRoute,
  emitShowToastsForRoute as showToastsForRoute,
};
