import React from "react";
import Link from "next/link";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  isLoading?: boolean;
}

interface ButtonProps
  extends BaseProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface LinkProps
  extends BaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

export const Button = (props: ButtonProps | LinkProps) => {
  const {
    className = "",
    variant = "primary",
    size = "md",
    children,
    isLoading = false,
    ...rest
  } = props;

  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
    outline:
      "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100/80 shadow-sm",
    ghost: "text-gray-800 hover:bg-gray-100/80",
    danger: "bg-red-600 text-white hover:bg-red-700/90 shadow-sm",
  };

  const sizeClasses = {
    sm: "h-9 px-3",
    md: "h-10 px-5 py-2",
    lg: "h-12 px-8 text-base",
  };

  const classes =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if ("href" in props) {
    return (
      <Link
        href={(props as LinkProps).href}
        className={classes}
        {...(rest as Omit<LinkProps, "href">)}
      >
        {isLoading ? <Spinner size={size} /> : children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonProps)} disabled={isLoading}>
      {isLoading ? <Spinner size={size} /> : children}
    </button>
  );
};
