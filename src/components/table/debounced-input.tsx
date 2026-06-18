"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface DebouncedInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  /** Delay before firing onChange. Defaults to 300ms. */
  debounceMs?: number;
}

/**
 * Input that debounces its `onChange` — useful for server-side filtering so
 * the API is hit once the user pauses, not on every keystroke. Stays in sync
 * when `value` changes externally (e.g. "Reset filters").
 */
export function DebouncedInput({
  value,
  onChange,
  debounceMs = 300,
  ...props
}: DebouncedInputProps) {
  const [internal, setInternal] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);

  // Reset local state when the external value changes (render-time, no effect).
  if (value !== prevValue) {
    setPrevValue(value);
    setInternal(value);
  }

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  function handleChange(next: string) {
    setInternal(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChangeRef.current(next), debounceMs);
  }

  return (
    <Input
      {...props}
      value={internal}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}
