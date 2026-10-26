import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonAsLink, ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-surface text-heading hover:bg-border",
  outline: "border border-border bg-card text-heading hover:bg-surface",
  ghost: "bg-transparent text-primary hover:bg-surface",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const isLink = (props: ButtonProps): props is ButtonAsLink => typeof props.href === "string";

export function Button(props: ButtonProps) {
  // Render as a link when `href` is passed
  if (isLink(props)) {
    const {
      variant = "primary",
      size = "md",
      loading: _loading,
      leftIcon,
      rightIcon,
      className,
      children,
      href,
      ...anchorProps
    } = props;

    return (
      <Link
        href={href}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...anchorProps}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </Link>
    );
  }

  const {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    type = "button",
    disabled,
    ...buttonProps
  } = props;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...buttonProps}
    >
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
