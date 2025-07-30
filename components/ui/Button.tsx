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

  const baseClasses = `group relative inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] overflow-hidden ${
    !isLoading && "cursor-pointer"
  }`;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-emerald-600 to-emerald-700 
      hover:from-emerald-700 hover:to-emerald-800 
      text-white shadow-lg hover:shadow-xl 
      border border-emerald-600/20
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-emerald-400/20 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-200 
      hover:before:opacity-100
    `,
    outline: `
      bg-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 
      text-gray-700 hover:text-emerald-700 
      border-2 border-gray-200 hover:border-emerald-300 
      shadow-lg hover:shadow-xl
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-emerald-50/50 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-200 
      hover:before:opacity-100
    `,
    ghost: `
      text-gray-700 hover:text-emerald-700 
      hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50
      shadow-sm hover:shadow-md
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-emerald-100/30 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-200 
      hover:before:opacity-100
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 
      hover:from-red-700 hover:to-red-800 
      text-white shadow-lg hover:shadow-xl 
      border border-red-600/20
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-red-400/20 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-200 
      hover:before:opacity-100
    `,
  };

  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-12 px-8 text-base",
  };

  const classes =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  const content = (
    <>
      <span className="z-10 relative flex items-center gap-2">
        {isLoading ? <Spinner size={size} /> : children}
      </span>
    </>
  );

  if ("href" in props) {
    return (
      <Link
        href={(props as LinkProps).href}
        className={classes}
        {...(rest as Omit<LinkProps, "href">)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonProps)} disabled={isLoading}>
      {content}
    </button>
  );
};
