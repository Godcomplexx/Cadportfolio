"use client";

import Link from "vinext/shims/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  {
    href: "https://godcomplexx.github.io/portfolio/resume/daria_melnikova_resume_print.html",
    label: "CV",
    external: true,
  },
  { href: "mailto:daha442242@gmail.com", label: "Contact", external: true },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Daria Melnikova — home">
        DARIA <span>MELNIKOVA</span>
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "Close" : "Menu"}</span>
        <i aria-hidden="true" />
      </button>

      <nav
        className={`site-navigation${open ? " is-open" : ""}`}
        id="site-navigation"
        aria-label="Primary navigation"
      >
        {links.map((link) =>
          link.external ? (
            <a
              href={link.href}
              key={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
              {link.href.startsWith("http") ? <sup>↗</sup> : null}
            </a>
          ) : (
            <Link href={link.href} key={link.label} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ),
        )}
      </nav>

      <p className="header-status">
        <span aria-hidden="true" />
        Open to work
      </p>
    </header>
  );
}
