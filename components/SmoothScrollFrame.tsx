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

    const targetFromHash = (hash: string) => {
      if (!hash) return null;
      try {
        return document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        return null;
      }
    };

    const internalAnchor = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return null;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return null;
      }

      const current = new URL(window.location.href);
      const next = new URL(link.href, current);
      if (
        next.origin !== current.origin ||
        next.pathname !== current.pathname ||
        next.search !== current.search ||
        !next.hash
      ) {
        return null;
      }

      const target = targetFromHash(next.hash);
      return target ? { hash: next.hash, target } : null;
    };

    const rememberHash = (hash: string) => {
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    };

    if (reducedMotion) {
      const scrollToHashWithoutMotion = () => {
        const target = targetFromHash(window.location.hash);
        if (!target) return;

        const top =
          target.getBoundingClientRect().top -
          wrapper.getBoundingClientRect().top +
          wrapper.scrollTop;
        wrapper.scrollTo({ top, behavior: "auto" });
      };
      const onAnchorClick = (event: MouseEvent) => {
        const anchor = internalAnchor(event);
        if (!anchor) return;
        event.preventDefault();

        const top =
          anchor.target.getBoundingClientRect().top -
          wrapper.getBoundingClientRect().top +
          wrapper.scrollTop;
        wrapper.scrollTo({ top, behavior: "auto" });
        rememberHash(anchor.hash);
      };

      const hashFrame = window.requestAnimationFrame(scrollToHashWithoutMotion);
      wrapper.addEventListener("click", onAnchorClick);
      window.addEventListener("hashchange", scrollToHashWithoutMotion);
      window.addEventListener("popstate", scrollToHashWithoutMotion);
      return () => {
        window.cancelAnimationFrame(hashFrame);
        wrapper.removeEventListener("click", onAnchorClick);
        window.removeEventListener("hashchange", scrollToHashWithoutMotion);
        window.removeEventListener("popstate", scrollToHashWithoutMotion);
      };
    }

    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: wrapper,
      // Responsive enough to preserve wheel intent; scroll-linked motion uses
      // only a short scrub, so the page no longer smooths the same input twice.
      lerp: 0.18,
      smoothWheel: true,
      syncTouch: true,
      // Internal links are handled below as immediate jumps. Animating several
      // distant anchors in quick succession makes the browser render every
      // heavy section between them and leaves wheel input fighting the tween.
      anchors: false,
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

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = internalAnchor(event);
      if (!anchor) return;
      event.preventDefault();

      // Immediate navigation cancels any previous Lenis interpolation. The
      // next wheel/touch input therefore starts from the visible position.
      lenis.scrollTo(anchor.target, { immediate: true, force: true });
      rememberHash(anchor.hash);
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

    const startRaf = () => {
      if (!frame && !document.hidden) {
        frame = window.requestAnimationFrame(raf);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        startRaf();
      }
    };

    wrapper.addEventListener("click", onAnchorClick);
    window.addEventListener("hashchange", scrollToHash);
    window.addEventListener("popstate", scrollToHash);
    document.addEventListener("visibilitychange", onVisibilityChange);
    startRaf();

    return () => {
      window.cancelAnimationFrame(hashFrame);
      window.cancelAnimationFrame(frame);
      wrapper.removeEventListener("click", onAnchorClick);
      window.removeEventListener("hashchange", scrollToHash);
      window.removeEventListener("popstate", scrollToHash);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
