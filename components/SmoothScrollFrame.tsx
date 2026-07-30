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

    if (reducedMotion) return;

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

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
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
