import { notFound } from "next/navigation";
import { courseHubs } from "@/data/courses";

export const revalidate = 3600;

export async function generateStaticParams() {
  const countries = Array.from(new Set(courseHubs.map((c) => c.countrySlug)));
  return countries.map((country) => ({
    country,
  }));
}

export default function CountryPage() {
  notFound();
}