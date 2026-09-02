"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { subscribeToNewsletter, type FormState } from "@/lib/actions/consultation";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-white transition-colors hover:bg-coral/90 disabled:opacity-60"
      aria-label="Subscribe"
    >
      <ArrowRight size={15} aria-hidden="true" />
    </button>
  );
}

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction] = useActionState(subscribeToNewsletter, initial);

  return (
    <div className={className}>
      <form action={formAction} className="flex items-center gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address for deadline reminders
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="min-w-0 flex-1 rounded-pill border border-white/20 bg-white/5 px-4 py-2 text-[13.5px] text-white placeholder:text-white/40"
        />
        {/* Honeypot — hidden from people, tempting to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <SubmitButton />
      </form>
      {state.message && (
        <p
          role="status"
          className={cn(
            "mt-2 text-[12.5px]",
            state.ok ? "text-[#8fe3b6]" : "text-[#f4c06a]",
          )}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
