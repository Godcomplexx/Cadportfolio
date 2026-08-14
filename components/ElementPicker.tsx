"use client";

import { useEffect, useState } from "react";

/**
 * Dev-only element picker.
 *
 * Press `I` to arm it, then hover to highlight anything on the page and click
 * to copy a description of it. The label names the component/class so it can
 * be referred to precisely instead of described by eye.
 *
 * Never rendered in production builds.
 */

type Picked = {
  label: string;
  selector: string;
  size: string;
};

function describe(el: HTMLElement): Picked {
  const tag = el.tagName.toLowerCase();
  const classes = (el.className || "").toString().trim().split(/\s+/).filter(Boolean);

  // Prefer a meaningful, non-utility class as the human-facing name.
  const named =
    classes.find((c) => !/^(is-|has-|depth-|reveal)/.test(c)) ?? classes[0] ?? tag;

  const selector = el.id
    ? `#${el.id}`
    : classes.length
      ? `${tag}.${classes.slice(0, 3).join(".")}`
      : tag;

  const rect = el.getBoundingClientRect();
  return {
    label: named,
    selector,
    size: `${Math.round(rect.width)}×${Math.round(rect.height)}`,
  };
}

export function ElementPicker() {
  const [armed, setArmed] = useState(false);
  const [hovered, setHovered] = useState<Picked | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = /^(input|textarea|select)$/i.test(
        (event.target as HTMLElement)?.tagName ?? "",
      );
      if (typing) return;
      if (event.key.toLowerCase() === "i") {
        setArmed((current) => !current);
        setCopied(null);
      }
      if (event.key === "Escape") setArmed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!armed) {
      document
        .querySelectorAll(".ep-outline")
        .forEach((el) => el.classList.remove("ep-outline"));
      const clear = window.setTimeout(() => setHovered(null), 0);
      return () => window.clearTimeout(clear);
    }

    let current: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      const el = document.elementFromPoint(
        event.clientX,
        event.clientY,
      ) as HTMLElement | null;
      if (!el || el === current) return;
      if (el.closest(".element-picker")) return;

      current?.classList.remove("ep-outline");
      current = el;
      el.classList.add("ep-outline");
      setHovered(describe(el));
    };

    const onClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement)?.closest(".element-picker")) return;
      event.preventDefault();
      event.stopPropagation();
      const el = document.elementFromPoint(
        event.clientX,
        event.clientY,
      ) as HTMLElement | null;
      if (!el) return;

      const info = describe(el);
      const text = `${info.label}  (${info.selector}, ${info.size})`;
      navigator.clipboard?.writeText(text).catch(() => {});
      setCopied(text);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick, true);
      current?.classList.remove("ep-outline");
    };
  }, [armed]);

  return (
    <div className={`element-picker${armed ? " element-picker--on" : ""}`}>
      {armed ? (
        <>
          <strong>{hovered?.label ?? "hover anything"}</strong>
          <span>{hovered?.selector ?? ""}</span>
          {copied ? <em>copied: {copied}</em> : <em>click to copy · Esc to exit</em>}
        </>
      ) : (
        <span>press I to inspect</span>
      )}
    </div>
  );
}
