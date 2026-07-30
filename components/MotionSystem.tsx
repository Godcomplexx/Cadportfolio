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

type ScrollTriggerInstance = {
  kill: () => void;
};

type ScrollTriggerLike = {
  defaults: (options: Record<string, unknown>) => void;
  refresh: () => void;
  update: () => void;
  getAll?: () => ScrollTriggerInstance[];
};

declare global {
  interface Window {
    gsap?: GsapLike;
    ScrollTrigger?: ScrollTriggerLike;
  }
}

const depthMotion = [0.06, 0.12, 0.2, 0.12, 0, 0.28] as const;

export function MotionSystem() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saved = window.localStorage.getItem("motion");
    const initialEnabled = saved ? saved === "on" : !media.matches;

    queueMicrotask(() => setEnabled(initialEnabled));
    document.documentElement.classList.toggle("no-motion", !initialEnabled);
    document.documentElement.classList.add("motion-ready");

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse || navigator.hardwareConcurrency <= 4) {
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

    const revealVisible = () => {
      const rootRect = scrollRoot?.getBoundingClientRect();
      const viewportTop = rootRect?.top ?? 0;
      const viewportBottom = rootRect?.bottom ?? window.innerHeight;

      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach(
        (element) => {
          const rect = element.getBoundingClientRect();
          if (rect.bottom < viewportTop || rect.top > viewportBottom * 0.94) return;

          element.classList.remove("reveal-pending");
          element.classList.add("is-visible");
          revealObserver.unobserve(element);
        },
      );
    };

    const observeReveals = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element) => {
        element.classList.add("reveal-pending");
        revealObserver.observe(element);
      });
      revealVisible();
    };

    observeReveals();
    let revealAttempts = 0;
    const revealRegistration = window.setInterval(() => {
      revealAttempts += 1;
      observeReveals();
      if (revealAttempts >= 8) window.clearInterval(revealRegistration);
    }, 250);
    const revealScrollTarget: Window | HTMLElement = scrollRoot ?? window;
    revealScrollTarget.addEventListener("scroll", revealVisible, { passive: true });
    window.addEventListener("resize", revealVisible);

    let removeScrollTriggerListener: (() => void) | undefined;
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
      if (scrollRoot) {
        scrollTrigger.defaults({ scroller: scrollRoot });
        scrollRoot.addEventListener("scroll", scrollTrigger.update, {
          passive: true,
        });
        removeScrollTriggerListener = () => {
          scrollRoot.removeEventListener("scroll", scrollTrigger.update);
        };
      }

      if (!document.documentElement.classList.contains("no-motion")) {
        gsap.utils.toArray<Element>("[data-depth]").forEach((layer) => {
          if (layer.hasAttribute("data-fog-layer")) return;

          const depth = Number(layer.getAttribute("data-depth") ?? 4);
          const factor = depthMotion[depth] ?? 0.1;
          if (!factor) return;

          gsap.to(layer, {
            yPercent: -18 * factor,
            ease: "none",
            scrollTrigger: {
              trigger:
                layer.closest(".scene, .project-chapter, .fog-bridge") ?? layer,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          });
        });

        const fogMotion = {
          wash: {
            from: { yPercent: -3, scale: 0.99, opacity: 0.75 },
            to: { yPercent: 5, scale: 1.05, opacity: 1 },
          },
          back: {
            from: { xPercent: -4, yPercent: -10, scale: 0.94, opacity: 0.24 },
            to: { xPercent: 3, yPercent: 12, scale: 1.12, opacity: 0.66 },
          },
          middle: {
            from: { xPercent: 3, yPercent: 9, scale: 0.96, opacity: 0.3 },
            to: { xPercent: -4, yPercent: -10, scale: 1.1, opacity: 0.64 },
          },
          front: {
            from: { yPercent: 15, scale: 1.02, opacity: 0.82 },
            to: { yPercent: -19, scale: 1.18, opacity: 0.1 },
          },
        } as const;

        gsap.utils.toArray<Element>("[data-fog-layer]").forEach((layer) => {
          const key = layer.getAttribute("data-fog-layer") as keyof typeof fogMotion;
          const motion = fogMotion[key];
          if (!motion) return;

          gsap.fromTo(layer, motion.from, {
            ...motion.to,
            ease: "none",
            scrollTrigger: {
              trigger: layer.closest(".fog-bridge") ?? layer,
              start: "top 92%",
              end: "bottom top",
              scrub: 1.1,
            },
          });
        });

        const heroGhost = document.querySelector(".storm-hero__ghost");
        if (heroGhost) {
          gsap.fromTo(
            heroGhost,
            { xPercent: -1.8, opacity: 0.6 },
            {
              xPercent: 2.6,
              opacity: 0.18,
              ease: "none",
              scrollTrigger: {
                trigger: ".storm-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }

        const projectCards =
          gsap.utils.toArray<Element>(".project-chapter");
        projectCards.slice(0, -1).forEach((card, index) => {
          const nextCard = projectCards[index + 1];
          gsap.to(card, {
            scale: 0.955,
            opacity: 0.58,
            filter: "brightness(0.62) saturate(0.74)",
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: "top top",
              scrub: 0.85,
            },
          });
        });

        const contactCircle = document.querySelector(".contact-section__circle");
        if (contactCircle) {
          gsap.fromTo(
            contactCircle,
            { rotate: -8, scale: 0.84 },
            {
              rotate: 8,
              scale: 1.04,
              ease: "none",
              scrollTrigger: {
                trigger: ".contact-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }
      }

      window.requestAnimationFrame(() => scrollTrigger.refresh());
    };

    initGsap();

    return () => {
      revealObserver.disconnect();
      window.clearInterval(revealRegistration);
      revealScrollTarget.removeEventListener("scroll", revealVisible);
      window.removeEventListener("resize", revealVisible);
      window.clearTimeout(initTimer);
      removeScrollTriggerListener?.();
      window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill());
    };
  }, []);

  function toggleMotion() {
    const next = !enabled;
    setEnabled(next);
    document.documentElement.classList.toggle("no-motion", !next);
    window.localStorage.setItem("motion", next ? "on" : "off");
    window.ScrollTrigger?.refresh();
  }

  return (
    <button
      className="motion-toggle"
      type="button"
      aria-pressed={enabled}
      aria-label={`${enabled ? "Disable" : "Enable"} site animation`}
      onClick={toggleMotion}
    >
      <span aria-hidden="true" />
      <span>{enabled ? "Motion on" : "Motion off"}</span>
    </button>
  );
}
