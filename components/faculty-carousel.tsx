"use client";

/**
 * Adapted from the Connected Carousel component
 * (21st.dev/@arunachalam/components/connected-carousel, also vendored at
 * website_temp_external_components/connected-carousel/).
 *
 * The upstream build is minified and leans on framer-motion plus next/image,
 * neither of which this site depends on, so this is a clean-room rebuild of the
 * same interaction rather than a port of that file:
 *
 *   - one card is centred, the rest are offset by a fixed ladder (PA upstream)
 *   - advancing swaps the card and cross-fades the outgoing one
 *   - autoplay on a timer, suspended on hover, focus and tab-hidden
 *   - a progress bar under the dots fills across the dwell, so the reader can
 *     see when it will move on
 *   - the dot row doubles as a tablist and is keyboard operable
 *
 * The slide is a faculty profile, so the copy is the research area and the
 * person's name, and the two images become portrait + department.
 */
import * as React from "react";

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export interface FacultySlide {
  id: string;
  /** Research area or specialism, shown as the headline. */
  stat: string;
  quote: string;
  author: string;
  role: string;
  /** Portrait shown on the resting card. */
  defaultImage?: string;
  /** Department or lab photograph shown when the card is selected. */
  selectedImage?: string;
  alt: string;
  href?: string;
}

export interface FacultyCarouselProps {
  items: FacultySlide[];
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  label?: string;
  className?: string;
}

export function FacultyCarousel({
  items,
  autoPlayInterval = 6000,
  pauseOnHover = true,
  label = "Faculty highlights",
  className,
}: FacultyCarouselProps) {
  const count = items.length;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [phase, setPhase] = React.useState(0);

  // Folded so the ring can be walked in either direction without wrapping bugs.
  const active = ((index % count) + count) % count;
  const slide = items[active];

  // Restart the progress bar whenever the slide or the running state changes,
  // so it always reflects the dwell that is actually happening.
  React.useEffect(() => {
    setPhase(0);
    if (!autoPlayInterval || count < 2 || paused || hidden) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / autoPlayInterval);
      setPhase(t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, autoPlayInterval, count, paused, hidden]);

  React.useEffect(() => {
    if (!autoPlayInterval || count < 2 || paused || hidden) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = window.setTimeout(
      () => setIndex((i) => i + 1),
      autoPlayInterval,
    );
    return () => window.clearTimeout(id);
  }, [active, autoPlayInterval, count, paused, hidden]);

  // A carousel nobody is looking at should not keep cycling.
  React.useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const nudge = React.useCallback((by: number) => setIndex((i) => i + by), []);

  // Roving arrow-key support across the tablist.
  const onTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nudge(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudge(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setIndex(count - 1);
    }
  };

  if (!count) return null;

  return (
    <div
      className={cn("faculty-carousel", className)}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="faculty-carousel-card"
        key={slide.id}
        role="group"
        aria-roledescription="slide"
        aria-label={`${active + 1} of ${count}`}
      >
        <div className="faculty-carousel-body">
          <h3 className="faculty-carousel-stat">{slide.stat}</h3>
          <blockquote className="faculty-carousel-quote">
            <span aria-hidden="true">&ldquo;</span>
            {slide.quote}
          </blockquote>
          <div className="faculty-carousel-who">
            <span className="faculty-carousel-name">{slide.author}</span>
            <span className="faculty-carousel-rule" aria-hidden="true" />
            <span className="faculty-carousel-role">{slide.role}</span>
          </div>
        </div>
        <div className="faculty-carousel-media">
          {slide.selectedImage ? (
            <img
              src={slide.selectedImage}
              alt={slide.alt}
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="faculty-carousel-portrait">
              {slide.defaultImage ? (
                <img
                  src={slide.defaultImage}
                  alt={slide.alt}
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <span className="faculty-carousel-initials" aria-hidden="true">
                  {slide.author
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="faculty-carousel-tabs"
        role="tablist"
        aria-label={label}
        onKeyDown={onTabsKeyDown}
      >
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`faculty-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls="faculty-carousel-panel"
              tabIndex={isActive ? 0 : -1}
              className={isActive ? "is-active" : ""}
              onClick={() => setIndex(i)}
            >
              <span className="faculty-carousel-tab-label">{item.author}</span>
              {isActive && (
                <span
                  className="faculty-carousel-progress"
                  style={{ transform: `scaleX(${phase})` }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="faculty-carousel-controls">
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Previous faculty member"
        >
          &larr;
        </button>
        <span aria-live="polite" className="faculty-carousel-count">
          {active + 1} / {count}
        </span>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Next faculty member"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
