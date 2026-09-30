"use client";

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
  label?: string;
}

export function PhotoChoreography({
  images,
  label = "Campus moments",
}: PhotoChoreographyProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(root.querySelectorAll(".choreo-card"), {
          y: 32,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        });
      },
      root,
    );
    return () => media.revert();
  }, []);

  return (
    <section className="choreo" ref={rootRef} aria-label={label}>
      <div className="choreo-heading">
        <span className="eyebrow">Around campus</span>
        <h2>{label}</h2>
      </div>
      <div className="choreo-stage">
        <figure className="choreo-card choreo-hero">
          <img src={images.topRight} alt="IIIT Lucknow campus" loading="lazy" />
          <figcaption>Our campus</figcaption>
        </figure>
        <figure className="choreo-card choreo-a">
          <img
            src={images.topLeft}
            alt="A view across the IIIT Lucknow campus"
            loading="lazy"
          />
          <figcaption>Room to explore</figcaption>
        </figure>
        <figure className="choreo-card choreo-c">
          <img
            src={images.bottomLeft}
            alt="Laboratory facilities at IIIT Lucknow"
            loading="lazy"
          />
          <figcaption>Learning in practice</figcaption>
        </figure>
        <figure className="choreo-card choreo-b">
          <img
            src={images.bottomRight}
            alt="Convocation celebrations at IIIT Lucknow"
            loading="lazy"
          />
          <figcaption>Milestones together</figcaption>
        </figure>
      </div>
    </section>
  );
}
