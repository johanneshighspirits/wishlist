import { HTMLInputTypeAttribute } from 'react';

export type FieldConfig = {
  name: string;
  type?: HTMLInputTypeAttribute;
  initialValue?: string;
  labelText?: string;
  placeholderText?: string;
  infoText?: string;
  validators?: ValidatorFn[];
  onValueChange?: (value: string, context: any) => void;
};

export type ValidationError = {
  message: string;
};

export type ValidatorFn = (value: string) => ValidationError | null;
