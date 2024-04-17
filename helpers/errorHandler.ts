import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { ErrorObject, serializeError } from 'serialize-error';

import { ToastConfigProps, showToast } from '@/components/Toast';
import { isShowToastOnAllErrorsEnabledKey } from '@/secureStore/asyncStorageKeys';

import loc from '/loc';

type BabelErrorContext = `ERROR_CONTEXT_${'PLACEHOLDER'}`;

export const applogFilePath = RNFS.DocumentDirectoryPath + '/app.log';

export const recentErrors: { timestamp: Date; error: ErrorObject; context: string }[] = [];

const logfileSizeCutoff = 100 * 1024 * 1024;

let loggingTofileEnabled = false;
export function enableLoggingToFile() {
  loggingTofileEnabled = true;
  return RNFS.writeFile(applogFilePath, '', 'utf8');
}

export function disableLoggingToFile() {
  loggingTofileEnabled = false;
  return RNFS.unlink(applogFilePath);
}

export function isLoggingToFileEnabled() {
  return loggingTofileEnabled;
}

RNFS.stat(applogFilePath)
  .then(statResult => {
    loggingTofileEnabled = true;
    if (statResult.size >= logfileSizeCutoff) {
      RNFS.writeFile(applogFilePath, '', 'utf8');
    }
  })
  .catch(() => (loggingTofileEnabled = false));

export function appendLog(contents: string | unknown[], context: string = 'unknown') {
  if (!loggingTofileEnabled) {
    return;
  }
  try {
    const contents2write = typeof contents === 'string' ? contents : JSON.stringify(contents);
    return RNFS.appendFile(applogFilePath, `${new Date()} context=${context} ${contents2write}\n`, 'utf8');
  } catch (_) {}
}

let showToastOnAllErrorsEnabled = false;

AsyncStorage.getItem(isShowToastOnAllErrorsEnabledKey)
  .then(value => {
    if (!value) {
      throw Error('value not set');
    }
    showToastOnAllErrorsEnabled = value === 'true';
  })
  .catch(() => {
    showToastOnAllErrorsEnabled = __DEV__;
  });

export function enableShowToastOnAllErrors() {
  showToastOnAllErrorsEnabled = true;
  return AsyncStorage.setItem(isShowToastOnAllErrorsEnabledKey, 'true');
}

export function disableShowToastOnAllErrors() {
  showToastOnAllErrorsEnabled = false;
  return AsyncStorage.setItem(isShowToastOnAllErrorsEnabledKey, 'false');
}

export function isShowToastOnAllErrorsEnabled() {
  return showToastOnAllErrorsEnabled;
}

export function createErrorHandlerWithContext(context: BabelErrorContext) {
  return (reason: unknown) => handleError(reason, context);
}

export const handleError = async function (
  error: unknown,
  context: BabelErrorContext,
  toast?: Omit<ToastConfigProps, 'type' | 'blackListRoutes'> | 'generic',
): Promise<void> {
  console.log('exception caught:', context, error);
  recentErrors.push({
    error: serializeError(unwrapError(error)),
    context,
    timestamp: new Date(),
  });

  appendLog(JSON.stringify(serializeError(error)), context);
  if (showToastOnAllErrorsEnabled) {
    return showToast({ type: 'error', text: (await getErrorMessage(error)).trim() });
  }
  if (toast) {
    const toastProps = typeof toast === 'object' ? toast : { text: loc.errors.generic };
    return showToast({ type: 'error', ...toastProps });
  }
};

const cleanHTMLTags = (str: string) => {
  return str
    .replace('<title>Error</title>', '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/(\\n)+/g, '')
    .trim();
};

export const getErrorMessage = async (err: any): Promise<string> => {
  if (err?.cause?.message) {
    return (err?.message ? `${err.message}: ` : '') + String(err?.cause?.message);
  } else if (err?.response?.json) {
    try {
      const resolved = jsonToPretty(await err?.response.json());
      return (err?.message ? `${err.message}: ` : '') + String(resolved);
    } catch {}
  } else if (err?.response?.text) {
    const resolved = jsonToPretty(await err?.response.text());
    return (err?.message ? `${err.message}: ` : '') + String(resolved);
  }

  if (err?.message) {
    return cleanHTMLTags(err.message);
  }
  return String(err ?? '(no message)');
};

function jsonToPretty(json: any): string {
  if (typeof json === 'string') {
    return json;
  }

  let ret = '';

  for (const key of Object.keys(json)) {
    let val = json[key];

    if (typeof val === 'string') {
      ret += `${key}: ${val}\n`;
    } else {
      val = jsonToPretty(val);
      ret += `\t${key}: ${val}\n`;
    }
  }

  return ret;
}

const GENERAL_FETCH_ERROR = 'GENERAL_FETCH_ERROR';

export const showGeneralFetchError = (context: BabelErrorContext, e?: unknown) => {
  handleError(e, context, { text: loc.errors.generalFetchError, id: GENERAL_FETCH_ERROR });
};

function unwrapError(error: unknown) {
  while (error instanceof WrappedError) {
    error = error.original;
  }
  return error;
}

export class WrappedError<T extends unknown> extends Error {
  constructor(readonly original: T, message: string) {
    super(message);
  }

  static from(e: unknown, message: string) {
    return new WrappedError(e, message);
  }
}
