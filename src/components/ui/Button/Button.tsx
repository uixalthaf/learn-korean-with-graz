"use client";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-heading hover:bg-primary-hover text-white",
    secondary: "bg-surface text-heading hover:bg-border",
    outline: "border border-border bg-transparent text-heading hover:bg-surface",
  };

  const sizes: Record<ButtonSize, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} cursor-pointer`}
      {...props}
    />
  );
}
