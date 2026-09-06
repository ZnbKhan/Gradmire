"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  Banknote,
  PiggyBank,
  Info,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getAllCountries } from "@/data/countries";
import type { CourseHub } from "@/data/courses";
import { formatMoney, DEFAULT_CURRENCY } from "@/lib/money";
import { PRIMARY_DESTINATION } from "@/config/site";

/** Range helper: reads the hub's own min/max, defaulting an absent bound to the other. */
function range(min: number | undefined, max: number | undefined) {
  const low = min ?? max ?? 0;
  const high = max ?? min ?? 0;
  return { low, high };
}

/**
 * Parse salary range strings like "£42,000–£75,000" into numeric min/max.
 * Handles various currency symbols and formats.
 */
function parseSalaryRange(rangeStr: string | undefined): { low: number; high: number } | null {
  if (!rangeStr) return null;
  // Match patterns like £42,000–£75,000 or $42000-$75000
  const match = rangeStr.match(/[\d,]+/g);
  if (!match || match.length < 2) return null;
  const low = parseInt(match[0].replace(/,/g, ""), 10);
  const high = parseInt(match[1].replace(/,/g, ""), 10);
  if (isNaN(low) || isNaN(high)) return null;
  return { low, high };
}

/** Component to display salary progression chart */
function SalaryProgressionChart({
  year1,
  year3,
  year5,
}: {
  year1?: string;
  year3?: string;
  year5?: string;
}) {
  const data = [
    { year: "Year 1", range: year1 },
    { year: "Year 3", range: year3 },
    { year: "Year 5", range: year5 },
  ].filter((d) => d.range);

  const parsed = data.map((d) => ({
    ...d,
    values: parseSalaryRange(d.range),
  }));

  if (parsed.length === 0 || parsed.some((p) => !p.values)) return null;

  // Find max value for scaling
  const maxValue = Math.max(
    ...parsed.map((p) => p.values?.high ?? 0)
  );
  const scale = maxValue > 0 ? 100 / maxValue : 1;

  return (
    <div className="space-y-4">
      {parsed.map((item) => {
        const low = item.values!.low;
        const high = item.values!.high;
        const lowPct = low * scale;
        const highPct = high * scale;
        const midPct = (lowPct + highPct) / 2;

        return (
          <div key={item.year}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                {item.year}
              </span>
              <span className="text-xs font-semibold text-primary">
                {item.range}
              </span>
            </div>
            <div className="relative h-6 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute top-0 bottom-0 rounded-full gradient-primary opacity-80 transition-all"
                style={{
                  left: `${lowPct}%`,
                  right: `${100 - highPct}%`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow transition-all"
                style={{
                  left: `${midPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                ↑
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ROICalculatorPage({ hubs }: { hubs: CourseHub[] }) {
  // V1 ships one destination; picking one with no hubs would show that
  // destination's courses under another flag.
  const countries = getAllCountries().filter((c) => c.live);
  const [selectedCountry, setSelectedCountry] = useState(PRIMARY_DESTINATION);
  const [selectedCourse, setSelectedCourse] = useState("");

  const availableCourses = hubs;

  const course = availableCourses.find((c) => c.slug === selectedCourse);
  const currency = course?.currency ?? DEFAULT_CURRENCY;

  const calculations = useMemo(() => {
    if (!course) return null;
    // Raw figures from the database, not a re-parse of the display string —
    // see CourseHub's numeric fields and lib/tool-data.ts.
    const tuition = range(course.tuitionMin, course.tuitionMax);
    const living = range(course.livingCostMin, course.livingCostMax);
    const salary = range(course.salaryMin, course.salaryMax);

    const totalCostLow = tuition.low + living.low * 12;
    const totalCostHigh = tuition.high + living.high * 12;
    const avgCost = (totalCostLow + totalCostHigh) / 2;
    const avgSalary = (salary.low + salary.high) / 2;
    const roiRatio = avgSalary > 0 ? avgSalary / avgCost : 0;

    return {
      tuition,
      living,
      salary,
      totalCostLow,
      totalCostHigh,
      avgCost,
      avgSalary,
      roiRatio,
    };
  }, [course]);

  const fmt = (n: number) => formatMoney(Math.round(n), currency);

  return (
    <div className="mx-auto max-w-3xl gutter py-8 sm:py-16">
      <div className="text-center mb-8 sm:mb-10">
        <Badge variant="outline" className="mb-4">
          <Calculator className="mr-1.5 h-3.5 w-3.5" />
          ROI Calculator
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold">Return on Investment Calculator</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Compare your study costs against expected graduate earnings.
        </p>
      </div>

      {/* Selectors */}
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium">Destination</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {countries.map((c) => (
                <Button
                  key={c.slug}
                  variant={selectedCountry === c.slug ? "default" : "outline"}
                  size="sm"
                  disabled={!c.live}
                  onClick={() => {
                    setSelectedCountry(c.slug);
                    setSelectedCourse("");
                  }}
                  className="gap-1.5"
                >
                  <span>{c.flagEmoji}</span>
                  {c.shortLabel}
                  {!c.live && (
                    <Badge variant="secondary" className="ml-1 text-micro">
                      Soon
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Course</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableCourses.map((c) => (
                <Button
                  key={c.slug}
                  variant={selectedCourse === c.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCourse(c.slug)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {course && calculations ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <Card>
              <CardContent className="p-3 sm:p-5 text-center">
                <Banknote className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-primary/50" />
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Annual Tuition
                </div>
                <div className="mt-1 text-base sm:text-xl font-bold break-words">
                  {course.tuitionRange}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-5 text-center">
                <PiggyBank className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-primary/50" />
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Monthly Living
                </div>
                <div className="mt-1 text-base sm:text-xl font-bold break-words">
                  {course.livingCosts}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-5 text-center">
                <TrendingUp className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-primary/50" />
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Median Salary
                </div>
                <div className="mt-1 text-base sm:text-xl font-bold break-words">
                  {course.medianSalaryRange}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estimated Total Cost */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                Estimated Total Cost (1-Year Master&apos;s)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm text-muted-foreground">
                    Low Estimate
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {fmt(calculations.totalCostLow)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {fmt(calculations.tuition.low)} tuition + {fmt(calculations.living.low * 12)}{" "}
                    living
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm text-muted-foreground">
                    High Estimate
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {fmt(calculations.totalCostHigh)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {fmt(calculations.tuition.high)} tuition + {fmt(calculations.living.high * 12)}{" "}
                    living
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI */}
          <Card className="gradient-primary text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold">
                Year-1 Salary vs. Total Cost
              </h3>
              <div className="mt-4 text-5xl font-extrabold">
                {calculations.roiRatio.toFixed(2)}x
              </div>
              <p className="mt-2 text-white/80 text-sm">
                Average year-1 salary ({fmt(calculations.avgSalary)}) is{" "}
                <strong>{calculations.roiRatio.toFixed(2)}x</strong> average
                total cost ({fmt(calculations.avgCost)})
              </p>
              <p className="mt-4 text-xs text-white/60">
                This is a simplified estimate. Actual returns depend on your
                specific programme, location, and career trajectory.
              </p>
            </CardContent>
          </Card>

          {/* Salary Progression */}
          {(course.salaryProgressionOneYear ||
            course.salaryProgressionThreeYear ||
            course.salaryProgressionFiveYear) && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Career Salary Progression</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Expected salary growth over the first 5 years
                </p>
                <SalaryProgressionChart
                  year1={course.salaryProgressionOneYear}
                  year3={course.salaryProgressionThreeYear}
                  year5={course.salaryProgressionFiveYear}
                />
              </CardContent>
            </Card>
          )}

          <div className="callout-info flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Calculations assume a 1-year Master&apos;s programme. Living costs
              are extrapolated to 12 months. Salary data represents the
              destination&rsquo;s median graduate outcomes — actual salaries
              vary by location, employer, and role.
            </p>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Calculator className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-muted-foreground">
              Select a course to calculate ROI
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Choose a destination and course above to see the cost breakdown.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
