import { defaults } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { ColorName, useTheme } from '@/theme/themes';

export type ValidationState = undefined | 'valid' | 'invalid';

type Props =
  | undefined
  | ({
      initialState?: ValidationState;
      defaultCallbackDelay?: number;
    } & (
      | {
          resetWhenInvalid?: false;
          resetDelay?: never;
        }
      | {
          resetWhenInvalid?: true;
          resetDelay?: number;
        }
    ));

const defaultProps: Props = {
  initialState: undefined,
  resetWhenInvalid: true,
  resetDelay: 1000,
  defaultCallbackDelay: 1000,
};


export const useValidationState = (props: Props = {}) => {
  const { initialState, resetWhenInvalid, resetDelay, defaultCallbackDelay } = defaults(props, defaultProps);
  const [state, setState] = useState<ValidationState>(initialState);
  const [wasInvalid, setWasInvalid] = useState<boolean>(initialState === 'invalid');

  useEffect(() => {
    let handle: NodeJS.Timeout;
    if (state && resetWhenInvalid) {
      handle = setTimeout(() => setState(undefined), resetDelay);
    }
    if (state === 'invalid') {
      setWasInvalid(true);
    }
    return () => clearTimeout(handle);
  }, [resetDelay, resetWhenInvalid, state]);

  const { colors } = useTheme();

  const color: ColorName | undefined = useMemo(() => {
    switch (state) {
      case 'valid':
        return 'green500';
      case 'invalid':
        return 'red400';
      default:
        return undefined;
    }
  }, [state]);

  const colorValue = color ? colors[color] : undefined;

  const borderStyle = { borderColor: colorValue };

  const setStateWithCallback = (nextState: ValidationState, callback?: () => void, timeout = defaultCallbackDelay) => {
    setState(nextState);
    if (callback) {
      setTimeout(callback, timeout);
    }
  };

  return {
    color,
    colorValue,
    borderStyle,
    state,
    setState: setStateWithCallback,
    wasInvalid,
  };
};
