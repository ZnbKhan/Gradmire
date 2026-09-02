"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/actions/consultation";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-coral disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

/**
 * Thin wrapper so admin forms share submit state and result messaging
 * without each page re-implementing useActionState.
 */
export function ActionForm({
  action,
  submitLabel,
  children,
  className,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, initial);

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Submit label={submitLabel} />
        {state.message && (
          <span
            role="status"
            className={cn(
              "text-[12.5px]",
              state.ok ? "text-brandgreen" : "text-destructive",
            )}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
