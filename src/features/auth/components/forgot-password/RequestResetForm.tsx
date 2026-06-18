"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import {
  requestResetSchema,
  type RequestResetValues,
} from "@/features/auth/schemas/password-reset.schema";
import type { ApiError } from "@/lib/api/types";
import { MailIcon } from "@/lib/icons";

function errorMessage(error: ApiError | null): string | null {
  if (!error) return null;
  switch (error.code) {
    case "OTP_SERVICE_UNAVAILABLE":
      return "The code service is temporarily unavailable. Please try again shortly.";
    case "NETWORK_ERROR":
      return "Can't reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function RequestResetForm({
  onSent,
}: {
  onSent: (email: string) => void;
}) {
  const forgot = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: RequestResetValues) => {
    forgot.mutate(values, {
      onSuccess: () => {
        toast.success("Verification code sent to your email.");
        onSent(values.email);
      },
      onError: (error) =>
        toast.error(errorMessage(error) ?? "Something went wrong."),
    });
  };

  return (
    <div className="w-full max-w-sm">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Forgot password?
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your work email and we’ll send you a verification code.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Work email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.org"
            icon={<MailIcon size={18} />}
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <Button type="submit" variant="brand" className="h-11 w-full" disabled={forgot.isPending}>
          {forgot.isPending ? "Sending…" : "Send code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-accent hover:text-accent-dark">
          Back to login
        </Link>
      </p>
    </div>
  );
}
