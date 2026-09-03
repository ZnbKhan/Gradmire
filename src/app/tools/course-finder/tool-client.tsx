"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  BookOpen,
  Briefcase,
  Cpu,
  Wrench,
  Heart,
  Scale,
  PenTool,
  TrendingUp,
  Brain,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllCountries } from "@/data/countries";
import type { CourseHub } from "@/data/courses";
import { PRIMARY_DESTINATION } from "@/config/site";

const iconMap: Record<string, React.ElementType> = {
  Briefcase, Cpu, Wrench, Heart, Scale, PenTool, TrendingUp, Brain,
};

const gradeOptions = [
  { value: "first", label: "First Class (70%+) or GPA 3.7+" },
  { value: "upper-second", label: "Upper Second (60–69%) or GPA 3.3–3.6" },
  { value: "lower-second", label: "Lower Second (50–59%) or GPA 3.0–3.2" },
  { value: "other", label: "Below 2:2 or unsure" },
];

const budgetOptions = [
  { value: "low", label: "Under £25,000/year total" },
  { value: "mid", label: "£25,000–£40,000/year total" },
  { value: "high", label: "£40,000–£60,000/year total" },
  { value: "premium", label: "£60,000+/year (MBA-level budget)" },
];

const priorityOptions = [
  { value: "career", label: "Career outcomes & salary" },
  { value: "ranking", label: "University ranking & prestige" },
  { value: "cost", label: "Affordability & value for money" },
  { value: "visa", label: "Post-study work visa & immigration" },
];

type Answers = {
  subject: string;
  grade: string;
  budget: string;
  destinations: string[];
  priority: string;
};

/**
 * `answers.subject` is a hub slug directly — the quiz's radio options are
 * generated from the same `hubs` list this matches against, so there is no
 * separate label-to-slug table to keep in sync as hubs are added or renamed.
 */
function matchCourses(answers: Answers, hubs: CourseHub[]): CourseHub[] {
  const matched = hubs.filter((h) => h.slug === answers.subject);

  // No match (or the quiz was skipped): fall back to the first two hubs.
  if (matched.length === 0) return hubs.slice(0, 2);

  const secondary = hubs.find((h) => h.slug !== answers.subject);
  const results = [...matched];
  if (secondary) results.push(secondary);

  return results.slice(0, 2);
}

const TOTAL_STEPS = 5;

const initialAnswers: Answers = {
  subject: "",
  grade: "",
  budget: "",
  destinations: [PRIMARY_DESTINATION],
  priority: "",
};

export default function CourseFinderPage({ hubs }: { hubs: CourseHub[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [showResults, setShowResults] = useState(false);

  // Live hubs only — a stub has no content to recommend into yet.
  const subjectOptions = hubs
    .filter((h) => !h.isStub)
    .map((h) => ({ value: h.slug, label: h.name, icon: h.icon }));

  // V1 ships one destination live at a time.
  const countries = getAllCountries().filter((c) => c.live);

  const canProceed = () => {
    switch (step) {
      case 0: return !!answers.subject;
      case 1: return !!answers.grade;
      case 2: return !!answers.budget;
      case 3: return answers.destinations.length > 0;
      case 4: return !!answers.priority;
      default: return false;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else setShowResults(true);
  };

  const prev = () => {
    if (showResults) { setShowResults(false); return; }
    if (step > 0) setStep(step - 1);
  };

  const results = matchCourses(answers, hubs);

  if (showResults) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Your Recommendations</h1>
          <p className="mt-2 text-muted-foreground">
            Based on your answers, here are the courses we recommend.
          </p>
        </div>

        <div className="space-y-4">
          {results.map((course) => {
            const Icon = iconMap[course.icon] || BookOpen;
            return (
              <Card key={course.slug} className="transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {course.oneLiner}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.tuitionRange && (
                          <Badge variant="secondary">{course.tuitionRange}</Badge>
                        )}
                        {course.medianSalaryRange && (
                          <Badge variant="outline">Salary: {course.medianSalaryRange}</Badge>
                        )}
                        {course.universities && (
                          <Badge variant="outline">{course.universities.length} universities</Badge>
                        )}
                      </div>
                      <Button asChild className="mt-4 gap-2" size="sm">
                        <Link href={`/${course.countrySlug}/courses/${course.slug}`}>
                          View Full Guide
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={prev} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={() => { setStep(0); setShowResults(false); setAnswers(initialAnswers); }}>
            Start Over
          </Button>
          <Button asChild className="gap-2">
            <Link href="/contact">
              Book Free Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">
          <Search className="mr-1.5 h-3.5 w-3.5" />
          Course Finder
        </Badge>
        <h1 className="text-3xl font-bold">Find your perfect course</h1>
        <p className="mt-2 text-muted-foreground">
          Answer {TOTAL_STEPS} quick questions to get personalized recommendations.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Step {step + 1} of {TOTAL_STEPS}</span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full gradient-primary transition-all duration-500"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          {/* Step 0: Subject */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                What subject area interests you most?
              </h2>
              <RadioGroup
                value={answers.subject}
                onValueChange={(v) => setAnswers({ ...answers, subject: v })}
                className="space-y-3"
              >
                {subjectOptions.map((opt) => {
                  const Icon = iconMap[opt.icon] || BookOpen;
                  return (
                    <Label
                      key={opt.value}
                      htmlFor={`subject-${opt.value}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                    >
                      <RadioGroupItem value={opt.value} id={`subject-${opt.value}`} />
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{opt.label}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {/* Step 1: Grades */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                What are your expected or achieved grades?
              </h2>
              <RadioGroup
                value={answers.grade}
                onValueChange={(v) => setAnswers({ ...answers, grade: v })}
                className="space-y-3"
              >
                {gradeOptions.map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={`grade-${opt.value}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <RadioGroupItem value={opt.value} id={`grade-${opt.value}`} />
                    <span className="font-medium">{opt.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                What&apos;s your annual budget range?
              </h2>
              <RadioGroup
                value={answers.budget}
                onValueChange={(v) => setAnswers({ ...answers, budget: v })}
                className="space-y-3"
              >
                {budgetOptions.map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={`budget-${opt.value}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <RadioGroupItem value={opt.value} id={`budget-${opt.value}`} />
                    <span className="font-medium">{opt.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Destinations */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Which destinations are you open to?
              </h2>
              <div className="space-y-3">
                {countries.map((c) => (
                  <Label
                    key={c.slug}
                    htmlFor={`dest-${c.slug}`}
                    className={`flex items-center gap-3 rounded-lg border border-border p-4 transition-colors ${
                      c.live
                        ? "cursor-pointer hover:bg-accent"
                        : "cursor-not-allowed opacity-50"
                    } ${
                      answers.destinations.includes(c.slug)
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <Checkbox
                      id={`dest-${c.slug}`}
                      checked={answers.destinations.includes(c.slug)}
                      disabled={!c.live}
                      onCheckedChange={(checked) => {
                        if (!c.live) return;
                        setAnswers({
                          ...answers,
                          destinations: checked
                            ? [...answers.destinations, c.slug]
                            : answers.destinations.filter((d) => d !== c.slug),
                        });
                      }}
                    />
                    <span className="text-lg">{c.flagEmoji}</span>
                    <span className="font-medium">{c.name}</span>
                    {!c.live && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Coming soon
                      </Badge>
                    )}
                  </Label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Priority */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                What&apos;s your top priority?
              </h2>
              <RadioGroup
                value={answers.priority}
                onValueChange={(v) => setAnswers({ ...answers, priority: v })}
                className="space-y-3"
              >
                {priorityOptions.map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={`priority-${opt.value}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <RadioGroupItem value={opt.value} id={`priority-${opt.value}`} />
                    <span className="font-medium">{opt.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={next} disabled={!canProceed()} className="gap-2">
          {step === TOTAL_STEPS - 1 ? "See Results" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
