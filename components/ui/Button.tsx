import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-alert-from to-alert-to text-black font-semibold shadow-glow hover:brightness-110 active:brightness-95",
  secondary:
    "bg-surface-elevated border border-surface-border text-ink hover:border-ink-faint/60 hover:bg-surface",
  ghost: "text-ink-muted hover:text-ink hover:bg-surface/60",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-2 gap-1.5",
  md: "text-[15px] px-5 py-3 gap-2",
  lg: "text-base px-7 py-4 gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex items-center justify-center rounded-full transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
