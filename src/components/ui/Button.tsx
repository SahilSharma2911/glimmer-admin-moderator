import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  /** Optional icon rendered before the label. */
  leftIcon?: ReactNode;
};

const base =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-dark",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
};

export function Button({
  variant = "primary",
  leftIcon,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {leftIcon}
      {children}
    </button>
  );
}
