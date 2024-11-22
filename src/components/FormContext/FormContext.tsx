import type React from 'react';

import { fromPairs } from 'lodash';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type MaybeBoolean = boolean | undefined;

interface FormContextProps<T extends string> {
  fields: Record<T, MaybeBoolean>;
  setField: (fieldName: T, isValid: MaybeBoolean) => void;
  isFormValid: boolean;
}

interface FormProviderProps {
  children: React.ReactNode;
}

export function createFormContext<T extends string>(allFields: T[]) {
  const FormContext = createContext<FormContextProps<T> | undefined>(undefined);

  const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
      throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
  };

  const useFormField = (field: T) => {
    const context = useContext(FormContext);
    if (!context) {
      throw new Error('useFormField must be used within a FormProvider');
    }

    const { setField } = context;

    return useMemo(
      () => ({
        setValid: () => setField(field, true),
        setInvalid: () => setField(field, false),
        clear: () => setField(field, undefined),
      }),
      [setField, field],
    );
  };

  const FormProvider: React.FC<FormProviderProps & { requiredFields: T[] }> = ({ children, requiredFields }) => {
    const [fields, setValidFields] = useState<Record<T, MaybeBoolean>>(
      fromPairs(allFields.map(fieldName => [fieldName, undefined])) as Record<T, MaybeBoolean>,
    );

    const setField = useCallback((fieldName: T, isValid?: boolean) => {
      setValidFields(values => ({
        ...values,
        [fieldName]: isValid,
      }));
    }, []);

    const isFormValid = Object.entries(fields)
      .filter(([key]) => requiredFields.includes(key as T))
      .map(([_, value]) => value)
      .every(Boolean);

    return (
      <FormContext.Provider
        value={{
          fields,
          setField,
          isFormValid,
        }}>
        {children}
      </FormContext.Provider>
    );
  };

  return {
    FormProvider,
    useFormContext,
    useFormField,
  };
}
