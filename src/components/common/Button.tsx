import clsx from 'clsx';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { LinkStyles } from './Link';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive';

export const ButtonStyles: Record<ButtonVariant, string> = {
  primary:
    'border border-white border-solid bg-gray-200 text-black hover:text-white hover:bg-gray-900 py-2 px-6 rounded-md disabled:bg-gray-400 disabled:text-gray-300 disabled:border-gray-300 dark:disabled:bg-gray-500 dark:disabled:text-gray-700 dark:disabled:border-gray-500',
  secondary:
    'border border-gray-500 hover:border-white border-solid py-3 lg:py-1 px-4 rounded-md',
  tertiary:
    'font-bold underline underline-offset-8 pb-2 hover:text-sky-500 decoration-sky-500 hover:decoration-white',
  destructive:
    'border border-red-900 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md',
};

const common = 'w-full md:w-fit';

export const Button = ({
  variant = 'primary',
  className,
  children,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>) => {
  return (
    <button
      {...props}
      className={clsx(common, ButtonStyles[variant], className)}>
      {children}
    </button>
  );
};

export const ButtonLink = ({
  variant = 'primary',
  className,
  children,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>) => {
  return (
    <button {...props} className={clsx(LinkStyles, className)}>
      {children}
    </button>
  );
};
