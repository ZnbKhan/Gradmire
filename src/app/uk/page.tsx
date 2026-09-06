import Image from "next/image";
import { ArrowRight, Search, Book, Building2, MapPin, FileText } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { CoursePassCard } from "@/components/brand/course-pass-card";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { courseHubs } from "@/data/courses";

export const revalidate = 3600;


const POPULAR_COURSES = [
  "Computer Science",
  "Business",
  "Data Science",
  "Engineering",
];

const FEATURES = [
  {
    icon: Book,
    title: "Explore Courses",
    description: "Find what fits you"
  },
  {
    icon: Building2,
    title: "Discover Universities",
    description: "Compare and shortlist"
  },
  {
    icon: MapPin,
    title: "Explore Cities",
    description: "Find your perfect place"
  },
  {
    icon: FileText,
    title: "Get Guidance",
    description: "From application to arrival"
  },
];

export default async function UKPage() {
  const ukCourses = courseHubs.filter((c) => c.countrySlug === "uk");
  const liveCourses = ukCourses.filter((c) => !c.isStub);
  const comingSoonCourses = ukCourses.filter((c) => c.isStub);

  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* Hero Section with Light Blue Background */}
        <section className="relative bg-gradient-to-b from-[#EBF4FF] to-[#E8F1FF] overflow-hidden pt-12 pb-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <span className="eyebrow text-blue-600">Study Abroad, Reordered</span>
                <h1 className="text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-[1.1] my-6">
                  Find your course.<br />
                  Then find <em className="italic text-blue-600 font-semibold not-italic">the UK</em> around it.
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-[500px] leading-relaxed">
                  Most platforms start with &quot;pick a country.&quot; We start with what actually shapes your career &mdash; your subject. Get matched to programmes first, then the universities and cities built around them.
                </p>

                {/* Search Form */}
                <div className="flex gap-3 mb-6 flex-col sm:flex-row">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="What do you want to study?"
                      className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <Cta href="/tools/course-finder" variant="coral" className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                    Find my course
                    <ArrowRight size={18} />
                  </Cta>
                </div>

                {/* Popular Tags */}
                <div className="mb-12">
                  <p className="text-sm text-gray-500 mb-3 font-medium">Popular:</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_COURSES.map((course) => (
                      <button
                        key={course}
                        className="px-4 py-2 rounded-full bg-white text-gray-700 text-sm border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        {course}
                      </button>
                    ))}
                    <button className="px-4 py-2 rounded-full bg-white text-gray-700 text-sm border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-colors">
                      More +
                    </button>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-300">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                    <p className="text-xs text-gray-600">UK subject hubs live</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">5 min</p>
                    <p className="text-xs text-gray-600">to get started</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">10K+</p>
                    <p className="text-xs text-gray-600">students guided</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Hero Image with Floating Cards */}
              <div className="relative h-[500px] hidden lg:block">
                {/* Big Ben Image */}
                <Image
                  src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=700&fit=crop&q=85"
                  alt="Big Ben London"
                  width={600}
                  height={700}
                  className="w-full h-full object-cover rounded-3xl shadow-lg"
                />

                {/* Floating Info Cards */}
                <div className="absolute -top-12 -right-8 bg-white rounded-2xl p-4 shadow-xl max-w-[180px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 rounded-full p-2">
                      <span className="text-blue-600 text-lg">🎓</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">1 year</p>
                      <p className="text-xs text-gray-600">Shorter Master&rsquo;s degrees</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/3 -right-4 bg-white rounded-2xl p-4 shadow-xl max-w-[180px]">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <span className="text-blue-600 text-lg">✈️</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">2 years</p>
                      <p className="text-xs text-gray-600">Graduate Route work visa</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 -right-8 bg-white rounded-2xl p-4 shadow-xl max-w-[180px]">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <span className="text-blue-600 text-lg">🏆</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">4 of 10</p>
                      <p className="text-xs text-gray-600">World&rsquo;s top ten universities</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-4 shadow-xl">
                  <p className="text-sm text-gray-700 italic mb-3">
                    &quot;Your UK journey starts here&quot;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" alt="Student" className="w-6 h-6 rounded-full border-2 border-white" />
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" alt="Student" className="w-6 h-6 rounded-full border-2 border-white" />
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" alt="Student" className="w-6 h-6 rounded-full border-2 border-white" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">10,000+ students are building their future with Gradmire</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="gutter py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                    <Icon className="text-blue-600 mb-3" size={24} />
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Trust Section */}
        <section className="gutter py-12 bg-white border-t border-gray-100">
          <Container>
            <p className="text-sm text-gray-600 text-center mb-6">Trusted by students worldwide</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {["UCL", "Edinburgh", "Manchester"].map((uni) => (
                <div key={uni} className="h-10 bg-gray-100 px-4 rounded flex items-center">
                  <p className="text-xs font-semibold text-gray-700">{uni}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Courses Section */}
        <section id="courses" className="gutter py-20 bg-gray-50">
          <Container>
            <div className="mb-12">
              <span className="inline-block text-blue-600 text-sm font-semibold tracking-wide mb-3">Browse by course</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                All UK courses
              </h2>
              <p className="text-gray-600 max-w-2xl">
                {liveCourses.length} courses live with full university rankings, fees, and career outcomes. {comingSoonCourses.length} more research guides coming soon.
              </p>
            </div>

            {/* Live Courses */}
            {liveCourses.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wider mb-6">
                  Live Guides
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {liveCourses.map((hub) => (
                    <CoursePassCard
                      key={hub.slug}
                      code={hub.icon ? "" : ""}
                      name={hub.name}
                      description={hub.oneLiner}
                      universityCount={hub.universities?.length ?? 0}
                      isStub={false}
                      href={`/uk/courses/${hub.slug}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Coming Soon Courses */}
            {comingSoonCourses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-600 uppercase tracking-wider mb-6">
                  Research Guides
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {comingSoonCourses.map((hub) => (
                    <CoursePassCard
                      key={hub.slug}
                      code={hub.icon ? "" : ""}
                      name={hub.name}
                      description={hub.oneLiner}
                      universityCount={0}
                      isStub={true}
                      href={`/uk/courses/${hub.slug}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>

        {/* CTA Section */}
        <section className="gutter py-16 bg-white">
          <Container>
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-16 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to start your UK journey?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Book a free consultation. We&rsquo;ll help you shortlist the right programmes and guide you through every step, from applications to visa.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Cta
                  href="/contact"
                  variant="onDark"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  Book free consultation
                  <ArrowRight size={18} />
                </Cta>
                <Cta
                  href="/tools/course-finder"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Try course finder
                </Cta>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
