"use client";

import { useEffect, useState } from "react";

/**
 * Boot sequence.
 *
 *  1. The first visit gets a short, deterministic boot pulse.
 *  2. The page is revealed through the existing pixellated radial mask.
 *  3. Repeat views in the same tab skip the loader entirely.
 */

const FIRST_VISIT_KEY = "cadtfolio-loader-seen";
const HOLD_MS = 240;
const FADE_MS = 160;
const REVEAL_MS = 300;

export function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "revealing" | "done">("loading");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(FIRST_VISIT_KEY) === "1";
    } catch {
      // Storage can be unavailable in hardened/private browser modes. A short
      // loader is still safe, so fall through to the first-visit path.
    }

    // Motion-sensitive and repeat visitors should never wait behind a mask.
    if (reduced || seen) {
      document.documentElement.classList.add("loaded");
      const skip = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(skip);
    }

    let cancelled = false;
    const timers: number[] = [];

    try {
      window.sessionStorage.setItem(FIRST_VISIT_KEY, "1");
    } catch {
      // See the read guard above.
    }

    const progressFrame = window.requestAnimationFrame(() => setProgress(100));
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("revealing");
        document.documentElement.classList.add("loaded");
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setPhase("done");
          }, Math.max(REVEAL_MS, FADE_MS)),
        );
      }, HOLD_MS),
    );

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(progressFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`site-loader${phase === "revealing" ? " site-loader--out" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${Math.round(progress)} percent`}
    >
      <div className="site-loader__bar">
        <i style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
