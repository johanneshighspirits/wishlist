import { PropsWithChildren } from 'react';
import NextLink, { LinkProps } from 'next/link';
import clsx from 'clsx';
import { ButtonStyles, ButtonVariant } from './Button';

export const LinkStyles = 'underline underline-offset-2 hover:text-white/90';

export const Link = ({
  href,
  className,
  children,
  ...props
}: PropsWithChildren<{ className?: string; href: string } & LinkProps>) => {
  return (
    <NextLink {...props} className={clsx(LinkStyles, className)} href={href}>
      {children}
    </NextLink>
  );
};

export const LinkButton = ({
  href,
  className,
  variant = 'primary',
  children,
  ...props
}: PropsWithChildren<
  { className?: string; href: string; variant?: ButtonVariant } & LinkProps
>) => {
  return (
    <NextLink
      {...props}
      className={clsx(ButtonStyles[variant], 'inline-block', className)}
      href={href}>
      {children}
    </NextLink>
  );
};
