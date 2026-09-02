import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import {
  Heart,
  Globe,
  Users,
  Target,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "We built Gradmire because country-first advice wasn't working. Learn about our course-first approach to study abroad.",
};

function AboutPageContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          <Heart className="mr-1.5 h-3.5 w-3.5" />
          About Gradmire
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          We built this because country-first advice wasn&apos;t working.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Every study abroad platform we used started with the same question:
          &ldquo;What country do you want to study in?&rdquo; But that&apos;s
          the wrong question. Your course shapes your career, your network, and
          your earning potential far more than which city you happen to study in.
          We built Gradmire to flip that model — start with the subject, then
          find the best university and destination around it.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Right now, Gradmire fully covers the{" "}
          <strong>United Kingdom</strong> — with detailed course guides,
          university data, visa guidance, and interactive planning tools. We&apos;re
          actively building out the US, Canada, and Australia, and you can join
          the waitlist for any of those destinations to be notified when they
          launch.
        </p>
      </div>

      <Separator className="mb-16" />

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-10">What we stand for</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Course-First",
              desc: "We believe the right programme matters more than the right postcode. Everything we build starts from the subject.",
            },
            {
              icon: Globe,
              title: "Destination-Agnostic",
              desc: "We're building for every major study-abroad destination, not just one. Our data model is multi-country from day one.",
            },
            {
              icon: Award,
              title: "Transparent",
              desc: "We flag draft copy, placeholder data, and coming-soon states clearly. We'd rather be honest than polished.",
            },
          ].map((val, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <val.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{val.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {val.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Team */}
      <section id="team" className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-10">Our team</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              name: "Sarah Chen",
              role: "Lead Counselor — Business & Finance",
              desc: "5 years in MBA admissions. Former applicant to LBS and Cambridge Judge.",
            },
            {
              name: "James Okafor",
              role: "Lead Counselor — STEM & Engineering",
              desc: "PhD graduate from Imperial. Specializes in ATAS guidance and CS/Engineering applications.",
            },
            {
              name: "Ananya Sharma",
              role: "Lead Counselor — Humanities & Social Sciences",
              desc: "Oxford PPE graduate. Expert in Law, Economics, and Psychology admissions.",
            },
          ].map((person, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="mt-4 font-semibold">{person.name}</h3>
                <p className="text-sm text-primary font-medium">{person.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {person.desc}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/50">
                  Placeholder profile
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Trust Markers */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-10">
          Trust markers
        </h2>
        <div className="grid gap-6 sm:grid-cols-4">
          {[
            { label: "Students Helped", value: "—" },
            { label: "University Partners", value: "—" },
            { label: "Countries Covered", value: "1 (UK)" },
            { label: "Success Rate", value: "—" },
          ].map((marker, i) => (
            <Card key={i}>
              <CardContent className="p-5 text-center">
                <div className="text-2xl font-bold text-primary">
                  {marker.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {marker.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Trust markers are placeholders — update with real numbers before launch.
        </p>
      </section>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <AboutPageContent />
      </main>
      <SiteFooter />
    </>
  );
}
