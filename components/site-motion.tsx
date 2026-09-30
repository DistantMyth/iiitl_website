"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/** Word entrance inspired by 21st.dev/@ibelick/components/text-effect.
 * Uses the site's existing GSAP runtime and leaves the full text accessible. */
export function AnimatedWords({
  text,
  accent,
}: {
  text: string;
  accent?: string;
}) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/\s+/).map((word, index) => (
          <span className="motion-word-mask" key={`${index}-${word}`}>
            {accent && word.includes(accent) ? (
              <em className="motion-word">{word}</em>
            ) : (
              <span className="motion-word">{word}</span>
            )}{" "}
          </span>
        ))}
      </span>
    </>
  );
}

/** Count Up pattern: render the final value first, animate once on entry. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !/^\d+$/.test(value)) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let tween: gsap.core.Tween | undefined;
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          const counter = { value: 0 };
          tween = gsap.to(counter, {
            value: Number(value),
            duration: 1.1,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value));
            },
            onComplete: () => {
              el.textContent = value;
            },
          });
        },
        { threshold: 0.5 },
      );
      observer.observe(el);
      return () => {
        observer.disconnect();
        tween?.kill();
        el.textContent = value;
      };
    });
    return () => media.revert();
  }, [value]);
  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
    </>
  );
}

/** Public site choreography. Reverts listeners and inline styles on route changes. */
export function SiteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.getElementById("top");
    if (!root) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const words = root.querySelectorAll("h1 .motion-word");
          if (words.length)
            gsap.from(words, {
              yPercent: 105,
              rotation: 3,
              duration: 0.85,
              stagger: 0.055,
              ease: "power3.out",
              clearProps: "transform",
            });
          const heroDetails = root.querySelectorAll(
            ".hero-eyebrow, .hero-bottom, .scroll-cue, .page-hero .breadcrumb, .page-hero > .eyebrow, .page-hero > p",
          );
          if (heroDetails.length)
            gsap.from(heroDetails, {
              y: 14,
              opacity: 0,
              duration: 0.65,
              stagger: 0.07,
              delay: 0.15,
              ease: "power2.out",
              clearProps: "transform,opacity",
            });
        }, root);
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              observer.unobserve(entry.target);
              context.add(() => {
                const el = entry.target;
                const children = el.matches(
                  ".program-grid, .news-grid, .stats-grid",
                )
                  ? Array.from(el.children)
                  : [el];
                gsap.from(children, {
                  y: 28,
                  opacity: 0,
                  duration: 0.75,
                  stagger: 0.09,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                });
              });
            });
          },
          { threshold: 0.08 },
        );
        root
          .querySelectorAll(
            "main .section-heading, main .intro-section > div, main .emblem-copy, main .program-grid, main .news-grid, main .stats-grid, main .section > h2",
          )
          .forEach((el) => observer.observe(el));
        return () => {
          observer.disconnect();
          context.revert();
        };
      },
      root,
    );

    // Inspired by 21st.dev/bundui/magnetic-button: restrained attraction for a mouse.
    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const cleanups: (() => void)[] = [];
        const context = gsap.context(() => {
          root.querySelectorAll<HTMLElement>("main .btn").forEach((button) => {
            const xTo = gsap.quickTo(button, "x", {
              duration: 0.45,
              ease: "power3.out",
            });
            const yTo = gsap.quickTo(button, "y", {
              duration: 0.45,
              ease: "power3.out",
            });
            let bounds: DOMRect | undefined;
            const enter = () => {
              bounds = button.getBoundingClientRect();
            };
            const move = (event: PointerEvent) => {
              if (!bounds || event.pointerType !== "mouse") return;
              xTo(
                gsap.utils.clamp(
                  -7,
                  7,
                  (event.clientX - bounds.left - bounds.width / 2) * 0.12,
                ),
              );
              yTo(
                gsap.utils.clamp(
                  -5,
                  5,
                  (event.clientY - bounds.top - bounds.height / 2) * 0.12,
                ),
              );
            };
            const reset = () => {
              bounds = undefined;
              xTo(0);
              yTo(0);
            };
            button.addEventListener("pointerenter", enter);
            button.addEventListener("pointermove", move);
            button.addEventListener("pointerleave", reset);
            button.addEventListener("focus", reset);
            button.addEventListener("blur", reset);
            button.addEventListener("pointercancel", reset);
            window.addEventListener("scroll", reset, { passive: true });
            cleanups.push(() => {
              button.removeEventListener("pointerenter", enter);
              button.removeEventListener("pointermove", move);
              button.removeEventListener("pointerleave", reset);
              button.removeEventListener("focus", reset);
              button.removeEventListener("blur", reset);
              button.removeEventListener("pointercancel", reset);
              window.removeEventListener("scroll", reset);
            });
          });
        }, root);
        return () => {
          cleanups.forEach((cleanup) => cleanup());
          context.revert();
        };
      },
      root,
    );
    return () => media.revert();
  }, [pathname]);
  return null;
}
