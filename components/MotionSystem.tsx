"use client";

import { useEffect } from "react";

type GsapLike = {
  registerPlugin: (...plugins: unknown[]) => void;
  utils: { toArray: <T>(selector: string) => T[] };
  set: (target: Element, options: Record<string, unknown>) => unknown;
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
  useEffect(() => {
    // Motion follows the system preference; there is no manual override.
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initialEnabled = !media.matches;

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
          if (layer.hasAttribute("data-fog-layer") || layer.hasAttribute("data-fixed-depth")) return;

          const depth = Number(layer.getAttribute("data-depth") ?? 4);
          const factor = depthMotion[depth] ?? 0.1;
          if (!factor) return;

          gsap.to(layer, {
            yPercent: -18 * factor,
            ease: "none",
            scrollTrigger: {
              trigger:
                layer.closest(".scene, .project-tile, .fog-bridge") ?? layer,
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
                scrub: 1,
              },
            },
          );
        }

        gsap.utils.toArray<Element>(".project-tile").forEach((tile) => {
          const visual = tile.querySelector(".project-tile__visual");
          if (!visual) return;

          gsap.fromTo(visual, {
            scale: 0.94,
            opacity: 0.5,
          }, {
            scale: 1,
            opacity: 1,
            transformOrigin: "center center",
            ease: "none",
            scrollTrigger: {
              trigger: tile,
              start: "top 92%",
              end: "center 55%",
              scrub: 0.7,
            },
          });
        });

        const signalRays = document.querySelector("[data-signal-rays]");
        if (signalRays) {
          gsap.fromTo(
            signalRays,
            { rotate: -5, scale: 0.72, opacity: 0.22 },
            {
              rotate: 5,
              scale: 1.18,
              opacity: 0.82,
              ease: "none",
              scrollTrigger: {
                trigger: ".signal-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }

        const contactOrb = document.querySelector(".contact-section__orb");
        if (contactOrb) {
          gsap.fromTo(
            contactOrb,
            { rotate: -7, scale: 0.86 },
            {
              rotate: 7,
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

  // Motion runs the scroll effects; it has no visible control. Reduced-motion
  // preferences are still honoured by the effect above.
  return null;
}
