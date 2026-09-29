"use client";

/**
 * Adapted from website_temp_external_components/coverflow-carousel/coverflow-carousel.tsx.
 * Same depth-and-tilt paint loop, ported to this site's class names instead of
 * Tailwind utilities, with a keyboard-reachable caption that doubles as the
 * lightbox trigger. Loop folding, the fractional settle and the throw
 * momentum are unchanged; only the styling surface was rewritten.
 *
 * Upstream has no autoplay at all, so `autoRotate` is new: it steps the ring on
 * a timer and yields to the reader on hover, focus, drag and touch.
 */
import * as React from "react";

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

export interface GalleryCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  /**
   * Milliseconds between automatic steps. 0 (the default) leaves the carousel
   * manual, which is what the upstream component ships. Rotating is opt-in.
   */
  autoRotate?: number;
  label?: string;
  className?: string;
  /** Fired when a settled, centred card is activated. */
  onSelect?: (slide: CoverflowSlide) => void;
}

export function GalleryCarousel({
  slides,
  rotate = 40,
  depth = 0.55,
  perspective = 3.2,
  falloff = 0.56,
  fade = 0.04,
  cardWidth = "clamp(160px, 21vw, 250px)",
  gap = 0.06,
  loop = true,
  autoRotate = 0,
  label = "Campus gallery",
  className,
  onSelect,
}: GalleryCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible. The floor keeps the
      // outermost neighbour present rather than letting it fade to nothing —
      // without it the rake dissolves at both ends and reads as a blur.
      const edge = loop ? Math.min(1, Math.max(0.35, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0.12, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // Exponential ease-out, not a spring. A spring would overshoot the
        // centre, which fights the "one card is always dead centre" reading.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pauseAuto();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
    resumeAuto();
  };

  /* ---- automatic rotation ----
   * Deliberately opt-in, and deliberately interruptible. A carousel that keeps
   * moving while someone is reading the caption, dragging a card or tabbing
   * through the frame is worse than a static one, so every one of those pauses
   * the timer and the full delay restarts on release. A blur or resize also
   * stops it outright: rotation is a nicety, not something worth burning
   * cycles on a hidden tab.
   */
  const pausedRef = React.useRef(false);
  const [autoPaused, setAutoPaused] = React.useState(false);

  const pauseAuto = React.useCallback(() => {
    pausedRef.current = true;
    setAutoPaused(true);
  }, []);
  const resumeAuto = React.useCallback(() => {
    pausedRef.current = false;
    setAutoPaused(false);
  }, []);

  React.useEffect(() => {
    if (!autoRotate || autoRotate <= 0) return;
    if (count < 2) return;

    // A carousel that never stops moving is exactly what reduced motion is
    // asking us not to ship, so the rotation is off entirely in that mode.
    // Everything else — drag, arrows, dots — is unaffected.
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) {
      resumeAuto();
      return;
    }
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        pauseAuto();
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        resumeAuto();
      }
    };
    query.addEventListener("change", onChange);

    const tick = () => {
      if (pausedRef.current) return;
      // Step off the current target so a step landing mid-flight joins the
      // flight in progress rather than restarting it.
      settle(Math.round(targetRef.current) + 1);
    };
    const id = window.setInterval(tick, autoRotate);

    const onVisibility = () => {
      if (document.hidden) pauseAuto();
      else resumeAuto();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      query.removeEventListener("change", onChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoRotate, count, pauseAuto, resumeAuto, settle]);

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  if (!count) return null;
  const active = slides[selected];

  return (
    <div className={cn("gallery-carousel", className)}>
      <div
        ref={frameRef}
        className="gallery-carousel-frame"
        data-paused={autoPaused ? "true" : "false"}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onMouseEnter={pauseAuto}
        onMouseLeave={resumeAuto}
        onFocus={pauseAuto}
        onBlur={resumeAuto}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            nudge(-1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            nudge(1);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (onSelect && active) onSelect(active);
          }
        }}
        style={
          {
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
            perspective: `calc(var(--cf-card) * ${perspective})`,
          } as React.CSSProperties
        }
      >
        <div
          className="gallery-carousel-track"
          style={{ height: "var(--cf-card)" }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.src + index}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="gallery-carousel-card"
              style={{ width: "var(--cf-card)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="gallery-carousel-caption" aria-live="polite">
        <div>
          <strong>{active?.title || active?.alt}</strong>
          {active?.subtitle && <span>{active.subtitle}</span>}
        </div>
        <div className="gallery-carousel-nav">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Previous photograph"
          >
            ←
          </button>
          <span className="gallery-carousel-count">
            {selected + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Next photograph"
          >
            →
          </button>
        </div>
      </div>

      <div className="gallery-carousel-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.src + index}
            type="button"
            className={index === selected ? "is-active" : ""}
            aria-label={`Go to photograph ${index + 1}`}
            aria-current={index === selected}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      {onSelect && active && (
        <button
          type="button"
          className="text-link gallery-carousel-open"
          onClick={() => onSelect(active)}
        >
          View full size <ArrowOut />
        </button>
      )}
    </div>
  );
}

/** Inline so the carousel keeps its single-file, no-dependency footprint. */
function ArrowOut() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
