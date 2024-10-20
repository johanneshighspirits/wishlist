import clsx from "clsx";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { LinkStyles } from "./Link";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive";

export type ButtonSize = "regular" | "inline";

export const ButtonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-white border-solid bg-gray-200 text-black hover:text-white hover:bg-gray-900 py-2 px-6 rounded-md disabled:bg-gray-400 disabled:text-gray-300 disabled:border-gray-300 dark:disabled:bg-gray-500 dark:disabled:text-gray-700 dark:disabled:border-gray-500",
  secondary:
    "border border-gray-500 hover:border-white border-solid py-3 lg:py-1 px-4 rounded-md",
  tertiary:
    "font-bold underline underline-offset-8 pb-2 hover:text-sky-500 decoration-sky-500 hover:decoration-white",
  destructive:
    "border border-red-900 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md",
};

const getStyles = (variant: ButtonVariant, size: ButtonSize) => {
  switch (variant) {
    case "primary": {
      return clsx(
        size === "regular" && "py-2 px-6 w-full md:w-fit",
        size === "inline" && "flex-inline items-center px-3 h-full max-w-fit",
        `rounded-md
        bg-gray-200 hover:bg-gray-900     disabled:bg-gray-400      dark:disabled:bg-gray-500
        text-black  hover:text-white      disabled:text-gray-300    dark:disabled:text-gray-700
        border border-white border-solid  disabled:border-gray-300  dark:disabled:border-gray-500
      `,
      );
    }
    case "secondary": {
      return clsx(
        size === "regular" && "py-3 px-4 lg:py-1 w-full md:w-fit",
        size === "inline" &&
          "flex-inline items-center px-3 lg:py-1 h-full max-w-fit",
        `rounded-md
        border border-gray-500 border-solid
        hover:border-white
        `,
      );
    }
    case "tertiary": {
      return clsx(
        size === "regular" && "pb-2 w-full md:w-fit",
        size === "inline" && "flex-inline items-center h-full max-w-fit",
        `font-bold underline underline-offset-8
        decoration-sky-500 hover:decoration-white
        hover:text-sky-500
        `,
      );
    }
    case "destructive": {
      return clsx(
        size === "regular" && "py-2 px-6 w-full md:w-fit",
        size === "inline" && "flex-inline items-center px-2 h-full max-w-fit",
        `rounded-md
        text-white
        bg-red-700 hover:bg-red-600
        border border-red-900
      `,
      );
    }
  }
};

export const Button = ({
  variant = "primary",
  size = "regular",
  className,
  children,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>) => {
  return (
    <button {...props} className={clsx(getStyles(variant, size), className)}>
      {children}
    </button>
  );
};

export const ButtonLink = ({
  variant = "primary",
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
