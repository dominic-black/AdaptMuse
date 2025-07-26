import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
}

interface ButtonProps
  extends BaseProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface LinkProps extends BaseProps {
  href: string;
}

export const Button = (props: ButtonProps | LinkProps) => {
  const {
    className = "",
    variant = "primary",
    size = "md",
    children,
    ...rest
  } = props;

  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-md",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-base",
  };

  const classes =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if ("href" in props) {
    return (
      <Link href={(props as LinkProps).href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};
