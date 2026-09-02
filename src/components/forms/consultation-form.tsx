"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { submitConsultation, type FormState } from "@/lib/actions/consultation";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false };

export type CourseOption = { slug: string; name: string };

function Field({
  label,
  name,
  type = "text",
  required,
  errors,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `field-${name}`;
  const errId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-medium text-ink">
        {label} {required && <span className="text-coral-text">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? errId : undefined}
        className={cn(
          "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14.5px] text-ink placeholder:text-ink-soft/70",
          errors ? "border-destructive" : "border-line",
        )}
        {...rest}
      />
      {errors && (
        <p id={errId} className="mt-1.5 text-[12.5px] text-destructive">
          {errors[0]}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-coral px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
    >
      {pending ? "Booking…" : "Book free consultation"}
      {!pending && <ArrowRight size={15} aria-hidden="true" />}
    </button>
  );
}

export function ConsultationForm({ courses }: { courses: CourseOption[] }) {
  const [state, formAction] = useActionState(submitConsultation, initial);
  const pathname = usePathname();

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-brandgreen/30 bg-brandgreen-dim p-8 text-center">
        <CheckCircle2
          size={32}
          className="mx-auto mb-4 text-brandgreen"
          aria-hidden="true"
        />
        <h2 className="mb-2 text-[22px] font-semibold text-ink">Consultation booked</h2>
        <p role="status" className="mx-auto max-w-[42ch] text-[14.5px] text-ink-soft">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="sourcePath" value={pathname} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          name="fullName"
          required
          autoComplete="name"
          placeholder="Priya Sharma"
          errors={state.fieldErrors?.fullName}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          errors={state.fieldErrors?.email}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          errors={state.fieldErrors?.phone}
        />
        <div>
          <label
            htmlFor="field-preferredIntake"
            className="mb-1.5 block text-[13.5px] font-medium text-ink"
          >
            Preferred intake
          </label>
          <select
            id="field-preferredIntake"
            name="preferredIntake"
            defaultValue=""
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14.5px] text-ink"
          >
            <option value="">No preference</option>
            <option value="September 2026">September 2026</option>
            <option value="January 2027">January 2027</option>
            <option value="September 2027">September 2027</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="field-courseHubSlug"
          className="mb-1.5 block text-[13.5px] font-medium text-ink"
        >
          Course of interest
        </label>
        <select
          id="field-courseHubSlug"
          name="courseHubSlug"
          defaultValue=""
          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14.5px] text-ink"
        >
          <option value="">Not sure yet — help me choose</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="field-message"
          className="mb-1.5 block text-[13.5px] font-medium text-ink"
        >
          Anything else we should know?
        </label>
        <textarea
          id="field-message"
          name="message"
          rows={4}
          placeholder="Your academic background, target universities, or questions."
          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14.5px] text-ink placeholder:text-ink-soft/70"
        />
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="text-[13.5px] text-destructive">
          {state.message}
        </p>
      )}

      <SubmitButton />
      <p className="text-center text-[12.5px] text-ink-soft">
        Free, no obligation. We reply within one working day.
      </p>
    </form>
  );
}
