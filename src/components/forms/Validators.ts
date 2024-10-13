import { ValidationError, ValidatorFn } from './types';

type ValidatorFnNames = 'required' | 'email' | 'url' | 'notInList';

const emailRegex = /^.*@.*\..*$/i; // HAHA, fix this

const required: ValidatorFn = (val: string) => {
  return val?.trim() ? null : { message: 'Detta fält är obligatoriskt' };
};
const email: ValidatorFn = (val: string) => {
  if (!val?.trim()) {
    return null;
  }
  return emailRegex.test(val)
    ? null
    : { message: 'Det här verkar inte vara en epostadress' };
};
const url: ValidatorFn = (val: string) => {
  if (!val?.trim()) {
    return null;
  }
  try {
    new URL(val);
    return null;
  } catch {
    return { message: 'Det här är inte en giltig URL' };
  }
};
const notInList =
  ({ list, message }: { list: string[]; message: string }): ValidatorFn =>
  (val: string) => {
    console.log({ val, list });
    if (!val?.trim()) {
      return null;
    }
    return !list.includes(val.trim()) ? null : { message };
  };

export const Validators = {
  required: () => required,
  email: () => email,
  url: () => url,
  notInList,
} as const;

export const validateField = (
  value: string,
  validators: ValidatorFn[] = []
): ValidationError | null => {
  for (const validatorFn of validators) {
    const error = validatorFn(value);
    if (error) {
      return error;
    }
  }
  return null;
};
