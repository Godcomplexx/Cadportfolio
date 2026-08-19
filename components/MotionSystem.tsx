"use client";

import { useEffect } from "react";

type GsapLike = {
  registerPlugin: (...plugins: unknown[]) => void;
  fromTo: (
    target: Element,
    from: Record<string, unknown>,
    to: Record<string, unknown>,
  ) => unknown;
};

type ScrollTriggerInstance = {
  kill: () => void;
};

type ScrollTriggerLike = {
  defaults: (options: Record<string, unknown>) => void;
  refresh: () => void;
  getAll?: () => ScrollTriggerInstance[];
};

declare global {
  interface Window {
    gsap?: GsapLike;
    ScrollTrigger?: ScrollTriggerLike;
  }
}

export function MotionSystem() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionEnabled = !motionPreference.matches;

    document.documentElement.classList.toggle("no-motion", !motionEnabled);
    document.documentElement.classList.add("motion-ready");

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const performanceLite = coarse || navigator.hardwareConcurrency <= 4;
    if (performanceLite) {
      document.documentElement.classList.add("perf-lite");
    }

    const scrollRoot = document.querySelector<HTMLElement>("[data-scroll-container]");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("reveal-pending");
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        root: scrollRoot,
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    // IntersectionObserver owns reveal visibility. Avoid querying and
    // measuring every pending element again on each scroll event.
    const revealFrame = window.requestAnimationFrame(() => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element) => {
        element.classList.add("reveal-pending");
        revealObserver.observe(element);
      });
    });

    let initTimer = 0;
    let attempts = 0;

    const initGsap = () => {
      attempts += 1;
      const gsap = window.gsap;
      const scrollTrigger = window.ScrollTrigger;

      if (!gsap || !scrollTrigger) {
        if (attempts < 24) initTimer = window.setTimeout(initGsap, 120);
        return;
      }

      gsap.registerPlugin(scrollTrigger);
      if (scrollRoot) scrollTrigger.defaults({ scroller: scrollRoot });

      if (motionEnabled && !performanceLite) {
        const heroGhost = document.querySelector(".system-hero__ghost");
        if (heroGhost) {
          gsap.fromTo(
            heroGhost,
            { xPercent: -1.8, opacity: 0.6 },
            {
              xPercent: 2.6,
              opacity: 0.18,
              ease: "none",
              scrollTrigger: {
                trigger: ".system-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.2,
              },
            },
          );
        }

        // The hero has pointer interaction; the work index and cases stay
        // precise. Only the atmospheric bridge keeps scroll-linked depth.
        const fogMotion = [
          {
            selector: '[data-fog-layer="middle"]',
            from: { xPercent: 2, yPercent: 6, scale: 0.98, opacity: 0.32 },
            to: { xPercent: -2, yPercent: -7, scale: 1.06, opacity: 0.58 },
          },
          {
            selector: '[data-fog-layer="front"]',
            from: { yPercent: 10, scale: 1.01, opacity: 0.72 },
            to: { yPercent: -13, scale: 1.1, opacity: 0.12 },
          },
        ] as const;

        fogMotion.forEach(({ selector, from, to }) => {
          const layer = document.querySelector(selector);
          if (!layer) return;
          gsap.fromTo(layer, from, {
            ...to,
            ease: "none",
            scrollTrigger: {
              trigger: ".fog-bridge",
              start: "top 92%",
              end: "bottom top",
              scrub: 0.2,
            },
          });
        });
      }

      window.requestAnimationFrame(() => scrollTrigger.refresh());
    };

    initGsap();

    return () => {
      window.cancelAnimationFrame(revealFrame);
      revealObserver.disconnect();
      window.clearTimeout(initTimer);
      window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
