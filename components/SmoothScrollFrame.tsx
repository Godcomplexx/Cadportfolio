"use client";

import { useEffect, useRef, type ReactNode } from "react";

export const scrollContainerSelector = "[data-scroll-container]";

export function SmoothScrollFrame({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }

    const targetFromHash = (hash: string) => {
      if (!hash) return null;
      try {
        return document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        return null;
      }
    };

    const scrollToTarget = (target: HTMLElement) => {
      const top =
        target.getBoundingClientRect().top -
        wrapper.getBoundingClientRect().top +
        wrapper.scrollTop;

      // Native scrolling remains responsive to the very next wheel or touch
      // event. This matters after several distant project-index jumps.
      wrapper.scrollTo({ top, behavior: "auto" });
    };

    const scrollToHash = () => {
      const target = targetFromHash(window.location.hash);
      if (target) scrollToTarget(target);
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const current = new URL(window.location.href);
      const next = new URL(link.href, current);
      if (
        next.origin !== current.origin ||
        next.pathname !== current.pathname ||
        next.search !== current.search ||
        !next.hash
      ) {
        return;
      }

      const target = targetFromHash(next.hash);
      if (!target) return;

      event.preventDefault();
      scrollToTarget(target);
      if (window.location.hash !== next.hash) {
        window.history.pushState(null, "", next.hash);
      }
    };

    // Resolve fragments only after the nested scroll container exists. A
    // second frame accounts for fonts and content-visibility activation on a
    // directly opened deep link without introducing animated travel.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      wrapper.scrollTop = 0;
      window.scrollTo(0, 0);
      secondFrame = window.requestAnimationFrame(scrollToHash);
    });

    wrapper.addEventListener("click", onAnchorClick);
    window.addEventListener("hashchange", scrollToHash);
    window.addEventListener("popstate", scrollToHash);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      wrapper.removeEventListener("click", onAnchorClick);
      window.removeEventListener("hashchange", scrollToHash);
      window.removeEventListener("popstate", scrollToHash);
    };
  }, []);

  return (
    <div
      className="smooth-scroll-shell"
      data-scroll-container
      ref={wrapperRef}
    >
      <div className="smooth-scroll-content">{children}</div>
    </div>
  );
}
