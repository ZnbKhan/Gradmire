import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The pill call-to-action.
 *
 * `ui/button.tsx` exists but only the four interactive tools ever imported
 * it, so every marketing CTA was a hand-copied class string. They had already
 * drifted into four sizes and three different "secondary" treatments of what
 * is meant to be one button — including two files carrying byte-identical
 * strings for the same submit button.
 *
 * Sizes are the ones already in use, kept rather than re-invented: `lg` is
 * the hero and section CTA, `md` the header and error pages, `sm` the admin
 * action bar.
 */
const ctaVariants = cva(
  // whitespace-nowrap: a wrapped label turns the pill into a tall rounded box.
  // The header CTA did exactly that at 360px, overlapping the logo.
  //
  // active:scale-[0.97] fires on pointer-down (CSS :active), not on click:
  // press feedback that waits for release reads as laggy (Apple's
  // "Designing Fluid Interfaces" — respond on touch-down, and make it
  // continuous rather than only on completion). `transition-[color,
  // background-color,border-color,transform]` rather than `transition-all`
  // so only the properties this component actually changes are on the
  // compositor's watch list.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold transition-[color,background-color,border-color,transform] active:scale-[0.97] disabled:opacity-70 disabled:active:scale-100",
  {
    variants: {
      variant: {
        /** Default. Ink that warms to coral. */
        primary: "bg-ink text-paper hover:bg-coral",
        /** For when the CTA must win against a busy section. */
        coral: "bg-coral text-white hover:bg-ink",
        /** Secondary next to a primary. */
        outline:
          "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
        /** Secondary on a dark background, where a border would disappear. */
        onDark: "bg-white text-ink hover:bg-paper-dim",
      },
      size: {
        sm: "px-4 py-2 text-[13px]",
        md: "px-5 py-2.5 text-ui",
        lg: "px-6 py-3.5 text-lede",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "lg", block: false },
  },
);

type CtaProps = VariantProps<typeof ctaVariants> & { className?: string };

/** Renders a link. Use `CtaButton` for a form submit. */
export function Cta({
  href,
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: CtaProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(ctaVariants({ variant, size, block }), className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** The same shape as a real button, for form submits and client handlers. */
export function CtaButton({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: CtaProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(ctaVariants({ variant, size, block }), className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export { ctaVariants };
