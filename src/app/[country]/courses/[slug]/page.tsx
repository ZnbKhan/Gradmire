import { notFound } from "next/navigation";
import { courseHubs } from "@/data/courses";

export const revalidate = 3600;

export async function generateStaticParams() {
  return courseHubs.map((hub) => ({
    country: hub.countrySlug,
    slug: hub.slug,
  }));
}

export default function CourseSlugPage() {
  notFound();
}