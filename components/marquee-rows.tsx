"use client";

/**
 * Adapted from website_temp_external_components/hero-parallax/hero-parallax.tsx.
 * The original leans on framer-motion's `useScroll`/`useSpring`; that package is
 * not a dependency here, so the same three-row counter-scrolling rake is driven
 * by the GSAP + ScrollTrigger pair already used by the campus scene. The spring
 * easing becomes a scrubbed tween, which reads the same on a scroll gesture.
 *
 * Cards are links into real sections rather than the original's product shots.
 */
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

export interface MarqueeCard {
  title: string;
  kicker: string;
  href: string;
  thumbnail: string;
}

export function MarqueeRows({
  cards,
  /** Total horizontal travel across the whole scroll, in pixels. */
  distance = 520,
}: {
  cards: MarqueeCard[];
  distance?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      () => {
        const rows = root.querySelectorAll<HTMLElement>("[data-marquee-row]");
        if (!rows.length) return;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
        // Alternate direction per row, which is what makes the rake read.
        rows.forEach((row, index) => {
          const to = index % 2 === 0 ? -distance : distance;
          timeline.fromTo(
            row,
            { x: to * -0.5 },
            { x: to * 0.5, ease: "none" },
            0,
          );
        });
        // The block settles level as it arrives, instead of staying tilted.
        timeline.fromTo(
          root.querySelectorAll<HTMLElement>("[data-marquee-deck]"),
          { rotateX: 12, opacity: 0.35 },
          { rotateX: 0, rotateZ: 0, opacity: 1, ease: "none" },
          0,
        );
      },
      root,
    );

    return () => media.revert();
  }, [distance]);

  if (!cards.length) return null;
  // Three rows, alternating direction, cycling the card list to fill each row.
  const rows = [0, 1, 2].map((row) => ({
    row,
    items: Array.from(
      { length: 3 },
      (_, i) => cards[(row * 3 + i) % cards.length],
    ),
  }));

  return (
    <div className="marquee" ref={rootRef}>
      <div className="marquee-deck" data-marquee-deck>
        {rows.map(({ row, items }) => (
          <div
            className="marquee-row"
            data-marquee-row={row}
            key={row}
            data-reverse={row % 2 === 1 ? "true" : "false"}
          >
            {items.map((card, i) => (
              <Link
                className="marquee-card"
                href={card.href}
                key={card.href + i}
              >
                <img src={card.thumbnail} alt={card.title} loading="lazy" />
                <span className="marquee-caption">
                  <small>{card.kicker}</small>
                  <strong>
                    {card.title} <ArrowUpRight size={17} />
                  </strong>
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
