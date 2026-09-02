import type { Metadata } from "next";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { LoginForm } from "@/components/forms/login-form";
import { safeNextPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to track the status of your Gradmire applications.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

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
            Enter the email address you gave your counselor. We&rsquo;ll send a sign-in
            link — no password to remember.
          </p>
          <LoginForm nextPath={nextPath} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
