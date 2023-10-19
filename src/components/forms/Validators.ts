import { ValidatorFn } from './types';

type ValidatorFnNames = 'required' | 'email';

const emailRegex = /^.*@.*\..*$/i;

export const Validators: Record<ValidatorFnNames, () => ValidatorFn> = {
  required: () => (val) => {
    return val ? null : { message: 'Detta fält är obligatoriskt' };
  },
  email: () => (val) =>
    emailRegex.test(val)
      ? null
      : { message: 'Det här verkar inte vara en epostadress' },
} as const;
