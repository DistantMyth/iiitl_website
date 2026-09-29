"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Adapted from website_temp_external_components/parallax-scrolling/Component.tsx.
 * Keeps its scoped, scrubbed GSAP layer timeline, using native scrolling.
 * Rates are percentages of the scene height so text and images have a common
 * coordinate system. Matching image layers must use the same rate to stay aligned.
 */
export function ParallaxLayers({
  children,
  rates = [28, -8, -8, 4],
  start = "top bottom",
  end = "bottom top",
  className,
  revealUntil,
  sinkAfter,
  sinkBy,
  onProgress,
}: {
  children: React.ReactNode;
  rates?: readonly number[];
  start?: string;
  end?: string;
  className?: string;
  /** First layer rises from its positive rate offset, then holds at rest. */
  revealUntil?: number;
  /** Scroll fraction where the first layer starts sinking, measured from 0. */
  sinkAfter?: number;
  /** Total descent across the sink, as a percentage of the scene height. */
  sinkBy?: number;
  onProgress?: (progress: number) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(onProgress);
  const ratesKey = rates.join(",");

  useEffect(() => {
    progressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const trigger =
      root.querySelector<HTMLElement>("[data-parallax-layers]") ?? root;
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
          progressRef.current?.(1);
          return;
        }
        const timeline = gsap.timeline({
          onUpdate: () => progressRef.current?.(timeline.progress()),
          scrollTrigger: {
            trigger,
            start,
            end,
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });
        ratesKey
          .split(",")
          .map(Number)
          .forEach((rate, index) => {
            const layers = trigger.querySelectorAll(
              `[data-parallax-layer="${index + 1}"]`,
            );
            if (!layers.length) return;
            const travel = () => (trigger.clientHeight * rate) / 100;
            const entrance = index === 0 && revealUntil !== undefined;
            timeline.fromTo(
              layers,
              { y: () => (entrance ? travel() : -travel() / 2) },
              {
                y: () => (entrance ? 0 : travel() / 2),
                duration: entrance ? revealUntil : 1,
                ease: "none",
              },
              0,
            );
            // Once the reveal is done the layer holds, then slides straight back
            // down behind the scene with no further keyframing.
            if (entrance && sinkAfter !== undefined) {
              timeline.to(
                layers,
                {
                  y: () => (trigger.clientHeight * (sinkBy ?? 0)) / 100,
                  ease: "none",
                },
                sinkAfter,
              );
            }
          });
        progressRef.current?.(timeline.progress());
      },
      root,
    );

    // Recalculate after font loading without touching other components' triggers.
    void document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      media.revert();
    };
  }, [ratesKey, start, end, revealUntil, sinkAfter, sinkBy]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
