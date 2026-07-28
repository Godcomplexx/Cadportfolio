"use client";

import { useEffect, useState } from "react";

type GsapLike = {
  registerPlugin: (...plugins: unknown[]) => void;
  utils: { toArray: <T>(selector: string) => T[] };
  fromTo: (
    target: Element,
    from: Record<string, unknown>,
    to: Record<string, unknown>,
  ) => unknown;
  to: (target: Element, options: Record<string, unknown>) => unknown;
};

declare global {
  interface Window {
    gsap?: GsapLike;
    ScrollTrigger?: unknown;
  }
}

export function MotionSystem() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saved = window.localStorage.getItem("motion");
    const initialEnabled = saved ? saved === "on" : !media.matches;
    queueMicrotask(() => setEnabled(initialEnabled));
    document.documentElement.classList.toggle("no-motion", !initialEnabled);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse || navigator.hardwareConcurrency <= 4) {
      document.documentElement.classList.add("perf-lite");
    }

    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      observer.observe(element);
    });

    let attempts = 0;
    const initGsap = () => {
      attempts += 1;
      const gsap = window.gsap;
      if (!gsap || !window.ScrollTrigger) {
        if (attempts < 20) window.setTimeout(initGsap, 120);
        return;
      }

      gsap.registerPlugin(window.ScrollTrigger);
      if (!document.documentElement.classList.contains("no-motion")) {
        gsap.utils.toArray<Element>("[data-depth]").forEach((layer) => {
          if (layer.hasAttribute("data-fog-layer")) return;
          const depth = Number(layer.getAttribute("data-depth") ?? 4);
          if (depth === 4) return;
          const factor = [0.08, 0.15, 0.25, 0.34, 0, 0.42][depth] ?? 0.15;
          gsap.to(layer, {
            yPercent: -18 * factor,
            ease: "none",
            scrollTrigger: {
              trigger: layer.closest(".scene, .media-field, .site-footer") ?? layer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        const fogMotion = {
          wash: {
            from: { yPercent: -3, scale: 0.98, opacity: 0.72 },
            to: { yPercent: 4, scale: 1.04, opacity: 1 },
          },
          back: {
            from: { yPercent: -12, scale: 0.9, opacity: 0.24 },
            to: { yPercent: 14, scale: 1.12, opacity: 0.7 },
          },
          middle: {
            from: { yPercent: 8, scale: 0.96, opacity: 0.36 },
            to: { yPercent: -12, scale: 1.1, opacity: 0.62 },
          },
          front: {
            from: { yPercent: 16, scale: 1.02, opacity: 0.82 },
            to: { yPercent: -20, scale: 1.2, opacity: 0.12 },
          },
        } as const;

        gsap.utils.toArray<Element>("[data-fog-layer]").forEach((layer) => {
          const key = layer.getAttribute(
            "data-fog-layer",
          ) as keyof typeof fogMotion;
          const motion = fogMotion[key];
          if (!motion) return;

          gsap.fromTo(layer, motion.from, {
            ...motion.to,
            ease: "none",
            scrollTrigger: {
              trigger: layer.closest(".home-fog-transition") ?? layer,
              start: "top 92%",
              end: "bottom top",
              scrub: 1.15,
            },
          });
        });

        const about = document.querySelector(".home-about");
        const aboutCopy = about?.querySelector(".home-about__copy");
        const aboutCards = about?.querySelector(".home-about__cards");

        if (about && aboutCopy) {
          gsap.fromTo(
            aboutCopy,
            { y: 72, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: about,
                start: "top 88%",
                end: "top 38%",
                scrub: 0.9,
              },
            },
          );
        }

        if (about && aboutCards) {
          gsap.fromTo(
            aboutCards,
            { opacity: 0.08 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: about,
                start: "top 78%",
                end: "top 28%",
                scrub: 0.9,
              },
            },
          );
        }
      }
    };
    initGsap();

    return () => observer.disconnect();
  }, []);

  function toggleMotion() {
    const next = !enabled;
    setEnabled(next);
    document.documentElement.classList.toggle("no-motion", !next);
    window.localStorage.setItem("motion", next ? "on" : "off");
  }

  return (
    <button
      className="motion-toggle"
      type="button"
      aria-pressed={!enabled}
      aria-label={`${enabled ? "Disable" : "Enable"} site animation`}
      onClick={toggleMotion}
    >
      <span aria-hidden="true">{enabled ? "◌" : "●"}</span>
      <span>{enabled ? "Motion on" : "Motion off"}</span>
    </button>
  );
}
