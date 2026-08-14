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
import { flushSync } from "react-dom";
import {
  MIX_CUES,
  PLAYLIST_OWNER,
  YOUTUBE_MIX_AUTHOR,
  YOUTUBE_MIX_COVER,
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

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
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

  apiPromise = new Promise<YouTubeNamespace>((resolve, reject) => {
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

export function MusicPlayer() {
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  const hostRef = useRef<HTMLDivElement>(null);
  // Written to directly each frame, bypassing React for the moving fill.
  const progressRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    if (window.localStorage.getItem("music-widget-v2") !== "closed") return;
    const restore = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // YouTube replaces the element passed to YT.Player with an iframe. Keep
    // that mutation inside an imperative mount so React never reconciles a
    // node that the third-party API has removed from the DOM.
    const mount = document.createElement("div");
    host.replaceChildren(mount);

    let disposed = false;
    let poll = 0;

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
            },
            onStateChange: (event) => {
              if (disposed) return;
              setPlaying(event.data === YT.PlayerState.PLAYING);
              const total = event.target.getDuration();
              if (total > 0) setDuration(total);
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

        // Drive the read-out from rAF so updates land in step with the
        // browser's paint cycle. A setInterval fires on its own schedule and
        // its state writes miss frames, which is what made the bar stutter.
        let lastShown = -1;
        const tick = () => {
          poll = window.requestAnimationFrame(tick);
          const current = playerRef.current;
          if (!current?.getCurrentTime) return;

          const elapsed = current.getCurrentTime();
          // The clock only renders whole seconds, so re-render at most once
          // per second instead of on every frame.
          const whole = Math.floor(elapsed);
          if (whole !== lastShown) {
            lastShown = whole;
            setCurrentTime(elapsed);
          }

          const total = current.getDuration();
          if (total > 0) setDuration((value) => (value === total ? value : total));

          // The bar itself is moved through a CSS variable — no React render,
          // so the fill stays smooth between the once-a-second updates.
          progressRef.current?.style.setProperty(
            "--player-progress",
            `${total > 0 ? Math.min((elapsed / total) * 100, 100) : 0}%`,
          );
        };
        poll = window.requestAnimationFrame(tick);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(poll);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      host.replaceChildren();
    };
  }, []);

  const toggleOpen = useCallback(() => {
    const update = () => {
      setOpen((current) => {
        const next = !current;
        window.localStorage.setItem("music-widget-v2", next ? "open" : "closed");
        return next;
      });
    };

    const transitionDocument = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!transitionDocument.startViewTransition || reduceMotion) {
      update();
      return;
    }

    transitionDocument.startViewTransition(() => {
      flushSync(update);
    });
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  }, [playing]);

  const seekBy = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    const total = player.getDuration();
    const next = Math.min(Math.max(player.getCurrentTime() + seconds, 0), total || Infinity);
    player.seekTo(next, true);
    setCurrentTime(next);
  }, []);

  const seekToCue = useCallback((cueIndex: number) => {
    const player = playerRef.current;
    if (!player) return;
    const next = MIX_CUES[cueIndex]?.startSeconds;
    if (next === undefined) return;
    player.seekTo(next, true);
    setCurrentTime(next);
  }, []);

  const seekRandom = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const total = player.getDuration();
    if (!total) return;
    const next = Math.random() * Math.max(total - 5, 0);
    player.seekTo(next, true);
    setCurrentTime(next);
  }, []);

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

  const changeVolume = useCallback((next: number) => {
    setVolume(next);
    playerRef.current?.setVolume(next);
  }, []);

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const progressStyle = { "--player-progress": `${progress}%` } as CSSProperties;
  const activeCueIndex = cueIndexAt(currentTime);
  const activeCue = MIX_CUES[activeCueIndex];
  const cueWindowStart = Math.min(
    Math.max(activeCueIndex - 1, 0),
    Math.max(MIX_CUES.length - 4, 0),
  );
  const visibleCues = MIX_CUES.slice(cueWindowStart, cueWindowStart + 4);

  return (
    <section
      className={`music-widget${open ? "" : " music-widget--closed"}`}
      aria-label="Music player"
    >
      <header className="music-widget__bar">
        {open ? (
          <>
            <h2>
              <span className="music-widget__note" aria-hidden="true">♫</span>
              Now playing
            </h2>
            <span className="music-widget__window-actions" aria-label="Window controls">
              <button type="button" onClick={toggleOpen} aria-label="Minimize player">
                <PixelIcon name="minimize"><path d="M6 23h20v3H6z" /></PixelIcon>
              </button>
              <span className="music-widget__window-max" aria-hidden="true">
                <PixelIcon name="maximize"><path d="M5 5h22v22H5zm3 3v16h16V8z" /></PixelIcon>
              </span>
              <button type="button" onClick={toggleOpen} aria-label="Close player">
                <PixelIcon name="close"><path d="m7 5 9 9 9-9 2 2-9 9 9 9-2 2-9-9-9 9-2-2 9-9-9-9z" /></PixelIcon>
              </button>
            </span>
          </>
        ) : (
          <span className="music-widget__window-actions music-widget__window-actions--closed" aria-hidden="true">
            <span><PixelIcon name="minimize"><path d="M6 23h20v3H6z" /></PixelIcon></span>
            <span><PixelIcon name="maximize"><path d="M5 5h22v22H5zm3 3v16h16V8z" /></PixelIcon></span>
            <span><PixelIcon name="close"><path d="m7 5 9 9 9-9 2 2-9 9 9 9-2 2-9-9-9 9-2-2 9-9-9-9z" /></PixelIcon></span>
          </span>
        )}
      </header>

      {!open ? (
        <div className="music-widget__closed-launch">
          <h2>
            <span className="music-widget__note" aria-hidden="true">♫</span>
            Now playing
          </h2>
          <button
            className="music-widget__toggle"
            type="button"
            onClick={toggleOpen}
            aria-expanded={false}
            aria-controls="music-widget-panel"
            aria-label="Expand music player"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      ) : null}

      {open ? (
        <div className="music-widget__panel" id="music-widget-panel">
          <div className="music-widget__screen">
            <div className="music-widget__library">
              <div className="music-widget__art">
                <img
                  src={YOUTUBE_MIX_COVER}
                  alt={`${YOUTUBE_MIX_TITLE} by ${YOUTUBE_MIX_AUTHOR}`}
                  loading="eager"
                  width={480}
                  height={360}
                />
              </div>

              <ol className="music-widget__list" aria-label="Mix sections">
                {visibleCues.map((item, visibleIndex) => {
                  const cueIndex = cueWindowStart + visibleIndex;
                  const isActive = cueIndex === activeCueIndex;
                  return (
                    <li key={`${item.startSeconds}-${item.title}`}>
                      <button
                        type="button"
                        className={isActive ? "is-active" : undefined}
                        onClick={() => seekToCue(cueIndex)}
                        disabled={!ready}
                        aria-pressed={isActive}
                        aria-label={`Jump to ${item.title} at ${formatTime(item.startSeconds)}`}
                      >
                        <span className="music-widget__index" aria-hidden="true">
                          {isActive ? "▶" : "▫"}
                        </span>
                        <span className="music-widget__meta">
                          <strong
                            className={item.title.length > 16 ? "is-long" : undefined}
                            title={item.title}
                          >
                            {item.title}
                          </strong>
                          <em>{item.artist}</em>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="music-widget__now">
              <span className="music-widget__equalizer" aria-hidden="true">
                <PixelIcon name="equalizer">
                  <path d="M2 24h3v6H2zm0-8h3v5H2zm5 2h3v12H7zm0-9h3v6H7zm5 12h3v9h-3zm0-17h3v14h-3zm5 9h3v17h-3zm0-8h3v5h-3zm5 14h3v11h-3zm0-10h3v7h-3zm5 6h3v15h-3zm0-11h3v8h-3z" />
                </PixelIcon>
              </span>
              <p className="music-widget__current">
                <strong>{activeCue.title}</strong>
                <span>{activeCue.artist}</span>
              </p>
              <time>{formatTime(currentTime)} / {duration ? formatTime(duration) : "--:--"}</time>
            </div>

            <div
              ref={progressRef}
              className="music-widget__progress"
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

            <div className="music-widget__controls" aria-label="Player controls">
              <button type="button" onClick={() => seekBy(-30)} disabled={!ready} aria-label="Back 30 seconds">
                <PixelIcon name="previous"><path d="M4 6h4v20H4zm22 0v20L9 16z" /></PixelIcon>
              </button>

              <button
                className="music-widget__play"
                type="button"
                onClick={togglePlay}
                disabled={!ready}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <PixelIcon name="stop"><path d="M7 7h18v18H7z" /></PixelIcon>
                ) : (
                  <PixelIcon name="play"><path d="m8 5 20 11L8 27z" /></PixelIcon>
                )}
              </button>

              <button type="button" onClick={() => seekBy(30)} disabled={!ready} aria-label="Forward 30 seconds">
                <PixelIcon name="next"><path d="m6 6 17 10L6 26zm18 0h4v20h-4z" /></PixelIcon>
              </button>

              <button className="music-widget__shuffle" type="button" onClick={seekRandom} disabled={!ready} aria-label="Jump to a random point">
                <PixelIcon name="shuffle"><path d="M3 8h5c5 0 7 6 10 10 2 3 4 6 7 6h4v-4l3 5-3 5v-3h-4c-5 0-7-6-10-10-2-3-4-6-7-6H3zm22 0h4V5l3 5-3 5v-4h-4c-2 0-4 2-5 4l-2-3c2-2 4-4 7-4zM3 24h5c2 0 4-2 6-4l2 3c-3 3-5 4-8 4H3z" /></PixelIcon>
              </button>

              <span className="music-widget__volume">
                <PixelIcon name="speaker"><path d="M3 12h6l8-7v22l-8-7H3zm18-2c3 3 3 9 0 12l-2-2c2-2 2-6 0-8zm4-4c6 6 6 14 0 20l-2-2c5-5 5-11 0-16z" /></PixelIcon>
                {Array.from({ length: 10 }, (_, part) => (
                  <i key={part} className={part < Math.ceil(volume / 10) ? "is-lit" : undefined} />
                ))}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  aria-label="Volume"
                />
              </span>
            </div>

            {failed ? (
              <p className="music-widget__error">
                Playback unavailable — <a href={YOUTUBE_MIX_URL} target="_blank" rel="noopener noreferrer">open on YouTube ↗</a>
              </p>
            ) : null}
          </div>

          <footer className="music-widget__foot">
            <a href={YOUTUBE_MIX_URL} target="_blank" rel="noopener noreferrer">
              Open in music <span aria-hidden="true">↗</span>
            </a>
            <span>{PLAYLIST_OWNER} mix</span>
          </footer>
        </div>
      ) : null}

      <div className="music-widget__youtube" ref={hostRef} aria-hidden="true" />
    </section>
  );
}
