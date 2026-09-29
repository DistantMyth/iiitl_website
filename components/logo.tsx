import type { CSSProperties } from "react";

/**
 * Inline IIIT Lucknow crest.
 *
 * Path data is traced from assets/logos/iiitl_main_logo.png by
 * scripts/vectorize_logo.py and emitted as <symbol> fragments in
 * /brand/iiitl-mark.svg. We reference them with <use> rather than inlining the
 * geometry, which keeps this component tiny while every ink stays independently
 * addressable from CSS:
 *
 *   .brand-mark .iiitl-green { fill: var(--green); }
 *   .brand-mark .iiitl-blue  { filter: drop-shadow(...); }
 *
 * Variants:
 *   "square" -> padded 1:1 canvas (avatars, app tiles, favicons, og:image)
 *   "crest"  -> tight crop with transparent edges (headers, navbars)
 *   "full"   -> crest + Devanagari wordmark lockup (footer, splash)
 */

/** Ink names and default fills, sampled from the master artwork. */
const INKS = [
  ["green", "#008325"],
  ["brown", "#792E0E"],
  ["orange", "#DE6C1A"],
  ["blue", "#005F99"],
  ["navy", "#00446D"],
] as const;

type Ink = (typeof INKS)[number][0];
type Variant = "square" | "crest" | "full";

/** viewBox + wrapper transform, kept in sync with scripts/vectorize_logo.py. */
const FRAMING: Record<Variant, { viewBox: string; transform?: string }> = {
  square: { viewBox: "0 0 2451 2451", transform: "translate(91,322)" },
  crest: { viewBox: "0 0 2269 1810" },
  full: { viewBox: "0 0 2269 2039" },
};

export type LogoProps = {
  variant?: Variant;
  /**
   * Accessible name. Pass `null` when adjacent visible text already labels the
   * link, so screen readers do not announce the name twice.
   */
  title?: string | null;
  className?: string;
  style?: CSSProperties;
};

export function Logo({
  variant = "crest",
  title = "Indian Institute of Information Technology, Lucknow",
  className,
  style,
}: LogoProps) {
  const { viewBox, transform } = FRAMING[variant];
  // The navy ink is the Devanagari wordmark, which only the "full" lockup has.
  const inks: readonly (readonly [Ink, string])[] =
    variant === "full" ? INKS : INKS.filter(([name]) => name !== "navy");

  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={style}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ?? undefined}
    >
      {title ? <title>{title}</title> : null}
      <g transform={transform}>
        {inks.map(([name, fill]) => (
          <g key={name} className={`iiitl-ink iiitl-${name}`} fill={fill}>
            <use href={`/brand/iiitl-mark.svg#ink-${name}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
