import { cn } from "@/lib/utils";

/**
 * The site-wide content column.
 *
 * `mx-auto max-w-[1180px]` was written out by hand in twenty places across
 * nine files, so the one measurement every page agrees on was the one thing
 * no file owned. Changing it is now a single edit.
 *
 * Horizontal padding stays on the surrounding <section>, because sections set
 * their own background and need the padding outside the column, not inside it.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto max-w-[1180px]", className)}>{children}</div>;
}
