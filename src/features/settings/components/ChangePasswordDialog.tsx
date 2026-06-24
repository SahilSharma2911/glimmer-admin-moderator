"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChangePassword } from "../hooks/useChangePassword";
import { changePasswordErrorMessage } from "../error-message";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../schemas/change-password.schema";
import { LockIcon, EyeIcon, EyeOffIcon } from "@/lib/icons";

/** Modal form for changing the signed-in admin's password. */
export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const change = useChangePassword();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });

  const close = () => {
    onOpenChange(false);
    reset();
    setShowPassword(false);
  };

  const onSubmit = (values: ChangePasswordValues) => {
    change.mutate(values, {
      onSuccess: () => {
        toast.success("Password changed successfully.");
        close();
      },
      onError: (error) => toast.error(changePasswordErrorMessage(error)),
    });
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
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="text-left">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter your current password, then choose a new one (at least 8
            characters).
          </DialogDescription>
        </DialogHeader>

        <form
          id="change-password-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-slate-700"
            >
              Current password
            </label>
            <Input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your current password"
              icon={<LockIcon size={18} />}
              aria-invalid={errors.currentPassword ? true : undefined}
              {...register("currentPassword")}
            />
            {errors.currentPassword ? (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700"
            >
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
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700"
            >
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              icon={<LockIcon size={18} />}
              aria-invalid={errors.confirmPassword ? true : undefined}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            type="submit"
            form="change-password-form"
            variant="brand"
            disabled={change.isPending}
          >
            {change.isPending ? "Saving…" : "Update password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
