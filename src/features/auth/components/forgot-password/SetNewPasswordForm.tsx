"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/features/auth/schemas/password-reset.schema";
import type { ApiError } from "@/lib/api/types";
import { LockIcon, EyeIcon, EyeOffIcon } from "@/lib/icons";

function errorMessage(error: ApiError | null): string | null {
  if (!error) return null;
  switch (error.code) {
    case "INVALID_OR_EXPIRED_RESET_TOKEN":
      return "Your reset session has expired. Please start over.";
    case "PASSWORD_SAME_AS_OLD":
      return "New password must be different from your current one.";
    case "NETWORK_ERROR":
      return "Can't reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function SetNewPasswordForm({
  resetToken,
  onDone,
}: {
  resetToken: string;
  onDone: () => void;
}) {
  const reset = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: ResetPasswordValues) => {
    reset.mutate(
      {
        resetToken,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully.");
          onDone();
        },
        onError: (error) =>
          toast.error(errorMessage(error) ?? "Something went wrong."),
      },
    );
  };

  const toggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600"
    >
      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
    </button>
  );

  return (
    <div className="w-full max-w-sm">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Set a new password
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Choose a strong password you haven’t used before.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
            New password
          </label>
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            icon={<LockIcon size={18} />}
            aria-invalid={errors.newPassword ? true : undefined}
            trailing={toggle}
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            icon={<LockIcon size={18} />}
            aria-invalid={errors.confirmPassword ? true : undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button type="submit" variant="brand" className="h-11 w-full" disabled={reset.isPending}>
          {reset.isPending ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
