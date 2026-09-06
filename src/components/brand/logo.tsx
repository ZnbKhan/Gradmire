import Link from "next/link";

interface LogoProps {
  /**
   * "color" and "navy" both resolve to the navy mark — there is only one
   * colour version of the logo. "white" is the reversed mark for dark
   * surfaces (the footer, the mobile nav scrim); it is fully transparent
   * outside the glyph, so it renders as a blank rectangle on a light
   * background — that's expected, not a missing asset.
   */
  variant?: "color" | "white" | "navy";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Intrinsic asset is 900×243 (≈3.7:1). Widths below keep that ratio so the
 * `<img>` never reports the wrong aspect and shifts layout on load.
 */
const sizeMap = {
  sm: { width: 100, height: 27 },
  md: { width: 150, height: 41 },
  lg: { width: 200, height: 54 },
};

/**
 * Renders the actual brand mark (the flight-path "G", the wordmark, and the
 * graduation cap over the second "e") as a raster image.
 *
 * This used to be a hand-drawn placeholder SVG approximating the mark — a
 * plain zigzag "plane" and a generic bold sans-serif "Gradmire" — while the
 * real, designed logo sat unused at the repo root. Swapped to the real
 * asset here rather than re-tracing it as an SVG, so the brand mark this
 * component renders can never again drift from the one the client approved.
 */
export function Logo({ variant = "color", size = "md", className = "" }: LogoProps) {
  const { width, height } = sizeMap[size];
  const src = variant === "white" ? "/gradmire-logo-white.png" : "/gradmire-logo.png";

  return (
    // Plain <img>, not next/image: this is a static, site-wide asset with no
    // responsive source set to pick between, and it renders in the header on
    // every route — skipping the optimizer avoids a request to /_next/image
    // on the one element that is almost always above the fold.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Gradmire"
      width={width}
      height={height}
      fetchPriority="high"
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}

interface LogoLinkProps extends LogoProps {
  href?: string;
}

/**
 * The wordmark is baked into the image itself, so — unlike the old
 * placeholder icon, which needed an adjacent text label to read as a name —
 * this renders the mark alone.
 */
export function LogoLink({
  href = "/",
  variant = "color",
  size = "md",
  className = "",
}: LogoLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center transition-opacity hover:opacity-75 ${className}`}
    >
      <Logo variant={variant} size={size} />
    </Link>
  );
}
