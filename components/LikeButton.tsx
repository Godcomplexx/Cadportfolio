"use client";

import { useEffect, useState } from "react";
import type { ProjectKey } from "@/lib/projects";

type LikeButtonProps = {
  project: ProjectKey;
  projectName: string;
};

export function LikeButton({ project, projectName }: LikeButtonProps) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) {
        setLiked(window.localStorage.getItem(`liked:${project}`) === "1");
      }
    });
    const controller = new AbortController();

    fetch("/api/likes", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load likes.");
        return response.json() as Promise<{ counts: Record<ProjectKey, number> }>;
      })
      .then((data) => setCount(data.counts[project] ?? 0))
      .catch(() => setCount(0));

    return () => {
      active = false;
      controller.abort();
    };
  }, [project]);

  async function toggleLike() {
    if (pending) return;

    const nextLiked = !liked;
    const previousCount = count ?? 0;

    setPending(true);
    setLiked(nextLiked);
    setCount(Math.max(0, previousCount + (nextLiked ? 1 : -1)));
    if (nextLiked) setBurst((value) => value + 1);

    try {
      const response = await fetch("/api/likes", {
        method: nextLiked ? "POST" : "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ project }),
      });
      if (!response.ok) throw new Error("Could not save like.");

      const data = (await response.json()) as { count: number };
      setCount(data.count);
      if (nextLiked) {
        window.localStorage.setItem(`liked:${project}`, "1");
      } else {
        window.localStorage.removeItem(`liked:${project}`);
      }
    } catch {
      setLiked(!nextLiked);
      setCount(previousCount);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      className={`like-button${liked ? " is-liked" : ""}`}
      type="button"
      aria-label={`${liked ? "Remove your like from" : "Like"} ${projectName}`}
      aria-pressed={liked}
      disabled={pending}
      onClick={toggleLike}
    >
      <span className="like-button__heart" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 21s-8.5-4.8-8.5-11.2A4.8 4.8 0 0 1 12 6.7a4.8 4.8 0 0 1 8.5 3.1C20.5 16.2 12 21 12 21Z" />
        </svg>
        {burst > 0 && liked ? <i className="like-button__burst" key={burst} /> : null}
      </span>
      <span className="like-button__text">{liked ? "Liked" : "Like project"}</span>
      <span className="like-button__count" aria-live="polite">{count ?? "—"}</span>
    </button>
  );
}
