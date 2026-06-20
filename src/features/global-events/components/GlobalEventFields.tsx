"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "./DateTimePicker";
import type { GlobalEventFormValues } from "../schemas/global-event.schema";

const BRAND_FOCUS = "focus-visible:border-brand focus-visible:ring-brand/30";

interface GlobalEventFieldsProps {
  register: UseFormRegister<GlobalEventFormValues>;
  control: Control<GlobalEventFormValues>;
  errors: FieldErrors<GlobalEventFormValues>;
  /** Distinguishes input ids when two instances could mount together. */
  idPrefix?: string;
}

/**
 * The name / description / scheduled-for fields for a global event, shared by
 * the create page and the edit dialog so the form lives in one place. Render it
 * inside a `<form>` with its own spacing container.
 */
export function GlobalEventFields({
  register,
  control,
  errors,
  idPrefix = "event",
}: GlobalEventFieldsProps) {
  const nameId = `${idPrefix}-name`;
  const descId = `${idPrefix}-description`;
  const scheduleId = `${idPrefix}-scheduledAt`;

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={nameId}>Name</Label>
        <Input
          id={nameId}
          type="text"
          placeholder="Light for Belonging"
          aria-invalid={errors.name ? true : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={descId}>Description</Label>
        <Textarea
          id={descId}
          rows={4}
          maxLength={2000}
          placeholder="What is this moment about?"
          className={BRAND_FOCUS}
          aria-invalid={errors.description ? true : undefined}
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={scheduleId}>Scheduled for</Label>
        <Controller
          control={control}
          name="scheduledAt"
          render={({ field }) => (
            <DateTimePicker
              id={scheduleId}
              value={field.value ?? ""}
              onChange={field.onChange}
              ariaInvalid={Boolean(errors.scheduledAt)}
            />
          )}
        />
        {errors.scheduledAt ? (
          <p className="text-sm text-red-600">{errors.scheduledAt.message}</p>
        ) : null}
      </div>
    </>
  );
}
