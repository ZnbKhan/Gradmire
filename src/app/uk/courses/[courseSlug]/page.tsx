import Link from "next/link";
import { ArrowRight, ChevronRight, AlertCircle, Plane } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCourse, courseHubs } from "@/data/courses";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  return courseHubs
    .filter((c) => c.countrySlug === "uk")
    .map((course) => ({
      courseSlug: course.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourse("uk", courseSlug);
  if (!course) return {};

  return {
    title: `${course.name} in the UK | Gradmire`,
    description: course.oneLiner,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourse("uk", courseSlug);

  if (!course) {
    notFound();
  }

  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* Breadcrumb */}
        <section className="gutter py-6 border-b border-line bg-paper">
          <Container>
            <nav className="flex items-center gap-2 text-sm text-ink-soft">
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
              <ChevronRight size={14} aria-hidden="true" />
              <Link href="/uk" className="hover:text-ink transition-colors">
                UK
              </Link>
              <ChevronRight size={14} aria-hidden="true" />
              <span className="text-ink font-medium">{course.name}</span>
            </nav>
          </Container>
        </section>

        {/* Hero Section */}
        <section className="gutter py-16 bg-gradient-to-b from-paper-dim to-paper">
          <Container>
            <Reveal group className="mb-8">
              <div className="mb-6">
                <Badge className="mb-2">{course.name}</Badge>
                <h1 className="text-[clamp(32px,4.6vw,52px)] font-semibold leading-tight">
                  {course.name}
                </h1>
              </div>
              <p className="text-lg text-ink-soft max-w-[60ch] mb-6">
                {course.oneLiner}
              </p>
            </Reveal>

            {course.isStub ? (
              <Reveal className="p-4 rounded-lg bg-coral-dim/30 border border-coral/20">
                <p className="text-sm text-ink-soft">
                  📚 This is a research guide. Full course recommendations and university rankings coming soon.
                </p>
              </Reveal>
            ) : (
              <Reveal group className="flex flex-wrap gap-4">
                <Cta href="/tools/roi-calculator" variant="coral">
                  Calculate ROI
                  <ArrowRight size={15} aria-hidden="true" />
                </Cta>
                <Cta href="/contact" variant="outline">
                  Book consultation
                </Cta>
              </Reveal>
            )}
          </Container>
        </section>

        {/* Overview */}
        {course.overview && (
          <section className="gutter py-16">
            <Container>
              <Reveal className="max-w-[800px]">
                <h2 className="text-2xl font-semibold mb-4">Course Overview</h2>
                <p className="text-ink-soft leading-relaxed text-base">{course.overview}</p>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Top Universities */}
        {course.universities && course.universities.length > 0 && !course.isStub && (
          <section className="gutter py-16 bg-paper-dim">
            <Container>
              <Reveal className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">Top Universities</h2>
                <p className="text-ink-soft">
                  {course.universities.length} leading institutions offering {course.name} programs
                </p>
              </Reveal>

              <Reveal group step={30} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {course.universities.map((uni, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{uni.name}</CardTitle>
                      {uni.subjectRank && (
                        <Badge variant="secondary" className="w-fit">
                          {uni.subjectRank}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-ink-soft">{uni.notableFor}</p>
                    </CardContent>
                  </Card>
                ))}
              </Reveal>
            </Container>
          </section>
        )}

        {/* Costs Section */}
        {!course.isStub && (
          <section className="gutter py-16">
            <Container>
              <Reveal group className="grid gap-8 md:grid-cols-2">
                {/* Tuition Fees */}
                <div>
                  <Reveal className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Tuition Fees</h2>
                  </Reveal>
                  <Reveal>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          <p className="text-sm text-ink-soft mb-1">Annual cost</p>
                          <p className="text-3xl font-bold text-ink">{course.tuitionRange || "—"}</p>
                        </div>
                        {course.tuitionMin && course.tuitionMax && (
                          <div>
                            <p className="text-xs text-ink-soft uppercase tracking-widest mb-2">Range</p>
                            <p className="text-sm text-ink-soft">
                              £{course.tuitionMin.toLocaleString()} – £{course.tuitionMax.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Reveal>
                </div>

                {/* Living Costs */}
                <div>
                  <Reveal className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Living Costs</h2>
                  </Reveal>
                  <Reveal>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          <p className="text-sm text-ink-soft mb-1">Monthly expenses</p>
                          <p className="text-3xl font-bold text-ink">{course.livingCosts || "—"}</p>
                        </div>
                        {course.livingCostMin && course.livingCostMax && (
                          <div>
                            <p className="text-xs text-ink-soft uppercase tracking-widest mb-2">Range</p>
                            <p className="text-sm text-ink-soft">
                              £{course.livingCostMin.toLocaleString()} – £{course.livingCostMax.toLocaleString()}/month
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Reveal>
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Salary & Career Progression */}
        {course.medianSalaryRange && (
          <section className="gutter py-16 bg-paper-dim">
            <Container>
              <Reveal className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">Salary & Career Progression</h2>
                <p className="text-ink-soft">Expected salary ranges based on graduate outcomes</p>
              </Reveal>

              <Reveal group step={30} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardDescription>Graduate</CardDescription>
                    <CardTitle>{course.medianSalaryRange}</CardTitle>
                  </CardHeader>
                </Card>
                {course.salaryProgressionOneYear && (
                  <Card>
                    <CardHeader>
                      <CardDescription>1 Year Experience</CardDescription>
                      <CardTitle>{course.salaryProgressionOneYear}</CardTitle>
                    </CardHeader>
                  </Card>
                )}
                {course.salaryProgressionThreeYear && (
                  <Card>
                    <CardHeader>
                      <CardDescription>3 Years Experience</CardDescription>
                      <CardTitle>{course.salaryProgressionThreeYear}</CardTitle>
                    </CardHeader>
                  </Card>
                )}
                {course.salaryProgressionFiveYear && (
                  <Card>
                    <CardHeader>
                      <CardDescription>5 Years Experience</CardDescription>
                      <CardTitle>{course.salaryProgressionFiveYear}</CardTitle>
                    </CardHeader>
                  </Card>
                )}
              </Reveal>
            </Container>
          </section>
        )}

        {/* Top Sectors & Employers */}
        {(course.topSectors?.length || 0) > 0 || (course.commonEmployers?.length || 0) > 0 ? (
          <section className="gutter py-16">
            <Container>
              <Reveal group className="grid gap-8 md:grid-cols-2">
                {/* Top Sectors */}
                {(course.topSectors?.length || 0) > 0 && (
                  <div>
                    <Reveal className="mb-6">
                      <h2 className="text-xl font-semibold">Top Sectors</h2>
                    </Reveal>
                    <Reveal>
                      <div className="flex flex-wrap gap-2">
                        {course.topSectors?.map((sector) => (
                          <Badge key={sector} variant="secondary">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </Reveal>
                  </div>
                )}

                {/* Common Employers */}
                {(course.commonEmployers?.length || 0) > 0 && (
                  <div>
                    <Reveal className="mb-6">
                      <h2 className="text-xl font-semibold">Common Employers</h2>
                    </Reveal>
                    <Reveal>
                      <div className="flex flex-wrap gap-2">
                        {course.commonEmployers?.map((employer) => (
                          <Badge key={employer} className="bg-coral-dim text-coral">
                            {employer}
                          </Badge>
                        ))}
                      </div>
                    </Reveal>
                  </div>
                )}
              </Reveal>
            </Container>
          </section>
        ) : null}

        {/* Entry Requirements */}
        {course.entryRequirements && course.entryRequirements.length > 0 && !course.isStub && (
          <section className="gutter py-16 bg-paper-dim">
            <Container>
              <Reveal className="mb-8">
                <h2 className="text-2xl font-semibold">Entry Requirements</h2>
              </Reveal>

              <Reveal className="max-w-[800px]">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {course.entryRequirements.map((req, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-coral font-bold shrink-0">•</span>
                          <span className="text-ink-soft">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Application Deadlines */}
        {course.applicationDeadlines && course.applicationDeadlines.length > 0 && !course.isStub && (
          <section className="gutter py-16">
            <Container>
              <Reveal className="mb-8">
                <h2 className="text-2xl font-semibold">Application Deadlines</h2>
                {course.deadlineWarning && (
                  <p className="text-sm text-coral mt-2 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                    {course.deadlineWarning}
                  </p>
                )}
              </Reveal>

              <Reveal group step={30} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {course.applicationDeadlines.map((deadline, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-base">{deadline.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-ink-soft">{deadline.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </Reveal>
            </Container>
          </section>
        )}

        {/* ATAS & Visa Information */}
        {(course.atasRequired !== undefined || (course.visaNotes && course.visaNotes.length > 0)) && !course.isStub && (
          <section className="gutter py-16 bg-paper-dim">
            <Container>
              <Reveal group className="grid gap-8 md:grid-cols-2">
                {/* ATAS */}
                {course.atasRequired !== undefined && (
                  <div>
                    <Reveal className="mb-6">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AlertCircle size={24} className="text-coral" aria-hidden="true" />
                        ATAS Requirement
                      </h2>
                    </Reveal>
                    <Reveal>
                      <Card>
                        <CardContent className="pt-6">
                          <Badge className={course.atasRequired ? "bg-coral-dim text-coral" : "bg-brandgreen-dim text-brandgreen"}>
                            {course.atasRequired ? "Required" : "Not Required"}
                          </Badge>
                          <p className="text-sm text-ink-soft mt-3">
                            {course.atasRequired
                              ? "Academic Technology Approval Scheme clearance is required. This may add 4-6 weeks to your application timeline."
                              : "You do not need ATAS clearance for this course."}
                          </p>
                        </CardContent>
                      </Card>
                    </Reveal>
                  </div>
                )}

                {/* Visa */}
                {course.visaNotes && course.visaNotes.length > 0 && (
                  <div>
                    <Reveal className="mb-6">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Plane size={24} className="text-coral" aria-hidden="true" />
                        Visa & Work Rights
                      </h2>
                    </Reveal>
                    <Reveal>
                      <Card>
                        <CardContent className="pt-6">
                          <ul className="space-y-3">
                            {course.visaNotes.map((note, idx) => (
                              <li key={idx} className="flex gap-3 text-sm">
                                <span className="text-coral font-bold shrink-0 mt-0.5">•</span>
                                <span className="text-ink-soft">{note}</span>
                              </li>
                            ))}
                          </ul>
                          {course.extraNote && (
                            <p className="text-sm text-ink-soft mt-4 pt-4 border-t border-line">
                              💡 {course.extraNote}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Reveal>
                  </div>
                )}
              </Reveal>
            </Container>
          </section>
        )}

        {/* CTA Section */}
        <section className="gutter py-16">
          <Container>
            <Reveal className="rounded-3xl bg-gradient-to-r from-ink to-ink-3 px-8 py-14 text-center text-white">
              <h2 className="mb-3 text-3xl font-semibold">
                {course.isStub ? "Research guide coming soon" : "Ready to apply?"}
              </h2>
              <p className="mx-auto mb-8 max-w-[42ch] text-paper/70">
                {course.isStub
                  ? "Check back soon for detailed course information and university rankings."
                  : "Get personalized guidance through every step of the application process."}
              </p>
              <div className="flex flex-wrap justify-center gap-3.5">
                <Cta href="/tools/course-finder" variant="onDark" className="hover:bg-gold hover:text-white">
                  Take the quiz
                  <ArrowRight size={15} aria-hidden="true" />
                </Cta>
                <Cta href="/contact" variant="outline" className="border-white/35 text-white hover:bg-white/10">
                  Book consultation
                </Cta>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
