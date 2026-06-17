"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";
import {
  verifyOtpSchema,
  type VerifyOtpValues,
} from "@/features/auth/schemas/password-reset.schema";
import type { ApiError } from "@/lib/api/types";

function errorMessage(error: ApiError | null): string | null {
  if (!error) return null;
  switch (error.code) {
    case "INVALID_OTP":
      return "Invalid code. Please check and try again.";
    case "OTP_EXPIRED_OR_NOT_REQUESTED":
      return "Your code has expired. Request a new one.";
    case "OTP_MAX_ATTEMPTS_EXCEEDED":
      return "Too many attempts. Request a new code.";
    case "NETWORK_ERROR":
      return "Can't reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function VerifyOtpForm({
  email,
  onVerified,
  onBack,
}: {
  email: string;
  onVerified: (resetToken: string) => void;
  onBack: () => void;
}) {
  const verify = useVerifyOtp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: VerifyOtpValues) => {
    verify.mutate(
      { email, otp: values.otp },
      {
        onSuccess: (data) => onVerified(data.resetToken),
        onError: (error) =>
          toast.error(errorMessage(error) ?? "Something went wrong."),
      },
    );
  };

  return (
    <div className="w-full max-w-sm">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Enter verification code
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-slate-700">{email}</span>.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
            Verification code
          </label>
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            className="text-center text-lg tracking-[0.4em]"
            aria-invalid={errors.otp ? true : undefined}
            {...register("otp")}
          />
          {errors.otp ? (
            <p className="text-sm text-red-600">{errors.otp.message}</p>
          ) : null}
        </div>

        <Button type="submit" variant="primary" disabled={verify.isPending}>
          {verify.isPending ? "Verifying…" : "Verify code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Wrong email?{" "}
        <button
          type="button"
          onClick={onBack}
          className="font-medium text-brand hover:text-brand-dark"
        >
          Start over
        </button>
      </p>
    </div>
  );
}
