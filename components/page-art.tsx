import * as React from "react";
import { PAGE_ART_SVG, PAGE_ART_VIEWBOX } from "@/lib/page-art-svg";

/**
 * Inline SVG artwork for legacy pages.
 *
 * The institute's scrape attached one generic animated "NEW" starburst to
 * every migrated page, which said nothing about the page it appeared on. Each
 * page instead gets a relevant, licence-free illustration, recoloured to the
 * brand blue through `currentColor`.
 *
 * The marks are inlined rather than loaded via <img> so they inherit the
 * surrounding text colour and scale with the layout. The one exception is the
 * Government of India's RTI logo, a raster that keeps its official colours.
 */

const RASTER = /\.(gif|png|jpe?g|webp)$/i;

/** "cap.svg" -> "cap": the generated module is keyed by bare name. */
const key = (name: string) => name.replace(/\.svg$/i, "");

export function PageArt({ name }: { name: string }) {
  const markup = React.useMemo(() => {
    if (RASTER.test(name)) return null;
    const id = key(name);
    const body = PAGE_ART_SVG[id];
    if (!body) return "";
    const viewBox = PAGE_ART_VIEWBOX[id] ?? "0 0 100 100";
    return `<svg viewBox="${viewBox}" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
  }, [name]);

  if (RASTER.test(name)) {
    return (
      <span className="page-art page-art-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/images/page-art/${name}`}
          alt=""
          aria-hidden="true"
        />
      </span>
    );
  }

  if (!markup) return null;
  return (
    <span className="page-art" dangerouslySetInnerHTML={{ __html: markup }} />
  );
}
