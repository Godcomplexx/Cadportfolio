"use client";

import Link from "vinext/shims/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { LikeButton } from "@/components/LikeButton";
import { projects } from "@/lib/projects";

const sceneNames = ["Intro", "Motion", "System", "Wearable", "Scan"];
const cvUrl =
  "https://godcomplexx.github.io/portfolio/resume/daria_melnikova_resume_print.html";

const speckles = Array.from({ length: 28 }, (_, index) => ({
  left: `${9 + ((index * 31) % 82)}%`,
  top: `${8 + ((index * 47) % 78)}%`,
  delay: `${(index % 7) * -0.18}s`,
}));

function DeviceScreen({ activeScene }: { activeScene: number }) {
  return (
    <div className="console-screen">
      <div className={`screen-world${activeScene === 0 ? " is-active" : ""}`}>
        <span className="screen-orbit screen-orbit--a" />
        <span className="screen-orbit screen-orbit--b" />
        <span className="screen-core">DM</span>
        <small>SELECTED SYSTEMS / 2026</small>
      </div>

      <div className={`screen-motion${activeScene === 1 ? " is-active" : ""}`}>
        <span className="motion-ring" />
        <span className="motion-body">
          <i />
          <b>〰</b>
        </span>
        <small>MOVE / SLEEP / PLAY</small>
      </div>

      <div className={`screen-modules${activeScene === 2 ? " is-active" : ""}`}>
        <span />
        <span />
        <span />
        <span />
        <small>REPEATABLE INTERFACES</small>
      </div>

      <div className={`screen-wearable${activeScene === 3 ? " is-active" : ""}`}>
        <span className="wearable-shell wearable-shell--left" />
        <span className="wearable-board" />
        <span className="wearable-shell wearable-shell--right" />
        <small>FORM → INTERNAL STACK</small>
      </div>

      <div className={`screen-scan${activeScene === 4 ? " is-active" : ""}`}>
        {speckles.map((speckle, index) => (
          <i
            key={index}
            style={
              {
                "--dot-left": speckle.left,
                "--dot-top": speckle.top,
                "--dot-delay": speckle.delay,
              } as CSSProperties
            }
          />
        ))}
        <b>SCAN_04</b>
        <small>CAPTURE → CLEAN MESH</small>
      </div>
    </div>
  );
}

function PrototypeConsole({ activeScene }: { activeScene: number }) {
  return (
    <div className={`prototype-console prototype-console--${activeScene}`} aria-hidden="true">
      <div className="console-shadow" />
      <div className="console-display">
        <span className="console-display__camera" />
        <DeviceScreen activeScene={activeScene} />
        <div className="console-display__controls">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="console-neck">
        <span />
      </div>
      <div className="console-deck">
        <span className="console-deck__slot" />
        <span className="console-deck__dial" />
        <span className="console-deck__keys">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </span>
      </div>
      <div className="console-foot">
        <span>FORM / FUNCTION</span>
        <i />
      </div>
    </div>
  );
}

export function PortfolioExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const headerHeight = window.innerWidth <= 820 ? 58 : 68;
    const bounds = root.getBoundingClientRect();
    const travel = Math.max(1, root.offsetHeight - window.innerHeight + headerHeight);
    const nextProgress = Math.min(1, Math.max(0, (-bounds.top + headerHeight) / travel));
    const nextScene = Math.min(sceneNames.length - 1, Math.floor(nextProgress * sceneNames.length));

    setProgress(nextProgress);
    setActiveScene(nextScene);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        updateProgress();
        frameRef.current = null;
      });
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [updateProgress]);

  function scrollToScene(index: number) {
    const root = rootRef.current;
    if (!root) return;

    const rootTop = window.scrollY + root.getBoundingClientRect().top;
    const travel = root.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: rootTop + (travel * index) / (sceneNames.length - 1),
      behavior: document.documentElement.classList.contains("no-motion") ? "auto" : "smooth",
    });
  }

  return (
    <>
      <section
        className={`scroll-lab scroll-lab--scene-${activeScene}`}
        id="top"
        ref={rootRef}
        style={{ "--lab-progress": progress } as CSSProperties}
        aria-label="Interactive portfolio"
      >
        <div className="lab-stage">
          <div className="lab-atmosphere" aria-hidden="true">
            {sceneNames.map((name, index) => (
              <span
                className={`lab-atmosphere__layer lab-atmosphere__layer--${index}${
                  activeScene === index ? " is-active" : ""
                }`}
                key={name}
              />
            ))}
            <span className="lab-sun" />
            <span className="lab-haze lab-haze--left" />
            <span className="lab-haze lab-haze--right" />
          </div>

          <p className="lab-index">
            <span>{String(activeScene + 1).padStart(2, "0")}</span>
            <i />
            <span>05</span>
          </p>

          <nav className="lab-rail" aria-label="Portfolio scenes">
            {sceneNames.map((name, index) => (
              <button
                className={activeScene === index ? "is-active" : ""}
                type="button"
                aria-label={`Go to ${name} scene`}
                aria-current={activeScene === index ? "step" : undefined}
                onClick={() => scrollToScene(index)}
                key={name}
              >
                <span>{name}</span>
                <i />
              </button>
            ))}
          </nav>

          <div className="lab-giant-type" aria-hidden="true">
            {["MAKE", "MOVE", "BUILD", "OPEN", "SCAN"].map((word, index) => (
              <span className={activeScene === index ? "is-active" : ""} key={word}>
                {word}
              </span>
            ))}
          </div>

          <PrototypeConsole activeScene={activeScene} />

          <div className="lab-props" aria-hidden="true">
            <div className="lab-note lab-note--one">
              <span>01</span>
              CAD IS A WAY
              <br />
              TO TEST AN IDEA
            </div>
            <div className="lab-note lab-note--two">
              <i />
              BUILT AROUND
              <br />
              REAL COMPONENTS
            </div>
            <div className="lab-tag">
              <span>R&amp;D</span>
              <small>objects with behavior</small>
            </div>
          </div>

          <div className="lab-copy">
            <article
              className={`lab-panel lab-panel--intro${activeScene === 0 ? " is-active" : ""}`}
              aria-hidden={activeScene !== 0}
              inert={activeScene !== 0}
            >
              <p className="lab-kicker">
                Daria Melnikova · 3D, CAD &amp; Product Prototyping
              </p>
              <h1>
                Physical ideas,
                <em>made visible.</em>
              </h1>
              <p className="lab-lead">
                I design compact physical products and turn ideas into CAD
                models, visual stories and working prototypes.
              </p>
              <div className="lab-actions">
                <button type="button" onClick={() => scrollToScene(1)}>
                  Enter the archive <span>↓</span>
                </button>
                <a href={cvUrl} target="_blank" rel="noreferrer">
                  View current CV ↗
                </a>
              </div>
            </article>

            {projects.map((project, index) => {
              const sceneIndex = index + 1;
              return (
                <article
                  className={`lab-panel lab-panel--project lab-panel--project-${sceneIndex}${
                    activeScene === sceneIndex ? " is-active" : ""
                  }`}
                  aria-hidden={activeScene !== sceneIndex}
                  inert={activeScene !== sceneIndex}
                  key={project.key}
                >
                  <p className="lab-kicker">
                    {project.number} / {project.category} / {project.year}
                  </p>
                  <h2>{project.shortTitle}</h2>
                  <p>{project.strapline}</p>
                  <ul aria-label="Tools">
                    {project.tools.slice(0, 4).map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                  <div className="lab-actions">
                    <Link href={`/work/${project.key}`}>
                      Open case study <span>↗</span>
                    </Link>
                    <LikeButton project={project.key} projectName={project.title} />
                  </div>
                </article>
              );
            })}
          </div>

          <p className="lab-scroll-cue" aria-hidden="true">
            <span />
            Scroll to transform
          </p>
        </div>

        <div className="scroll-lab__steps" aria-hidden="true">
          {sceneNames.map((name) => <span key={name} />)}
        </div>
      </section>

      <section className="archive-outro" aria-labelledby="archive-outro-title">
        <p>CAD · Product visualization · Embedded systems · Reconstruction</p>
        <h2 id="archive-outro-title">
          One portfolio.
          <em>Several ways to build.</em>
        </h2>
        <div>
          <Link href="/work">Browse every case ↗</Link>
          <a href="mailto:daha442242@gmail.com">Discuss a role ↗</a>
        </div>
      </section>
    </>
  );
}
