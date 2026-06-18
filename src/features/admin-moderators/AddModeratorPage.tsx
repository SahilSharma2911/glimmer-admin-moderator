"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateModerator } from "./hooks/useCreateModerator";
import { moderatorErrorMessage } from "./error-message";
import {
  inviteModeratorSchema,
  type InviteModeratorValues,
} from "./schemas/moderator.schema";
import { MailIcon, ShieldIcon } from "@/lib/icons";

/**
 * Full-page "Add moderator" form. The backend only accepts name + email and
 * onboards via a secure invite link (no temporary password), so those are the
 * only fields — the invite-email behaviour is shown as static helper text.
 */
export function AddModeratorPage() {
  const router = useRouter();
  const create = useCreateModerator();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteModeratorValues>({
    resolver: zodResolver(inviteModeratorSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: InviteModeratorValues) => {
    create.mutate(values, {
      onSuccess: (moderator) => {
        toast.success(`Invite sent to ${moderator.email}.`);
        router.push("/admin/moderators");
      },
      onError: (error) => toast.error(moderatorErrorMessage(error)),
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Add moderator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a moderator and send them an invite.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter full name"
                aria-invalid={errors.name ? true : undefined}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Work email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="name@example.com"
                icon={<MailIcon size={18} />}
                aria-invalid={errors.email ? true : undefined}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-accent-soft px-4 py-3">
            <ShieldIcon size={18} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-xs leading-relaxed text-slate-500">
              The moderator receives an email with a secure link to set their
              own password and finish onboarding.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/moderators"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button type="submit" variant="brand" disabled={create.isPending}>
            <MailIcon size={16} />
            {create.isPending ? "Sending…" : "Send invite"}
          </Button>
        </div>
      </form>
    </div>
  );
}
