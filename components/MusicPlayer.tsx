"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  MIX_CUES,
  YOUTUBE_MIX_AUTHOR,
  YOUTUBE_MIX_ID,
  YOUTUBE_MIX_TITLE,
  YOUTUBE_MIX_URL,
} from "@/lib/tracks";

type YouTubePlayer = {
  destroy(): void;
  getCurrentTime(): number;
  getDuration(): number;
  pauseVideo(): void;
  playVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
};

type YouTubePlayerEvent = { target: YouTubePlayer };
type YouTubeStateEvent = YouTubePlayerEvent & { data: number };

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady(event: YouTubePlayerEvent): void;
        onStateChange(event: YouTubeStateEvent): void;
        onError(event: YouTubeStateEvent): void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YouTubeNamespace> | null = null;

function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (apiPromise) return apiPromise;

  const request = new Promise<YouTubeNamespace>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube API loaded without a Player"));
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => reject(new Error("Failed to load the YouTube API"));
      document.head.appendChild(script);
    }
  });

  apiPromise = request.catch((error) => {
    // A failed network request must be retryable from the Play button.
    apiPromise = null;
    throw error;
  });

  return apiPromise;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const value = Math.floor(seconds);
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remaining = value % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function cueIndexAt(seconds: number) {
  let active = 0;
  for (let index = 1; index < MIX_CUES.length; index += 1) {
    if (seconds < MIX_CUES[index].startSeconds) break;
    active = index;
  }
  return active;
}

function PixelIcon({ name, children }: { name: string; children: ReactNode }) {
  return (
    <svg className={`pixel-icon pixel-icon--${name}`} viewBox="0 0 32 32" aria-hidden="true">
      {children}
    </svg>
  );
}

/* Equaliser shape. Must match --eq-levels in globals.css. */
const EQ_BARS = 9;
const EQ_LEVELS = 7;
/* Bars are refreshed on their own clock rather than every frame: a real LED
   meter steps, and 60fps updates would blur the pixel grid into a smear. */
const EQ_FRAME_MS = 70;

/* Per-bar weighting. Lows sit fuller and move slower, highs are spikier — the
   same silhouette a spectrum analyser gives, without any spectrum data. */
const EQ_BAND_WEIGHT = [1, 0.96, 0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42];
const EQ_BAND_SPEED = [1.7, 2.3, 3.1, 3.7, 4.3, 5.1, 5.9, 6.7, 7.3];

/* Deterministic value noise: smooth, seedable and cheap. Interpolating between
   integer steps keeps a bar from teleporting between unrelated heights. */
function noiseAt(x: number, seed: number) {
  const hash = (n: number) => {
    const v = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const i = Math.floor(x);
  const f = x - i;
  // Smoothstep between the two neighbouring integer samples.
  const t = f * f * (3 - 2 * f);
  return hash(i) * (1 - t) + hash(i + 1) * t;
}

export function MusicPlayer() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const [playerRequested, setPlayerRequested] = useState(false);

  const hostRef = useRef<HTMLDivElement>(null);
  // Written to directly each frame, bypassing React for the moving fill.
  const progressRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const pendingPlayRef = useRef(false);
  const eqRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Keep navigation and scrolling free of third-party work. YouTube is
    // requested only by an explicit press on the player's Play button.
    if (!playerRequested) return;

    const host = hostRef.current;
    if (!host) return;

    // YouTube replaces the element passed to YT.Player with an iframe. Keep
    // that mutation inside an imperative mount so React never reconciles a
    // node that the third-party API has removed from the DOM.
    const mount = document.createElement("div");
    host.replaceChildren(mount);

    let disposed = false;
    let poll = 0;
    let playerIsPlaying = false;
    let lastShown = -1;

    const stopPolling = () => {
      window.cancelAnimationFrame(poll);
      poll = 0;
    };

    const syncProgress = () => {
      const current = playerRef.current;
      if (!current?.getCurrentTime) return;

      const elapsed = current.getCurrentTime();
      const whole = Math.floor(elapsed);
      if (whole !== lastShown) {
        lastShown = whole;
        setCurrentTime(elapsed);
      }

      const total = current.getDuration();
      if (total > 0) setDuration((value) => (value === total ? value : total));
      progressRef.current?.style.setProperty(
        "--player-progress",
        `${total > 0 ? Math.min((elapsed / total) * 100, 100) : 0}%`,
      );
    };

    const tick = () => {
      poll = 0;
      if (disposed || !playerIsPlaying || document.hidden) return;
      syncProgress();
      poll = window.requestAnimationFrame(tick);
    };

    const startPolling = () => {
      if (!poll && playerIsPlaying && !document.hidden) {
        poll = window.requestAnimationFrame(tick);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopPolling();
      else startPolling();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    loadYouTubeApi()
      .then((YT) => {
        if (disposed) return;

        const player = new YT.Player(mount, {
          videoId: YOUTUBE_MIX_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (disposed) return;
              const total = event.target.getDuration();
              setReady(true);
              setFailed(false);
              setDuration(total);
              event.target.setVolume(70);
              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              if (disposed) return;
              playerIsPlaying = event.data === YT.PlayerState.PLAYING;
              setPlaying(playerIsPlaying);
              const total = event.target.getDuration();
              if (total > 0) setDuration(total);
              if (playerIsPlaying) startPolling();
              else {
                stopPolling();
                syncProgress();
              }
              if (event.data === YT.PlayerState.ENDED) {
                setCurrentTime(total);
              }
            },
            onError: () => {
              if (!disposed) setFailed(true);
            },
          },
        });

        playerRef.current = player;
      })
      .catch(() => {
        if (!disposed) {
          pendingPlayRef.current = false;
          setFailed(true);
          setPlayerRequested(false);
        }
      });

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopPolling();
      playerRef.current?.destroy?.();
      playerRef.current = null;
      host.replaceChildren();
    };
  }, [playerRequested]);

  // Drive the meter. Levels are written straight to CSS custom properties so a
  // 14fps animation never triggers a React render.
  useEffect(() => {
    const eq = eqRef.current;
    if (!eq) return;

    const bars = Array.from(eq.querySelectorAll<HTMLElement>("i"));
    const setLevels = (levels: number[]) => {
      bars.forEach((bar, index) => {
        bar.style.setProperty("--eq-level", String(levels[index]));
      });
    };

    if (!playing) {
      // Settle to the floor rather than freezing mid-spike.
      setLevels(bars.map(() => 1));
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const started = performance.now();

    const step = () => {
      // Clock the walk off elapsed time, not frame count, so a throttled
      // background tab resumes in phase instead of lurching.
      const seconds = (performance.now() - started) / 1000;

      setLevels(
        bars.map((_, index) => {
          const weight = EQ_BAND_WEIGHT[index] ?? 0.5;
          const speed = EQ_BAND_SPEED[index] ?? 4;
          // Two octaves of noise: a slow body plus a faster flicker.
          const body = noiseAt(seconds * speed, index);
          const flicker = noiseAt(seconds * speed * 2.4, index + 40) * 0.35;
          const amplitude = Math.min(body * 0.85 + flicker, 1) * weight;
          return Math.max(1, Math.round(amplitude * EQ_LEVELS));
        }),
      );

      timer = window.setTimeout(step, EQ_FRAME_MS);
    };

    step();
    return () => window.clearTimeout(timer);
  }, [playing]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      pendingPlayRef.current = true;
      setFailed(false);
      setPlayerRequested(true);
      return;
    }
    if (playing) player.pauseVideo();
    else player.playVideo();
  }, [playing]);

  const scrub = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const player = playerRef.current;
      if (!player || !duration) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const ratio = (event.clientX - bounds.left) / bounds.width;
      const next = Math.min(Math.max(ratio, 0), 1) * duration;
      player.seekTo(next, true);
      setCurrentTime(next);
    },
    [duration],
  );

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const progressStyle = { "--player-progress": `${progress}%` } as CSSProperties;
  const activeCue = MIX_CUES[cueIndexAt(currentTime)];
  const loading = playerRequested && !ready;

  return (
    <div
      className={`music-rail${playing ? " music-rail--playing" : ""}`}
      aria-label="Music player"
      aria-busy={loading}
    >
      <button
        className="music-rail__play"
        type="button"
        onClick={togglePlay}
        disabled={loading}
        aria-label={playing ? "Pause mix" : loading ? "Loading mix" : "Play mix"}
      >
        {playing ? (
          <PixelIcon name="stop"><path d="M7 7h18v18H7z" /></PixelIcon>
        ) : (
          <PixelIcon name="play"><path d="m8 5 20 11L8 27z" /></PixelIcon>
        )}
      </button>

      {/* Levels are written to --eq-level per bar by the effect above; the
          loop only runs while the mix is playing. */}
      <span className="music-rail__eq" ref={eqRef} aria-hidden="true">
        {Array.from({ length: EQ_BARS }, (_, bar) => (
          <i key={bar} />
        ))}
      </span>

      <p className="music-rail__now">
        <strong>{activeCue.title}</strong>
        <span aria-hidden="true">·</span>
        <em>{activeCue.artist}</em>
      </p>

      <div
        ref={progressRef}
        className="music-rail__progress"
        onClick={scrub}
        role="slider"
        aria-label="Mix progress"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration)}
        aria-valuenow={Math.floor(currentTime)}
        style={progressStyle}
      >
        <i />
      </div>

      <time className="music-rail__time">
        {formatTime(currentTime)} / {duration ? formatTime(duration) : "--:--"}
      </time>

      <a
        className="music-rail__source"
        href={YOUTUBE_MIX_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={`${YOUTUBE_MIX_TITLE} — ${YOUTUBE_MIX_AUTHOR}`}
      >
        {failed ? "Unavailable" : "Source"} <span aria-hidden="true">↗</span>
      </a>

      <div className="music-rail__youtube" ref={hostRef} aria-hidden="true" />
    </div>
  );
}
