"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ParallaxLayers } from "./parallax-layers";
import { VapourText } from "./vapour-text";

const LAYER_RATES = [40, -8, -8, 4] as const;
const WORDMARK_COLORS = ["#0d7cb9", "#0a6fae", "#03557c"] as const;
const ramp = (start: number, end: number, value: number) =>
  Math.max(0, Math.min(1, (value - start) / (end - start)));

export function CampusScene() {
  // Isolate the animated state so scrolling doesn't rerender the entire homepage.
  const [progress, setProgress] = useState(1);
  const wordmarkProgress = 1 - ramp(0.12, 0.52, progress);
  return (
    <ParallaxLayers
      className="campus-depth"
      rates={LAYER_RATES}
      revealUntil={0.55}
      sinkAfter={0.58}
      sinkBy={26}
      onProgress={setProgress}
    >
      <section
        id="campus"
        className="campus-stage"
        data-parallax-layers
        aria-label="IIIT Lucknow campus"
      >
        <div className="depth-sky" />
        <div className="depth-copy" data-parallax-layer="1">
          <h2 className="depth-latin depth-faded">
            <VapourText
              text="IIIT LUCKNOW"
              progress={wordmarkProgress}
              fontFamily='"Outfit Variable", "Outfit", sans-serif'
              fontWeight={800}
              colors={WORDMARK_COLORS}
              origin="below"
            />
          </h2>
        </div>
        <img
          className="depth-base"
          data-parallax-layer="2"
          src="/assets/images/homepage/institute-pic-f.jpg"
          width={2048}
          height={534}
          alt="The blue glass facade of IIIT Lucknow’s academic building"
          fetchPriority="high"
        />
        <img
          className="depth-front"
          data-parallax-layer="3"
          src="/assets/images/homepage/institute-pic-f.jpg"
          width={2048}
          height={534}
          alt=""
          aria-hidden="true"
        />
        <div
          className="depth-haze"
          data-parallax-layer="4"
          aria-hidden="true"
        />
        <div className="campus-caption">
          <span>26.7970° N &nbsp; 81.0237° E</span>
          <span>
            A world of possibility. Right here in Lucknow.{" "}
            <ArrowUpRight size={17} />
          </span>
        </div>
      </section>
    </ParallaxLayers>
  );
}
