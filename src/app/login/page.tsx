import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { LoginForm } from "@/components/forms/login-form";
import { safeNextPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to track the status of your Gradmire applications.",
  robots: { index: false, follow: false },
};

/** Sign-in failures the callback and middleware can hand back. */
const ERRORS: Record<string, string> = {
  missing_code: "That sign-in link was incomplete. Request a fresh one below.",
  invalid_link:
    "That sign-in link has expired or was already used. Request a fresh one below.",
  auth_unavailable:
    "Sign-in is temporarily unavailable. Please try again shortly, or email your counselor.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath = safeNextPath(next);
  const errorMessage = error ? ERRORS[error] : undefined;

  return (
    <>
      <SiteHeader />
      <main id="main" className="px-7 py-20">
        <div className="mx-auto max-w-[42ch]">
          <span className="eyebrow">Applicant sign in</span>
          <h1 className="mb-3 mt-3 text-[clamp(28px,3.6vw,38px)] font-semibold">
            Check your application status
          </h1>
          <p className="mb-8 text-[15px] text-ink-soft">
            Enter the email on your account. We&rsquo;ll send a sign-in link — no
            password to remember.
          </p>
          {errorMessage && (
            <p
              role="alert"
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13.5px] text-destructive"
            >
              {errorMessage}
            </p>
          )}

          <LoginForm nextPath={nextPath} />

          <p className="mt-6 text-center text-[13.5px] text-ink-soft">
            New here?{" "}
            <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
