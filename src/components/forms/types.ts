import { HTMLInputTypeAttribute } from 'react';

export type FieldConfig<FieldName extends string | undefined = undefined> = {
  name: FieldName;
  type?: HTMLInputTypeAttribute;
  initialValue?: string;
  labelText?: string;
  placeholderText?: string;
  infoText?: string;
  validators?: ValidatorFn[];
  onValueChange?: (value: string, context: any) => { value: string };
};

export type ValidationError = {
  message: string;
};

export type ValidatorFn = (value: string) => ValidationError | null;
