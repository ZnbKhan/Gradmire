"use client";

import { useEffect, useRef } from "react";

interface TimelineStep {
  title: string;
  icon: string;
  description: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    title: "Interest",
    icon: "🎯",
    description: "Tell us your interests and career goals",
  },
  {
    title: "Course",
    icon: "📚",
    description: "Discover perfect course matches",
  },
  {
    title: "University",
    icon: "🏛️",
    description: "Find top-ranked universities",
  },
  {
    title: "City",
    icon: "🌍",
    description: "Choose your ideal location",
  },
  {
    title: "Application",
    icon: "✍️",
    description: "Get application support",
  },
  {
    title: "Visa",
    icon: "🛂",
    description: "Navigate visa process",
  },
  {
    title: "UK 🎓",
    icon: "🎓",
    description: "Start your journey",
  },
];

export function PathTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = timelineRef.current?.querySelectorAll("[data-timeline-item]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div ref={timelineRef} className="relative flex items-center justify-between px-4">
          {/* Connecting Line */}
          <div className="absolute left-8 right-8 top-1/2 h-1 w-full -translate-y-1/2 bg-gradient-to-r from-coral/20 via-coral/60 to-coral/20" />

          {/* Timeline Items */}
          <div className="relative flex w-full justify-between gap-4">
            {TIMELINE_STEPS.map((step, index) => (
              <div
                key={step.title}
                data-timeline-item
                className="flex flex-col items-center gap-3 opacity-0 transition-all duration-500"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Circle Node */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
                  <div className="text-2xl">{step.icon}</div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="font-semibold text-ink">{step.title}</p>
                  <p className="text-xs text-ink-soft">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden">
        <div ref={timelineRef} className="relative space-y-6 pl-8">
          {/* Vertical Line */}
          <div className="absolute left-3 top-0 h-full w-1 bg-gradient-to-b from-coral via-coral/60 to-coral/20" />

          {TIMELINE_STEPS.map((step, index) => (
            <div
              key={step.title}
              data-timeline-item
              className="relative opacity-0 transition-all duration-500"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Mobile Circle Node */}
              <div className="absolute -left-7 top-0 flex h-10 w-10 items-center justify-center rounded-full border-3 border-white bg-white shadow-md">
                <div className="text-lg">{step.icon}</div>
              </div>

              {/* Content Card */}
              <div className="rounded-lg bg-coral-dim/40 p-4">
                <p className="font-semibold text-ink">{step.title}</p>
                <p className="text-sm text-ink-soft">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
