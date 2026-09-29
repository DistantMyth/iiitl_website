"use client";

import { useEffect, useRef } from "react";

/**
 * Pixel sampling adapted from the supplied vapour-text-effect/Component.tsx.
 * Positions and alpha are derived from scroll progress rather than accumulated
 * frame-by-frame, so scrolling backwards restores exactly the same letterforms.
 */
type Particle = {
  x: number;
  y: number;
  red: number;
  green: number;
  blue: number;
  alpha: number;
  driftX: number;
  driftY: number;
};

type Field = {
  source: HTMLCanvasElement;
  particles: Particle[];
  left: number;
  width: number;
  step: number;
  fontSize: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const random = (seed: number) => {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
};

export function VapourText({
  text,
  progress,
  fontSize = 132,
  fontFamily = "Manrope, sans-serif",
  fontWeight = 700,
  colors = ["#0d7cb9", "#0a6fae", "#03557c"],
  spread = 1.5,
  direction = "left-to-right",
  origin = "above",
  className,
}: {
  text: string;
  progress: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  colors?: readonly string[];
  spread?: number;
  direction?: "left-to-right" | "right-to-left";
  origin?: "above" | "below";
  className?: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<Field | null>(null);
  const progressRef = useRef(progress);
  const paintRef = useRef<() => void>(() => {});
  const colorKey = colors.join("|");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!root || !canvas || !context) return;
    let active = true;
    let frame = 0;

    const paint = () => {
      const field = fieldRef.current;
      if (!field) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const p = clamp(progressRef.current);
      if (p === 0) {
        // Full-resolution source keeps resting text sharp rather than dotted.
        context.drawImage(field.source, 0, 0);
        return;
      }
      const travel = field.fontSize * spread;
      for (const particle of field.particles) {
        const position = clamp((particle.x - field.left) / field.width);
        const sweep = direction === "left-to-right" ? position : 1 - position;
        const age = clamp((p - sweep * 0.5) / 0.5);
        const opacity = particle.alpha * (1 - age) ** 1.5;
        if (opacity < 0.01) continue;
        const x = particle.x + particle.driftX * travel * age;
        const y =
          particle.y +
          (origin === "below" ? 1 : -1) *
            travel *
            (0.15 + particle.driftY) *
            age;
        context.fillStyle = `rgba(${particle.red},${particle.green},${particle.blue},${opacity})`;
        context.fillRect(x, y, field.step, field.step);
      }
    };
    paintRef.current = paint;

    const sample = () => {
      frame = 0;
      if (!active) return;
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const source = document.createElement("canvas");
      source.width = canvas.width;
      source.height = canvas.height;
      const ctx = source.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const font = (size: number) => `${fontWeight} ${size}px ${fontFamily}`;
      ctx.font = font(fontSize * dpr);
      const metrics = ctx.measureText(text);
      const measuredHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const fittedSize =
        fontSize *
        dpr *
        Math.min(
          1,
          (canvas.width * 0.94) / metrics.width,
          (canvas.height * 0.72) / measuredHeight,
        );
      ctx.font = font(fittedSize);
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      const fitted = ctx.measureText(text);
      const left = (canvas.width - fitted.width) / 2;
      const baseline =
        (canvas.height +
          fitted.actualBoundingBoxAscent -
          fitted.actualBoundingBoxDescent) /
        2;
      const gradient = ctx.createLinearGradient(
        left,
        0,
        left + fitted.width,
        0,
      );
      const stops = colorKey.split("|");
      stops.forEach((color, i) =>
        gradient.addColorStop(i / Math.max(1, stops.length - 1), color),
      );
      ctx.fillStyle = gradient;
      ctx.fillText(text, canvas.width / 2, baseline);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const step = Math.max(1, Math.round(1.5 * dpr));
      const particles: Particle[] = [];
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          if (!pixels[index + 3]) continue;
          const seed = particles.length;
          particles.push({
            x,
            y,
            red: pixels[index],
            green: pixels[index + 1],
            blue: pixels[index + 2],
            alpha: pixels[index + 3] / 255,
            driftX: (random(seed + 1) - 0.5) * 2,
            driftY: random(seed + 2),
          });
        }
      }
      fieldRef.current = {
        source,
        particles,
        left,
        width: fitted.width,
        step,
        fontSize: fittedSize,
      };
      paint();
      root.dataset.ready = "true";
    };
    const scheduleSample = () => {
      if (!frame) frame = requestAnimationFrame(sample);
    };
    const observer = new ResizeObserver(scheduleSample);
    observer.observe(root);
    scheduleSample();
    void document.fonts.ready.then(() => {
      if (active) scheduleSample();
    });
    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
      paintRef.current = () => {};
    };
  }, [
    text,
    fontSize,
    fontFamily,
    fontWeight,
    colorKey,
    spread,
    direction,
    origin,
  ]);

  useEffect(() => {
    progressRef.current = progress;
    paintRef.current();
  }, [progress]);

  return (
    <span ref={rootRef} className={`vapour-text ${className ?? ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="vapour-text-fallback">{text}</span>
    </span>
  );
}
