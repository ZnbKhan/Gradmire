"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  Banknote,
  PiggyBank,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getAllCountries } from "@/data/countries";
import type { CourseHub } from "@/data/courses";

function parseCurrency(range: string): { low: number; high: number } {
  const nums = range.match(/[\d,]+/g);
  if (!nums || nums.length < 2) return { low: 0, high: 0 };
  return {
    low: parseInt(nums[0].replace(/,/g, ""), 10),
    high: parseInt(nums[1].replace(/,/g, ""), 10),
  };
}

export default function ROICalculatorPage({ hubs }: { hubs: CourseHub[] }) {
  // V1 ships the UK only; picking a destination with no hubs would
  // show UK courses under another flag.
  const countries = getAllCountries().filter((c) => c.live);
  const [selectedCountry, setSelectedCountry] = useState("uk");
  const [selectedCourse, setSelectedCourse] = useState("");

  const availableCourses = hubs;

  const course = availableCourses.find((c) => c.slug === selectedCourse);

  const calculations = useMemo(() => {
    if (!course) return null;
    const tuition = parseCurrency(course.tuitionRange || "");
    const living = parseCurrency(course.livingCosts || "");
    const salary = parseCurrency(course.medianSalaryRange || "");

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">
          <Calculator className="mr-1.5 h-3.5 w-3.5" />
          ROI Calculator
        </Badge>
        <h1 className="text-3xl font-bold">Return on Investment Calculator</h1>
        <p className="mt-2 text-muted-foreground">
          Compare your study costs against expected graduate earnings.
        </p>
      </div>

      {/* Selectors */}
      <Card className="mb-8">
        <CardContent className="p-6 space-y-4">
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
                    <Badge variant="secondary" className="ml-1 text-[10px]">
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
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5 text-center">
                <Banknote className="mx-auto h-8 w-8 text-primary/50" />
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Annual Tuition
                </div>
                <div className="mt-1 text-xl font-bold">
                  {course.tuitionRange}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <PiggyBank className="mx-auto h-8 w-8 text-primary/50" />
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Monthly Living
                </div>
                <div className="mt-1 text-xl font-bold">
                  {course.livingCosts}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-primary/50" />
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Median Salary
                </div>
                <div className="mt-1 text-xl font-bold">
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
                    £{calculations.totalCostLow.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    £{calculations.tuition.low.toLocaleString()} tuition + £
                    {(calculations.living.low * 12).toLocaleString()} living
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm text-muted-foreground">
                    High Estimate
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    £{calculations.totalCostHigh.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    £{calculations.tuition.high.toLocaleString()} tuition + £
                    {(calculations.living.high * 12).toLocaleString()} living
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
                Average year-1 salary (£{Math.round(calculations.avgSalary).toLocaleString()})
                is{" "}
                <strong>{calculations.roiRatio.toFixed(2)}x</strong> average
                total cost (£{Math.round(calculations.avgCost).toLocaleString()})
              </p>
              <p className="mt-4 text-xs text-white/60">
                This is a simplified estimate. Actual returns depend on your
                specific programme, location, and career trajectory.
              </p>
            </CardContent>
          </Card>

          <div className="callout-info flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Calculations assume a 1-year Master&apos;s programme. Living costs
              are extrapolated to 12 months. Salary data represents UK-wide
              median graduate outcomes — actual salaries vary by location,
              employer, and role.
            </p>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calculator className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
              Select a course to calculate ROI
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a destination and course above to see the cost breakdown.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
