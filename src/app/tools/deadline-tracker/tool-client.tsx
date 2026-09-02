"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CalendarDays,
  AlertTriangle,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getCountry } from "@/data/countries";
import type { CourseHub } from "@/data/courses";

const STORAGE_KEY = "gradmire-deadline-tracker";

type DeadlineItem = {
  courseSlug: string;
  courseName: string;
  countrySlug: string;
  label: string;
  detail: string;
  warning?: string;
};

function getAllDeadlines(courses: CourseHub[]): DeadlineItem[] {
  const deadlines: DeadlineItem[] = [];
  for (const course of courses) {
    if (course.applicationDeadlines) {
      for (const d of course.applicationDeadlines) {
        deadlines.push({
          courseSlug: course.slug,
          courseName: course.name,
          countrySlug: course.countrySlug,
          label: d.label,
          detail: d.detail,
          warning: course.deadlineWarning,
        });
      }
    }
  }
  return deadlines;
}

export default function DeadlineTrackerPage({ hubs }: { hubs: CourseHub[] }) {
  const allHubs = hubs;
  const [trackedSlugs, setTrackedSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTrackedSlugs(JSON.parse(stored));
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedSlugs));
    }
  }, [trackedSlugs, loaded]);

  const toggleCourse = (slug: string) => {
    setTrackedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const trackedCourses = allHubs.filter((h) => trackedSlugs.includes(h.slug));
  const deadlines = useMemo(
    () => getAllDeadlines(trackedCourses),
    [trackedCourses]
  );

  // Group deadlines by course
  const groupedDeadlines = useMemo(() => {
    const groups: Record<string, DeadlineItem[]> = {};
    for (const d of deadlines) {
      if (!groups[d.courseName]) groups[d.courseName] = [];
      groups[d.courseName].push(d);
    }
    return groups;
  }, [deadlines]);

  const uniqueWarnings = useMemo(() => {
    const warnings = new Set<string>();
    for (const d of deadlines) {
      if (d.warning) warnings.add(d.warning);
    }
    return Array.from(warnings);
  }, [deadlines]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">
          <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
          Deadline Tracker
        </Badge>
        <h1 className="text-3xl font-bold">Track Your Deadlines</h1>
        <p className="mt-2 text-muted-foreground">
          Select courses you&apos;re interested in and we&apos;ll show all
          relevant deadlines. Your selections are saved automatically.
        </p>
      </div>

      {/* Course Picker */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <Label className="text-sm font-medium">
            Courses you&apos;re tracking ({trackedSlugs.length})
          </Label>
          <div className="mt-3 space-y-2">
            {allHubs.map((hub) => {
              const isTracked = trackedSlugs.includes(hub.slug);
              const country = getCountry(hub.countrySlug);
              return (
                <Label
                  key={hub.slug}
                  htmlFor={`track-${hub.slug}`}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer hover:bg-accent ${
                    isTracked
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <Checkbox
                    id={`track-${hub.slug}`}
                    checked={isTracked}
                    onCheckedChange={() => toggleCourse(hub.slug)}
                  />
                  <span className="flex-1 font-medium text-sm">
                    {hub.name}
                  </span>
                  {country && (
                    <Badge variant="secondary" className="text-xs">
                      {country.flagEmoji} {country.shortLabel}
                    </Badge>
                  )}
                </Label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Deadline List */}
      {trackedCourses.length > 0 ? (
        <div className="space-y-6">
          {/* Warnings */}
          {uniqueWarnings.length > 0 && (
            <div className="space-y-3">
              {uniqueWarnings.map((warning, i) => (
                <div key={i} className="callout-warning flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <p className="text-sm font-medium text-amber-900">
                    {warning}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Grouped deadlines */}
          {Object.entries(groupedDeadlines).map(([courseName, items]) => (
            <Card key={courseName}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{courseName}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCourse(items[0].courseSlug)}
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </Button>
                </div>
                <div className="space-y-3">
                  {items.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-muted p-3"
                    >
                      <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {d.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {d.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="mt-2 gap-1 p-0 h-auto text-xs"
                >
                  <Link
                    href={`/${items[0].countrySlug}/courses/${items[0].courseSlug}`}
                  >
                    View full guide
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          <p className="text-center text-xs text-muted-foreground">
            Your selections are saved in your browser. They&apos;ll persist
            between visits.
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
              No courses tracked yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Select courses above to see their application deadlines.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
