import { createFormContext } from '@/components/FormContext';

const { FormProvider, useFormContext, useFormField } = createFormContext(['address', 'amount']);

export { FormProvider, useFormContext, useFormField };
