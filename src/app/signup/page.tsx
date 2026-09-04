import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a Gradmire account to start and track your applications.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="px-7 py-20">
        <div className="mx-auto max-w-[42ch]">
          <span className="eyebrow">Create an account</span>
          <h1 className="mb-3 mt-3 text-[clamp(28px,3.6vw,38px)] font-semibold">
            Start tracking your application
          </h1>
          <p className="mb-8 text-[15px] text-ink-soft">
            Tell us your name and email — we&rsquo;ll send a sign-in link, no password
            to remember.
          </p>

          <SignupForm />

          <p className="mt-6 text-center text-[13.5px] text-ink-soft">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-ink underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
