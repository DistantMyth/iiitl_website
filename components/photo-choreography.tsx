"use client";

/**
 * Adapted from website_temp_external_components/scroll-choreography/scroll-choreography.tsx.
 * The original uses framer-motion's `useScroll` + `useSpring`, which this site
 * does not depend on, so the same four-card convergence is driven by the GSAP +
 * ScrollTrigger pair already used by the campus scene. The keyframe shape is
 * identical: three cards hold off-frame, the fourth grows to fill, and the
 * first three fade out under it.
 *
 * The original was a 300vh scroll-jack. Here the sticky stage is kept but the
 * scroll length is shortened, because this site already has two long scroll
 * scenes and a third would make the homepage feel like a slideshow.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface PhotoChoreographyProps {
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  /** Scroll distance the stage occupies, in viewport heights. */
  length?: number;
  label?: string;
}

export function PhotoChoreography({
  images,
  length = 1.8,
  label = "Campus moments",
}: PhotoChoreographyProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let active = true;

    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) {
          // Show the finished composition rather than the scattered start.
          gsap.set(root.querySelectorAll("[data-choreo-card]"), {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            opacity: 1,
          });
          return;
        }
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${length * 100}%`,
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });
        // Scattered → gathered, on the same 0 → 0.65 → 1 shape as the original.
        timeline
          .to(root.querySelectorAll("[data-choreo-scatter]"), {
            xPercent: 0,
            yPercent: 0,
            duration: 0.65,
            ease: "none",
          })
          .to(
            root.querySelectorAll("[data-choreo-scatter]"),
            { opacity: 0, duration: 0.2, ease: "none" },
            0.75,
          )
          .to(
            root.querySelector("[data-choreo-hero]"),
            { scale: 2.78, duration: 0.25, ease: "none" },
            0.65,
          );
      },
      root,
    );

    void document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      media.revert();
    };
  }, [length]);

  const card = (src: string, alt: string, extra?: string) => (
    <div className="choreo-card" key={alt}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );

  return (
    <div
      className="choreo"
      ref={rootRef}
      style={{ height: `${length * 100}vh` }}
      role="region"
      aria-label={label}
    >
      <div className="choreo-sticky">
        <div className="choreo-stage">
          <div
            className="choreo-card choreo-a"
            data-choreo-card
            data-choreo-scatter
          >
            {card(images.topLeft, "Students on campus")}
          </div>
          <div
            className="choreo-card choreo-b"
            data-choreo-card
            data-choreo-scatter
          >
            {card(images.bottomRight, "A campus celebration")}
          </div>
          <div
            className="choreo-card choreo-c"
            data-choreo-card
            data-choreo-scatter
          >
            {card(images.bottomLeft, "Life in the laboratory")}
          </div>
          <div
            className="choreo-card choreo-hero"
            data-choreo-card
            data-choreo-hero
          >
            {card(images.topRight, "IIIT Lucknow campus")}
          </div>
        </div>
      </div>
    </div>
  );
}
