import clsx from 'clsx';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { LinkStyles } from './Link';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export const ButtonStyles: Record<ButtonVariant, string> = {
  primary:
    'border border-white border-solid bg-gray-200 text-black hover:text-white hover:bg-gray-900 py-2 px-6 rounded-md disabled:bg-gray-500 disabled:text-gray-700 disabled:border-gray-500',
  secondary:
    'border border-gray-500 hover:border-white border-solid py-1 px-4 rounded-md',
  tertiary:
    'font-bold underline underline-offset-8 pb-2 hover:text-sky-500 decoration-sky-500 hover:decoration-white',
};

export const Button = ({
  variant = 'primary',
  children,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>) => {
  return (
    <button {...props} className={clsx(ButtonStyles[variant], props.className)}>
      {children}
    </button>
  );
};

export const ButtonLink = ({
  variant = 'primary',
  children,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>) => {
  return (
    <button {...props} className={clsx(LinkStyles, props.className)}>
      {children}
    </button>
  );
};
