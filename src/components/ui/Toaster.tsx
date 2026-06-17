"use client";

import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

/**
 * App toast host (Sonner — the toast shadcn/ui ships). Mounted once in the
 * root layout; trigger toasts anywhere with `toast.success(...)` /
 * `toast.error(...)` from "sonner".
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      toastOptions={{ classNames: { toast: "font-hanken-grotesk" } }}
      {...props}
    />
  );
}
