"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ASCII-scramble reveal.
 *
 * Before each real character settles, the slot cycles through random glyphs.
 * Letters resolve in sequence (left-to-right or right-to-left), and while a
 * slot is still cycling it renders in the accent colour, snapping to the
 * inherited colour once it locks.
 *
 * Timings follow the site's motion spec:
 *   - glyph swap      ~40ms
 *   - per-letter gap  ~80ms
 *   - settle time     ~320ms per letter
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-=?/<>";

const SWAP_MS = 40;
const STAGGER_MS = 80;
const SETTLE_MS = 320;

type Direction = "ltr" | "rtl";

export function Scramble({
  text,
  as: Tag = "span",
  className,
  direction = "ltr",
  delay = 0,
  once = true,
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  direction?: Direction;
  /** Extra delay before the run starts, for cascading several lines. */
  delay?: number;
  once?: boolean;
}) {
  const hostRef = useRef<HTMLElement>(null);
  // Server and first paint render the real text, so it is always readable
  // without JS and never flashes as gibberish for screen readers.
  const [display, setDisplay] = useState(text);
  const [locked, setLocked] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("no-motion")
    ) {
      return;
    }

    const chars = Array.from(text);
    let swapTimer = 0;
    let startTimer = 0;
    let played = false;

    const run = () => {
      const started = performance.now();

      const tick = () => {
        const elapsed = performance.now() - started;
        let settledCount = 0;

        const next = chars.map((char, index) => {
          if (char === " ") return " ";
          // Position in the resolve order, respecting direction.
          const order = direction === "rtl" ? chars.length - 1 - index : index;
          const startAt = order * STAGGER_MS;

          if (elapsed >= startAt + SETTLE_MS) {
            settledCount += 1;
            return char;
          }
          if (elapsed < startAt) return "";
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        });

        setDisplay(next.join(""));
        setLocked(settledCount);

        if (settledCount < chars.filter((c) => c !== " ").length) {
          swapTimer = window.setTimeout(tick, SWAP_MS);
        } else {
          setDisplay(text);
        }
      };

      tick();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (once && played) return;
          played = true;
          startTimer = window.setTimeout(run, delay);
          if (once) observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
      window.clearTimeout(swapTimer);
      window.clearTimeout(startTimer);
    };
  }, [text, direction, delay, once]);

  const settling = locked > 0 && display !== text;

  return (
    <Tag
      ref={hostRef as React.RefObject<HTMLElement & HTMLHeadingElement>}
      className={`${className ?? ""}${settling ? " is-scrambling" : ""}`}
      data-scramble
    >
      {display}
    </Tag>
  );
}
