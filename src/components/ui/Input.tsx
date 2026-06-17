import type { ComponentPropsWithRef, ReactNode } from "react";

type InputProps = ComponentPropsWithRef<"input"> & {
  /** Icon shown inside the field on the left. */
  icon?: ReactNode;
  /** Interactive element (e.g. show/hide toggle) shown on the right. */
  trailing?: ReactNode;
};

export function Input({ icon, trailing, className = "", ...props }: InputProps) {
  return (
    <div className="group relative flex items-center">
      {icon ? (
        <span className="pointer-events-none absolute left-3 text-slate-400 group-focus-within:text-brand">
          {icon}
        </span>
      ) : null}
      <input
        className={
          "h-11 w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-900 " +
          "placeholder:text-slate-400 transition-colors " +
          "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 " +
          "aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-400 aria-[invalid=true]:focus:ring-red-200/70 " +
          (icon ? "pl-10 " : "pl-3.5 ") +
          (trailing ? "pr-10 " : "pr-3.5 ") +
          className
        }
        {...props}
      />
      {trailing ? <span className="absolute right-2 flex items-center">{trailing}</span> : null}
    </div>
  );
}
