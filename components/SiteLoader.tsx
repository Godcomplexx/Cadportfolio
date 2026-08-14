"use client";

import { useEffect, useState } from "react";

/**
 * Boot sequence.
 *
 *  1. A ~140px progress bar fills as fonts and WebGL assets settle.
 *     Width transitions over 520ms.
 *  2. At 100% the loader holds ~250ms, then fades out over 250ms.
 *  3. The page is revealed through a pixellated radial mask that opens from
 *     the centre over ~0.8s — square dots along the mask edge rather than a
 *     plain fade.
 */

const HOLD_MS = 250;
const FADE_MS = 250;
const REVEAL_MS = 800;

export function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "revealing" | "done">("loading");

  useEffect(() => {
    // Respect reduced motion: skip straight to the finished state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("loaded");
      const skip = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(skip);
    }

    let cancelled = false;
    const timers: number[] = [];

    const finish = () => {
      if (cancelled) return;
      setProgress(100);
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setPhase("revealing");
          document.documentElement.classList.add("loaded");
          timers.push(
            window.setTimeout(() => {
              if (!cancelled) setPhase("done");
            }, REVEAL_MS + FADE_MS),
          );
        }, HOLD_MS),
      );
    };

    // Track real readiness: fonts plus window load, with a hard ceiling so a
    // stalled asset can never trap the visitor behind the loader.
    const signals: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
    ];

    let ticked = 0;
    const creep = window.setInterval(() => {
      ticked += 1;
      if (cancelled) return;
      // Ease toward 90% while waiting; the real completion pushes it to 100.
      setProgress((current) => (current < 90 ? current + (90 - current) * 0.18 : current));
      if (ticked > 40) window.clearInterval(creep);
    }, 120);
    timers.push(creep);

    Promise.race([
      Promise.all(signals),
      new Promise((resolve) => timers.push(window.setTimeout(resolve, 6000))),
    ]).then(finish);

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(creep);
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
