"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangleIcon } from "@/lib/icons";
import { GlobalEventFields } from "./components/GlobalEventFields";
import { useGlobalEvent } from "./hooks/useGlobalEvent";
import { useUpdateGlobalEvent } from "./hooks/useUpdateGlobalEvent";
import { globalEventErrorMessage } from "./error-message";
import { isoToLocalInput, localInputToIso } from "./date";
import {
  globalEventSchema,
  type GlobalEventFormValues,
} from "./schemas/global-event.schema";
import { isEventMutable } from "./types/global-events.types";

const LIST_PATH = "/admin/global-light-ritual";

function Notice({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
      {icon}
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{message}</p>
      </div>
      <Link
        href={LIST_PATH}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Back to events
      </Link>
    </div>
  );
}

/**
 * Full-page "Edit event" form — the page counterpart to the create page, so
 * create and edit behave the same way. Loads the event, then reuses the shared
 * `GlobalEventFields`. Only UPCOMING events are editable (the backend rejects
 * others with EVENT_NOT_EDITABLE); we surface that before submit too.
 */
export function EditGlobalEventPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { data: event, isLoading, isError } = useGlobalEvent(eventId);
  const update = useUpdateGlobalEvent();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GlobalEventFormValues>({
    resolver: zodResolver(globalEventSchema),
    mode: "onTouched",
  });

  // Seed the form once the event loads.
  React.useEffect(() => {
    if (!event) return;
    reset({
      name: event.name,
      description: event.description,
      scheduledAt: isoToLocalInput(event.scheduledAt),
    });
  }, [event, reset]);

  const onSubmit = (values: GlobalEventFormValues) => {
    update.mutate(
      {
        eventId,
        body: {
          name: values.name,
          description: values.description,
          scheduledAt: localInputToIso(values.scheduledAt),
        },
      },
      {
        onSuccess: () => {
          toast.success("Event updated.");
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
          Edit event
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the moment&rsquo;s details before it goes live.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      ) : isError || !event ? (
        <Notice
          icon={<AlertTriangleIcon size={28} className="text-rose-400" />}
          title="Couldn't load this event"
          message="It may no longer exist, or something went wrong."
        />
      ) : !isEventMutable(event.status) ? (
        <Notice
          icon={<AlertTriangleIcon size={28} className="text-amber-400" />}
          title="This event can no longer be edited"
          message="It has already started or ended. Only upcoming events are editable."
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
            <GlobalEventFields
              register={register}
              control={control}
              errors={errors}
              idPrefix="edit-event"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href={LIST_PATH}
              className={buttonVariants({ variant: "outline" })}
            >
              Cancel
            </Link>
            <Button type="submit" variant="brand" disabled={update.isPending}>
              {update.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
