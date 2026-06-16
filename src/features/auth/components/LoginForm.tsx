"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldIcon,
  GoogleIcon,
} from "@/lib/icons";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Sign in to access the Glimmers Safety Platform.
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          // UI-only for now. Wiring to the auth API will live in a
          // `useLogin` hook under features/auth/hooks.
        }}
        className="space-y-5"
        noValidate
      >
        {/* Work email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Work email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.org"
            icon={<MailIcon size={18} />}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <a href="#" className="text-sm font-medium text-brand hover:text-brand-dark">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            icon={<LockIcon size={18} />}
            required
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            }
          />
        </div>

        <Button type="submit" variant="primary" leftIcon={<LockIcon size={16} />}>
          Sign in
        </Button>
      </form>

      {/* divider */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <Button variant="outline" leftIcon={<GoogleIcon size={18} />}>
        Sign in with Google
      </Button>

      {/* authorized-use note */}
      <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-[#F4F1FE] px-4 py-3">
        <ShieldIcon size={18} className="mt-0.5 shrink-0 text-brand" />
        <p className="text-xs leading-relaxed text-slate-500">
          This platform is for authorized team members only. All activity is
          monitored to keep children safe.
        </p>
      </div>
    </div>
  );
}
