"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { GlobalEventFields } from "./components/GlobalEventFields";
import { useCreateGlobalEvent } from "./hooks/useCreateGlobalEvent";
import { globalEventErrorMessage } from "./error-message";
import { localInputToIso } from "./date";
import {
  globalEventSchema,
  type GlobalEventFormValues,
} from "./schemas/global-event.schema";

const LIST_PATH = "/admin/global-light-ritual";

/**
 * Full-page "Create event" form. Mirrors the Add moderator flow — a dedicated
 * page rather than a modal. Editing an existing event still uses an inline
 * dialog (seeded from the row).
 */
export function AddGlobalEventPage() {
  const router = useRouter();
  const create = useCreateGlobalEvent();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GlobalEventFormValues>({
    resolver: zodResolver(globalEventSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: GlobalEventFormValues) => {
    create.mutate(
      {
        name: values.name,
        description: values.description,
        scheduledAt: localInputToIso(values.scheduledAt),
      },
      {
        onSuccess: (created) => {
          toast.success(`"${created.name}" scheduled.`);
          router.push(LIST_PATH);
        },
        onError: (error) => toast.error(globalEventErrorMessage(error)),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={LIST_PATH}
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Back to events
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create event
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Schedule a shared moment of care every child can join in realtime.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
          <GlobalEventFields
            register={register}
            control={control}
            errors={errors}
            idPrefix="new-event"
          />

          <div className="flex items-start gap-2.5 rounded-lg bg-accent-soft px-4 py-3">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-xs leading-relaxed text-slate-500">
              The event goes live at the scheduled time and stays live for 24
              hours. You can edit or delete it any time before it starts.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={LIST_PATH}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button type="submit" variant="brand" disabled={create.isPending}>
            <Plus size={16} />
            {create.isPending ? "Creating…" : "Create event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
