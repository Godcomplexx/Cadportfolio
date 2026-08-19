"use client";

import { useEffect, useRef } from "react";
import { publicPath } from "@/lib/public-path";

/**
 * Pre-rendered turntable driven by the pointer.
 *
 * The clip is a 250-frame orbit of the terminal. Rather than playing it, the
 * horizontal pointer position is mapped to a frame: moving the mouse left and
 * right scrubs the model around, so it reads as an object you are turning.
 *
 * This keeps the Blender lighting exactly as authored — no real-time shading —
 * while still feeling interactive.
 */

// Use the original Blender WebM: it already contains a real alpha channel and
// keeps the authored lighting intact. Do not put the opaque MP4 first and do
// not substitute a re-encoded alpha copy, as both change the final composite.
const CLIP_ALPHA = publicPath("/media/cad-hero/render0001-0250.webm");
const CLIP_POSTER = publicPath("/media/cad-hero/turntable-poster.webp");
const FRAMES = 250;
const FPS = 24;
const DURATION = FRAMES / FPS;

/** How much of the full orbit the pointer sweeps across (1 = a whole turn). */
const SWEEP = 0.5;
/** Frame shown when the pointer is centred / absent. */
const REST = 0.5;
/** Constant orbit speed in turns per second. No ease-out near the cursor. */
const TURN_SPEED = 0.42;
/** Keep decoded seeks close together so the browser never skips a large arc. */
const MAX_FRAME_STEP = 2;
/** Seeking compressed video faster than this adds decode work, not smoothness. */
const SEEK_INTERVAL = 1000 / 30;

export function HeroTurntable() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let target = REST;
    let current = REST;
    let frame = 0;
    let previousTimestamp = 0;
    let previousSeekTimestamp = 0;
    let requestedFrame = Math.round(REST * (FRAMES - 1));
    let visible = true;

    const onLoaded = () => {
      // Park on the resting frame so the first paint is not frame zero.
      video.currentTime = REST * DURATION;
    };
    // The clip may already be buffered by the time this effect runs, in which
    // case the event has fired and will not fire again.
    if (video.readyState >= 2) onLoaded();
    else video.addEventListener("loadeddata", onLoaded);

    // Static devices simply hold the resting pose.
    if (reduced || coarse) {
      return () => video.removeEventListener("loadeddata", onLoaded);
    }

    const onMove = (event: PointerEvent) => {
      if (!visible) return;
      const x = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
      // Keep the target exact. The animation loop supplies consistent
      // smoothing regardless of the mouse polling rate.
      target = REST - (x - 0.5) * SWEEP;
      startAnimation();
    };
    const onLeave = () => {
      target = REST;
      startAnimation();
    };

    const tick = (timestamp: number) => {
      frame = 0;
      if (!visible) return;

      // Seek as soon as enough of the clip is buffered to show a frame.
      if (video.readyState >= 2 && video.duration) {
        // Move at a constant angular speed. Exponential interpolation used to
        // slow down near the target and made the last part of the turn stutter.
        const delta = previousTimestamp
          ? Math.min((timestamp - previousTimestamp) / 1000, 0.05)
          : 0;
        const distance = target - current;
        const step = TURN_SPEED * delta;
        current += Math.sign(distance) * Math.min(Math.abs(distance), step);

        const wrapped = ((current % 1) + 1) % 1;
        const desiredFrame = Math.min(
          FRAMES - 1,
          Math.max(0, Math.round(wrapped * (FRAMES - 1))),
        );

        // Blender's orbit runs opposite to screen coordinates: later frames
        // face left and earlier frames face right.
        if (
          timestamp - previousSeekTimestamp >= SEEK_INTERVAL &&
          !video.seeking &&
          desiredFrame !== requestedFrame
        ) {
          const frameDelta = desiredFrame - requestedFrame;
          requestedFrame += Math.sign(frameDelta) * Math.min(
            Math.abs(frameDelta),
            MAX_FRAME_STEP,
          );
          video.currentTime = Math.min(
            requestedFrame / FPS,
            video.duration - 0.001,
          );
          previousSeekTimestamp = timestamp;
        }

        const settled =
          Math.abs(target - current) < 0.0005 &&
          desiredFrame === requestedFrame &&
          !video.seeking;
        previousTimestamp = timestamp;
        if (!settled) frame = window.requestAnimationFrame(tick);
        return;
      }
      previousTimestamp = timestamp;
      frame = window.requestAnimationFrame(tick);
    };

    function startAnimation() {
      if (frame || !visible) return;
      previousTimestamp = performance.now();
      frame = window.requestAnimationFrame(tick);
    }

    const hero = video.closest(".system-hero");
    const scrollRoot = document.querySelector<HTMLElement>("[data-scroll-container]");
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { root: scrollRoot, threshold: 0.01 },
    );
    if (hero) visibilityObserver.observe(hero);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, []);

  return (
    <div className="hero-turntable" aria-hidden="true">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster={CLIP_POSTER}
        // Never auto-plays: every frame comes from pointer position.
      >
        <source src={CLIP_ALPHA} type="video/webm" />
      </video>
    </div>
  );
}
