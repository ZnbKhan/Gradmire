"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { MailCheck } from "lucide-react";
import { signUp } from "@/lib/actions/auth";
import type { FormState } from "@/lib/actions/consultation";

const initial: FormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-pill bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-coral disabled:opacity-70"
    >
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signUp, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-brandgreen/30 bg-brandgreen-dim p-7 text-center">
        <MailCheck size={30} className="mx-auto mb-3.5 text-brandgreen" aria-hidden="true" />
        <h2 className="mb-2 text-[19px] font-semibold">Check your inbox</h2>
        <p role="status" className="text-[14px] text-ink-soft">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="signup-fullName" className="mb-1.5 block text-[13.5px] font-medium">
          Full name
        </label>
        <input
          id="signup-fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          placeholder="Priya Sharma"
          aria-invalid={state.fieldErrors?.fullName ? true : undefined}
          aria-describedby={state.fieldErrors?.fullName ? "signup-fullName-error" : undefined}
          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14.5px]"
        />
        {state.fieldErrors?.fullName && (
          <p id="signup-fullName-error" className="mt-1.5 text-[12.5px] text-destructive">
            {state.fieldErrors.fullName[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="signup-email" className="mb-1.5 block text-[13.5px] font-medium">
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          aria-describedby={state.fieldErrors?.email ? "signup-email-error" : undefined}
          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14.5px]"
        />
        {state.fieldErrors?.email && (
          <p id="signup-email-error" className="mt-1.5 text-[12.5px] text-destructive">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      {!state.ok && state.message && (
        <p role="alert" className="text-[13.5px] text-destructive">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
