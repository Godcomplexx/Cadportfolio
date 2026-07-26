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
