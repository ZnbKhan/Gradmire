"use client";

import { useState, useMemo } from "react";
import {
  GitCompare,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCountry } from "@/data/countries";
import type { CourseHub } from "@/data/courses";

const MAX_COMPARE = 3;

/** Calculate value score (higher is better: higher salary per cost unit) */
function getValueScore(hub: CourseHub): number {
  if (!hub.salaryMin || !hub.tuitionMin) return 0;
  const avgSalary = (hub.salaryMin + (hub.salaryMax ?? hub.salaryMin)) / 2;
  const totalCost = hub.tuitionMin + (hub.livingCostMin ?? 0) * 12;
  return totalCost > 0 ? avgSalary / totalCost : 0;
}

export default function ComparatorPage({ hubs }: { hubs: CourseHub[] }) {
  const allHubs = hubs;
  const [selected, setSelected] = useState<string[]>([]);

  const selectedCourses = selected
    .map((slug) => allHubs.find((h) => h.slug === slug))
    .filter(Boolean) as CourseHub[];

  // Find best value course
  const topPickSlug = useMemo(() => {
    if (selectedCourses.length === 0) return null;
    const scores = selectedCourses.map((c) => ({ slug: c.slug, score: getValueScore(c) }));
    return scores.reduce((best, current) =>
      current.score > best.score ? current : best
    ).slug ?? null;
  }, [selectedCourses]);

  const addCourse = (slug: string) => {
    if (selected.length < MAX_COMPARE && !selected.includes(slug)) {
      setSelected([...selected, slug]);
    }
  };

  const removeCourse = (slug: string) => {
    setSelected(selected.filter((s) => s !== slug));
  };

  const comparisonRows = [
    {
      label: "Destination",
      render: (c: CourseHub) => {
        const country = getCountry(c.countrySlug);
        return country ? `${country.flagEmoji} ${country.name}` : c.countrySlug;
      },
    },
    {
      label: "Tuition (Annual)",
      render: (c: CourseHub) => c.tuitionRange || "—",
    },
    {
      label: "Living Costs (Monthly)",
      render: (c: CourseHub) => c.livingCosts || "—",
    },
    {
      label: "Median Salary",
      render: (c: CourseHub) => c.medianSalaryRange || "—",
    },
    {
      label: "Top Sectors",
      render: (c: CourseHub) => c.topSectors?.join(", ") || "—",
    },
    {
      label: "Universities",
      render: (c: CourseHub) =>
        c.universities ? `${c.universities.length} listed` : "—",
    },
    {
      label: "ATAS Required",
      render: (c: CourseHub) =>
        c.atasRequired ? (
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <AlertTriangle className="h-3.5 w-3.5" /> Yes
          </span>
        ) : (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle className="h-3.5 w-3.5" /> No
          </span>
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl gutter py-8 sm:py-16">
      <div className="text-center mb-8 sm:mb-10">
        <Badge variant="outline" className="mb-4">
          <GitCompare className="mr-1.5 h-3.5 w-3.5" />
          Course Comparator
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold">Compare Courses Side by Side</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Select up to {MAX_COMPARE} courses to compare tuition, salary, and
          more.
        </p>
      </div>

      {/* Picker */}
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6">
          <Label className="text-sm font-medium">
            Select courses to compare ({selected.length}/{MAX_COMPARE})
          </Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {allHubs.map((hub) => {
              const isSelected = selected.includes(hub.slug);
              const isTopPick = topPickSlug === hub.slug && selectedCourses.length > 1;
              return (
                <div key={hub.slug} className="relative inline-block">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      isSelected ? removeCourse(hub.slug) : addCourse(hub.slug)
                    }
                    disabled={!isSelected && selected.length >= MAX_COMPARE}
                    className="gap-1.5"
                  >
                    {isSelected ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                    {hub.name}
                  </Button>
                  {isTopPick && (
                    <Badge className="absolute -top-2 -right-2 bg-amber-500 text-xs gap-1 px-1.5">
                      <Crown className="h-2.5 w-2.5" />
                      Top Pick
                    </Badge>
                  )}
                  {hub.atasRequired && isSelected && (
                    <Badge variant="destructive" className="absolute -top-2 left-0 text-xs">
                      ATAS
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedCourses.length > 0 ? (
        <Card>
          {/* tabIndex: the only way to scroll this region by keyboard. */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Course comparison"
            className="scroll-x-hint overflow-x-auto"
          >
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32 sm:w-48 font-semibold text-xs sm:text-sm">Feature</TableHead>
                  {selectedCourses.map((c) => (
                    <TableHead key={c.slug} className="min-w-[160px] sm:min-w-[200px]">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs sm:text-sm">{c.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourse(c.slug)}
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium text-xs sm:text-sm text-muted-foreground">
                      {row.label}
                    </TableCell>
                    {selectedCourses.map((c) => (
                      <TableCell key={c.slug} className="text-xs sm:text-sm">
                        {row.render(c)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <GitCompare className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-muted-foreground">
              Select courses to compare
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Pick up to {MAX_COMPARE} course areas above to see them
              side by side.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
