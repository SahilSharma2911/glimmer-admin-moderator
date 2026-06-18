"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@/lib/icons";
import { RequestResetForm } from "./RequestResetForm";
import { VerifyOtpForm } from "./VerifyOtpForm";
import { SetNewPasswordForm } from "./SetNewPasswordForm";

type Step = "request" | "verify" | "reset" | "done";

/**
 * Orchestrates the 3-step password reset:
 *   request OTP → verify OTP → set new password → done.
 * Carries `email` (step 1 → 2) and `resetToken` (step 2 → 3) in local state.
 */
export function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  if (step === "request") {
    return (
      <RequestResetForm
        onSent={(sentEmail) => {
          setEmail(sentEmail);
          setStep("verify");
        }}
      />
    );
  }

  if (step === "verify") {
    return (
      <VerifyOtpForm
        email={email}
        onVerified={(token) => {
          setResetToken(token);
          setStep("reset");
        }}
        onBack={() => setStep("request")}
      />
    );
  }

  if (step === "reset") {
    return (
      <SetNewPasswordForm
        resetToken={resetToken}
        onDone={() => setStep("done")}
      />
    );
  }

  // done
  return (
    <div className="w-full max-w-sm text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircleIcon size={26} />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        Password reset
      </h2>
      <p className="mt-1.5 text-sm text-slate-500">
        Your password has been updated. Please sign in with your new password.
      </p>
      <div className="mt-6">
        <Link href="/login">
          <Button variant="brand" className="h-11 w-full">Back to login</Button>
        </Link>
      </div>
    </div>
  );
}
