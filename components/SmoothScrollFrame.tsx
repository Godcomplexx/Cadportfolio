"use client";

import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";

export const scrollContainerSelector = "[data-scroll-container]";

export function SmoothScrollFrame({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToHashWithoutMotion = () => {
      if (!window.location.hash) return;

      const target = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1)),
      );
      if (!target) return;

      const top =
        target.getBoundingClientRect().top -
        wrapper.getBoundingClientRect().top +
        wrapper.scrollTop;
      wrapper.scrollTo({ top, behavior: "auto" });
    };

    if (reducedMotion) {
      const hashFrame = window.requestAnimationFrame(scrollToHashWithoutMotion);
      window.addEventListener("hashchange", scrollToHashWithoutMotion);
      return () => {
        window.cancelAnimationFrame(hashFrame);
        window.removeEventListener("hashchange", scrollToHashWithoutMotion);
      };
    }

    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: wrapper,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      anchors: true,
      autoRaf: false,
      overscroll: false,
    });

    const scrollToHash = () => {
      if (!window.location.hash) return;

      const target = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1)),
      );
      if (target) lenis.scrollTo(target, { immediate: true });
    };

    let hashFrame = window.requestAnimationFrame(() => {
      // Browsers may try to resolve the fragment before Lenis owns the nested
      // scroll container. Reset that native jump, then resolve it once against
      // Lenis so shared URLs land on the same position as clicked links.
      wrapper.scrollTop = 0;
      window.scrollTo(0, 0);
      hashFrame = window.requestAnimationFrame(scrollToHash);
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(hashFrame);
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="smooth-scroll-shell"
      data-scroll-container
      ref={wrapperRef}
    >
      <div className="smooth-scroll-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
