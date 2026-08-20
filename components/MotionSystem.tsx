"use client";

import { useEffect } from "react";

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

    return () => {
      window.cancelAnimationFrame(revealFrame);
      revealObserver.disconnect();
    };
  }, []);

  return null;
}
