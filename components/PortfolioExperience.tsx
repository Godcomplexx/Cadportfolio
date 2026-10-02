"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HeroTurntable } from "@/components/HeroTurntable";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Scramble } from "@/components/Scramble";
import { WorkIndex } from "@/components/WorkIndex";
import {
  featuredProjects,
  practiceMetrics,
  projectDrafts,
  projectIndex,
  projectTracks,
  toolGroups,
  visualReels,
  type Project,
  type ProjectDraft,
  type VisualReel,
} from "@/lib/projects";

const cvUrl =
  "https://godcomplexx.github.io/portfolio/resume/daria_melnikova_resume_print.html";

/**
 * Loading mark in the bottom-right HUD.
 * Point this at a looping video in /public (e.g. "/media/hud-loop.mp4") and it
 * replaces the wireframe globe. Leave empty to keep the globe.
 */
const hudMedia = "";

const navigation = [
  { id: "top", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof navigation)[number]["id"];
type StyleVariables = CSSProperties & Record<`--${string}`, string | number>;

const disciplines = [
  {
    number: "01",
    title: "Parametric Modeling",
    text: "Editable parts, features and design intent.",
    tags: "SKETCH / FEATURE / FORM",
  },
  {
    number: "02",
    title: "Assembly Design",
    text: "Mates, constraints and component relationships.",
    tags: "MATE / FIT / ASSEMBLY",
  },
  {
    number: "03",
    title: "Technical Drawings",
    text: "Orthographic views, sections and layouts.",
    tags: "VIEW / SECTION / SHEET",
  },
  {
    number: "04",
    title: "Product Visualization",
    text: "Materials, light and product presentation.",
    tags: "LIGHT / MATERIAL / RENDER",
  },
] as const;

const process = [
  { number: "01", title: "Model", output: "Editable CAD" },
  { number: "02", title: "Assemble", output: "Constraints + fit" },
  { number: "03", title: "Document", output: "Drawings + renders" },
] as const;

const projectColors: Partial<Record<Project["key"], string>> = {
  "concussion-screener": "#ffb86b",
  "copet-pilot": "#a8ff35",
  smartmotion: "#60d9ff",
  "modular-system": "#ff6bdd",
  "eeg-wearable": "#c3b8ff",
};

function compactRole(text: string) {
  return text.replace(/^I\s+/, "").replace(/\.$/, "");
}

/** Numbered chapter heading inside a case: 01 Problem, 02 Idea, … */
function CaseHeading({ number, children }: { number: string; children: string }) {
  return (
    <h5 className="case-heading" data-reveal="line">
      <span aria-hidden="true">{number}</span>
      {children}
    </h5>
  );
}

function HudGlitch({ text }: { text: string }) {
  return (
    <span
      className="hud-glitch hud-glitch--nested"
      data-glitch={text}
      data-depth="4"
      data-fixed-depth
    >
      {text}
      <span className="glitch-layer" aria-hidden="true" data-glitch-text={text} />
    </span>
  );
}

/** How long each carousel slide is held before advancing, in milliseconds. */
const CAROUSEL_INTERVAL_MS = 3200;

/**
 * Advancing-slide state shared by the project and visual-lab carousels: which
 * slide is showing, a manual jump, and the hold timer that pauses on hover.
 */
function useCarousel(length: number) {
  const [index, setIndex] = useState(0);
  // Paused while the visitor is interacting, so a slide cannot slip away from
  // under the cursor mid-read.
  const [paused, setPaused] = useState(false);

  const go = (next: number) => setIndex((next + length) % length);

  useEffect(() => {
    if (paused || length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(
      () => setIndex((value) => (value + 1) % length),
      CAROUSEL_INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
    // `index` is a dependency so the hold restarts after a manual jump.
  }, [index, paused, length]);

  // Bound to the frame so hovering anywhere over it holds the current slide.
  const holdProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return { index, go, holdProps };
}

function ProjectCarousel({ project }: { project: Project }) {
  const slides = project.carousel ?? [];
  const { index, go, holdProps } = useCarousel(slides.length);

  if (!slides.length) return null;
  const active = slides[index];
  // The frame keeps one ratio for every slide: sizing it per-slide would make
  // the whole case reflow each time a portrait drawing follows a landscape
  // assembly. The widest slide wins, and narrower ones letterbox inside it.
  const frameRatio = slides.reduce((widest, slide) =>
    slide.width / slide.height > widest.width / widest.height ? slide : widest,
  );

  return (
    <div
      className="project-visual project-visual--image project-visual--carousel"
      style={
        {
          "--project-media-ratio": `${frameRatio.width} / ${frameRatio.height}`,
        } as StyleVariables
      }
      {...holdProps}
      aria-roledescription="carousel"
      aria-label={`${project.title} — ${slides.length} views`}
    >
      <div className="project-visual__image-cell">
        {slides.map((slide, slideIndex) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={slide.width}
            height={slide.height}
            /* Only the first frame blocks the case; the rest come in behind it. */
            loading={slideIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            className={
              slideIndex === index
                ? "project-carousel__slide project-carousel__slide--active"
                : "project-carousel__slide"
            }
            aria-hidden={slideIndex === index ? undefined : true}
          />
        ))}
        {active.label ? <span>{active.label}</span> : null}
      </div>

      <button
        type="button"
        className="project-carousel__arrow project-carousel__arrow--prev"
        onClick={() => go(index - 1)}
        aria-label="Previous view"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        className="project-carousel__arrow project-carousel__arrow--next"
        onClick={() => go(index + 1)}
        aria-label="Next view"
      >
        <span aria-hidden="true">›</span>
      </button>

      <span className="project-carousel__dots">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.src}
            type="button"
            className={
              dotIndex === index
                ? "project-carousel__dot project-carousel__dot--active"
                : "project-carousel__dot"
            }
            onClick={() => go(dotIndex)}
            aria-label={`View ${dotIndex + 1} of ${slides.length}`}
            aria-current={dotIndex === index ? "true" : undefined}
          />
        ))}
      </span>

      <span className="project-visual__scan" aria-hidden="true" />
      <span
        className="project-border-motion depth-5"
        data-reveal="border"
        data-depth="5"
        data-fixed-depth
        aria-hidden="true"
      />
      <span className="project-visual__corner project-visual__corner--a" aria-hidden="true" />
      <span className="project-visual__corner project-visual__corner--b" aria-hidden="true" />
    </div>
  );
}

function ProjectSchematic({ project }: { project: Project }) {
  if (project.carousel?.length) {
    return <ProjectCarousel project={project} />;
  }

  if (project.actualImage) {
    const mediaStyle = project.supportingImage
      ? undefined
      : ({
          "--project-media-ratio": `${project.actualImage.width} / ${project.actualImage.height}`,
        } as StyleVariables);

    return (
      <div
        className={`project-visual project-visual--image ${
          project.supportingImage ? "project-visual--paired" : ""
        }`}
        style={mediaStyle}
      >
        <div className="project-visual__image-cell">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.actualImage.src}
            alt={project.actualImage.alt}
            width={project.actualImage.width}
            height={project.actualImage.height}
            loading="lazy"
            decoding="async"
          />
          {project.actualImage.label ? <span>{project.actualImage.label}</span> : null}
        </div>
        {project.supportingImage ? (
          <div className="project-visual__image-cell project-visual__image-cell--supporting">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.supportingImage.src}
              alt={project.supportingImage.alt}
              width={project.supportingImage.width}
              height={project.supportingImage.height}
              loading="lazy"
              decoding="async"
            />
            {project.supportingImage.label ? <span>{project.supportingImage.label}</span> : null}
          </div>
        ) : null}
        <span className="project-visual__scan" aria-hidden="true" />
        <span
          className="project-border-motion depth-5"
          data-reveal="border"
          data-depth="5"
          data-fixed-depth
          aria-hidden="true"
        />
        <span className="project-visual__corner project-visual__corner--a" aria-hidden="true" />
        <span className="project-visual__corner project-visual__corner--b" aria-hidden="true" />
      </div>
    );
  }

  if (project.processVideo) {
    return (
      <div
        className="project-visual project-visual--video"
        style={{ "--project-media-ratio": "832 / 1152" } as StyleVariables}
      >
        <video
          controls
          playsInline
          preload="none"
          poster={project.processVideo.poster}
          aria-label={`${project.title} concept video`}
        >
          <source src={project.processVideo.src} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
        <span className="project-visual__scan" aria-hidden="true" />
        <span
          className="project-border-motion depth-5"
          data-reveal="border"
          data-depth="5"
          data-fixed-depth
          aria-hidden="true"
        />
        <span className="project-visual__corner project-visual__corner--a" aria-hidden="true" />
        <span className="project-visual__corner project-visual__corner--b" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={`project-visual project-visual--schematic project-visual--${project.key}`}
      role="img"
      aria-label={`${project.title} technical concept diagram`}
    >
      <div className="schematic-axis schematic-axis--x" aria-hidden="true">X</div>
      <div className="schematic-axis schematic-axis--y" aria-hidden="true">Y</div>
      <div className="schematic-object" aria-hidden="true">
        <span className="schematic-part schematic-part--one" />
        <span className="schematic-part schematic-part--two" />
        <span className="schematic-part schematic-part--three" />
        <span className="schematic-part schematic-part--four" />
        <i className="schematic-orbit schematic-orbit--one" />
        <i className="schematic-orbit schematic-orbit--two" />
      </div>
      <ol className="schematic-callouts" aria-hidden="true">
        {project.details.slice(0, 4).map((detail, index) => (
          <li key={detail.label} className={`schematic-callout schematic-callout--${index + 1}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <small>{detail.label}</small>
              <strong>{detail.value}</strong>
            </div>
          </li>
        ))}
      </ol>
      <span
        className="project-border-motion depth-5"
        data-reveal="border"
        data-depth="5"
        data-fixed-depth
        aria-hidden="true"
      />
    </div>
  );
}

function ProjectTile({
  project,
  index,
  featured,
}: {
  project: Project;
  index: number;
  featured: boolean;
}) {
  const style = {
    "--project-index": index,
    "--project-accent": projectColors[project.key] ?? "#c3b8ff",
  } as StyleVariables;

  return (
    <article
      className={`project-tile project-tile--${project.key} ${featured ? "project-tile--featured" : ""}`}
      id={`project-${project.key}`}
      aria-labelledby={`project-title-${project.key}`}
      style={style}
      data-project-tile
    >
      <div className="project-tile__field depth-0" data-depth="0" aria-hidden="true" />
      <div className="project-tile__halo depth-1" data-depth="1" aria-hidden="true" />

      <figure className="project-tile__visual depth-3" data-depth="3">
        <div className="project-tile__rail" aria-hidden="true">
          <span>DM / {project.number}</span>
          <i />
          <span>{project.category}</span>
        </div>
        <ProjectSchematic project={project} />
        <figcaption>
          <span>{project.visualLabel}</span>
          <span>{project.visualRatio}</span>
        </figcaption>
      </figure>

      <div className="project-tile__copy depth-4" data-depth="4">
        <p className="project-tile__meta" data-reveal="line">
          {project.number} &nbsp; {project.year} &nbsp; {project.status}
        </p>
        <h4 className="project-tile__title" id={`project-title-${project.key}`} data-reveal="text">
          {project.key === "smartmotion" ? <><span>Smart</span><br /><span>Motion</span></> : project.shortTitle}
        </h4>
        <p className="project-tile__strapline" data-reveal="line">
          {project.strapline}
        </p>

        {/* The case reads as a maker story: what was wrong, what I decided to
            build, how I built it, what works now and what it taught me. */}
        <section className="case-chapter">
          <CaseHeading number="01">The problem</CaseHeading>
          <p className="case-chapter__lead" data-reveal="line">{project.problem}</p>
        </section>

        <section className="case-chapter">
          <CaseHeading number="02">The idea</CaseHeading>
          <p className="case-chapter__lead" data-reveal="line">{project.solution}</p>
          {/* Scope and honest limits, so the idea never overclaims. */}
          <p className="project-tile__overview" data-reveal="line">
            {project.overview}
          </p>
          <dl className="project-tile__facts" data-reveal="block">
            <div>
              <dt>My role</dt>
              <dd>
                <ul>
                  {project.role.map((item) => <li key={item}>{compactRole(item)}</li>)}
                </ul>
              </dd>
            </div>
          </dl>
        </section>

        <section className="case-chapter">
          <CaseHeading number="03">How I built it</CaseHeading>
          <ol className="project-tile__process" data-reveal="block">
            {project.development.map((step, stepIndex) => (
              <li key={step.title}>
                <span aria-hidden="true">{String(stepIndex + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                  {step.image ? (
                    <figure className="project-tile__step-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.image.src}
                        alt={step.image.alt}
                        width={step.image.width}
                        height={step.image.height}
                        loading="lazy"
                        decoding="async"
                      />
                      {step.image.label ? <figcaption>{step.image.label}</figcaption> : null}
                    </figure>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="case-chapter">
          <CaseHeading number="04">The result</CaseHeading>
          <p className="case-chapter__lead" data-reveal="line">{project.result}</p>
          {/* Hard specification: concrete parts and measured numbers. */}
          <dl className="project-tile__spec" data-reveal="block">
            {project.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
          <div className="project-tile__evidence" data-reveal="block">
            <div>
              <span>Verified</span>
              <ul>
                {project.evidence.verified.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <span>Next proof</span>
              <ul>
                {project.evidence.next.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="case-chapter">
          <CaseHeading number="05">What I learned</CaseHeading>
          <ul className="case-learned" data-reveal="block">
            {project.learned.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="case-next" data-reveal="line">
            <span>Next →</span> {project.nextStep}
          </p>
        </section>

        <footer className="project-tile__footer">
          {/* Full stack, not the first three: these are the exact keywords a
              technical reviewer scans for. */}
          <ul aria-label={`${project.title} tools`}>
            {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
          </ul>
          {project.source ? (
            <a className="glitch-trigger" href={project.source.href} target="_blank" rel="noreferrer">
              <HudGlitch text="Source" /> <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <a className="glitch-trigger" href="#contact">
              <HudGlitch text="Ask about it" /> <span aria-hidden="true">↘</span>
            </a>
          )}
        </footer>
      </div>

      <span className="project-tile__label depth-5" data-depth="5" aria-hidden="true">
        {featured
          ? "FEATURED SYSTEM"
          : project.status === "Documented study"
            ? "NATIVE CAD STUDY"
            : project.status === "Functional prototype"
              ? "FUNCTIONAL SYSTEM"
              : project.status === "Concept"
                ? "CONCEPT STUDY"
                : "WORKING PROTOTYPE"}
      </span>
    </article>
  );
}

/**
 * A real project whose images and full write-up are still being prepared. The
 * placeholder states what the missing picture will show, so the gap reads as
 * work in progress rather than an empty frame.
 */
function DraftCard({ draft }: { draft: ProjectDraft }) {
  return (
    <article
      className="draft-card"
      id={`draft-${draft.key}`}
      aria-labelledby={`draft-title-${draft.key}`}
      data-reveal="block"
    >
      <div className="draft-card__media">
        {draft.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={draft.image.src}
            alt={draft.image.alt}
            width={draft.image.width}
            height={draft.image.height}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="draft-card__placeholder" role="img" aria-label={`Image in progress: ${draft.imageNote}`}>
            <span>Image in progress</span>
            <small>{draft.imageNote}</small>
          </div>
        )}
      </div>
      <div className="draft-card__body">
        <p className="draft-card__meta">
          {draft.number} &nbsp; {draft.year} &nbsp; {draft.status}
        </p>
        <h4 id={`draft-title-${draft.key}`}>{draft.title}</h4>
        <dl>
          <div>
            <dt>Problem</dt>
            <dd>{draft.problem}</dd>
          </div>
          <div>
            <dt>Idea</dt>
            <dd>{draft.solution}</dd>
          </div>
        </dl>
        <footer>
          <ul aria-label={`${draft.title} tools`}>
            {draft.tools.map((tool) => <li key={tool}>{tool}</li>)}
          </ul>
          {draft.source ? (
            <a href={draft.source.href} target="_blank" rel="noreferrer">
              {draft.source.label} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

function VisualReelPanel({ reel }: { reel: VisualReel }) {
  const { studies } = reel;
  const { index, go, holdProps } = useCarousel(studies.length);

  if (!studies.length) return null;
  const active = studies[index];

  return (
    <article
      className="visual-reel"
      id={`visual-lab-${active.key}`}
      data-reveal="block"
      {...holdProps}
      aria-roledescription="carousel"
      aria-label={`${reel.label} — ${studies.length} studies`}
    >
      <div className="visual-reel__frame">
        <div className="visual-reel__media">
          {studies.map((study, studyIndex) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={study.key}
              src={study.image.src}
              alt={study.image.alt}
              width={study.image.width}
              height={study.image.height}
              /* Only the opening frame of each reel is worth fetching up front. */
              loading={studyIndex === 0 ? "eager" : "lazy"}
              decoding="async"
              className={
                studyIndex === index
                  ? "visual-reel__slide visual-reel__slide--active"
                  : "visual-reel__slide"
              }
              aria-hidden={studyIndex === index ? undefined : true}
            />
          ))}

          {studies.length > 1 ? (
            <>
              <button
                type="button"
                className="project-carousel__arrow project-carousel__arrow--prev"
                onClick={() => go(index - 1)}
                aria-label="Previous study"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                className="project-carousel__arrow project-carousel__arrow--next"
                onClick={() => go(index + 1)}
                aria-label="Next study"
              >
                <span aria-hidden="true">›</span>
              </button>

              <span className="project-carousel__dots">
                {studies.map((study, dotIndex) => (
                  <button
                    key={study.key}
                    type="button"
                    className={
                      dotIndex === index
                        ? "project-carousel__dot project-carousel__dot--active"
                        : "project-carousel__dot"
                    }
                    onClick={() => go(dotIndex)}
                    aria-label={`Study ${dotIndex + 1} of ${studies.length}`}
                    aria-current={dotIndex === index ? "true" : undefined}
                  />
                ))}
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* The copy swaps with the slide, so the caption always matches the
          image on screen. */}
      <div className="visual-study__copy">
        <p>{active.number} / {active.discipline}</p>
        <h3>{active.title}</h3>
        <small>{active.description}</small>
      </div>
    </article>
  );
}

function VisualLab() {
  return (
    <section className="visual-lab" id="visual-lab" aria-labelledby="visual-lab-title">
      <header className="visual-lab__head">
        <div>
          <p className="section-kicker" data-reveal="line">Visual lab / selected studies</p>
          <h2 id="visual-lab-title" data-reveal="text">FORM, LIGHT<br />AND MATERIAL</h2>
        </div>
        <p data-reveal="line">
          A separate visual track for Blender, hard-surface form, materials and product imagery.
          These studies support the engineering work without pretending to be validated products.
        </p>
      </header>

      <div className="visual-lab__reels">
        {visualReels.map((reel) => (
          <VisualReelPanel key={reel.key} reel={reel} />
        ))}
      </div>
    </section>
  );
}

export function PortfolioExperience() {
  const [activeSection, setActiveSection] = useState<SectionId>("top");
  const [isPastHero, setIsPastHero] = useState(false);
  const [viewportLabel, setViewportLabel] = useState("0000 X 0000");
  const [clock, setClock] = useState("--:--");
  const pointerRef = useRef<HTMLSpanElement>(null);

  // Cursor read-out in the HUD, updated straight from pointer moves.
  const [hasPointer, setHasPointer] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      const flag = window.setTimeout(() => setHasPointer(false), 0);
      return () => window.clearTimeout(flag);
    }
    let frame = 0;
    let nextLabel = "0000 X 0000 Y";
    const writePointer = () => {
      frame = 0;
      if (pointerRef.current) pointerRef.current.textContent = nextLabel;
    };
    const onMove = (event: PointerEvent) => {
      nextLabel = `${String(Math.round(event.clientX)).padStart(4, "0")} X ${String(
        Math.round(event.clientY),
      ).padStart(4, "0")} Y`;
      if (!frame) frame = window.requestAnimationFrame(writePointer);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Live Moscow time, independent of the visitor's own timezone.
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setClock(format.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewportLabel(
        `${String(window.innerWidth).padStart(4, "0")} X ${String(window.innerHeight).padStart(4, "0")}`,
      );
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const scrollRoot = document.querySelector<HTMLElement>("[data-scroll-container]");
    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id as SectionId);
      },
      { root: scrollRoot, rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scrollRoot = document.querySelector<HTMLElement>("[data-scroll-container]");
    if (!scrollRoot) return;

    let pastHero = false;
    const updateInterfaceMode = () => {
      const next = scrollRoot.scrollTop > window.innerHeight * 0.72;
      if (next === pastHero) return;
      pastHero = next;
      setIsPastHero(next);
    };

    const initialFrame = window.requestAnimationFrame(updateInterfaceMode);
    scrollRoot.addEventListener("scroll", updateInterfaceMode, { passive: true });
    window.addEventListener("resize", updateInterfaceMode);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      scrollRoot.removeEventListener("scroll", updateInterfaceMode);
      window.removeEventListener("resize", updateInterfaceMode);
    };
  }, []);

  return (
    <div
      className={`system-portfolio ${isPastHero ? "system-portfolio--content" : ""}`}
    >
      <nav className="site-rail" aria-label="Primary navigation">
        <a className="site-rail__brand" href="#top" aria-label="Daria Melnikova, home">
          DM / PORTFOLIO
        </a>
        <MusicPlayer />
        {/* data-text feeds the CSS glitch layers; see .site-rail__links a. */}
        <div className="site-rail__links">
          {navigation.slice(1).map(({ id, label }) => (
            <a
              className="hud-glitch"
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
              key={id}
              data-glitch={label}
            >
              {label}
              {/* Empty on purpose: the copy is drawn from data-glitch in CSS,
                  so the label is never duplicated in the accessibility tree. */}
              <span
                className="glitch-layer"
                aria-hidden="true"
                data-glitch-text={label}
              />
            </a>
          ))}
          <a className="hud-glitch" href={cvUrl} target="_blank" rel="noreferrer" data-glitch="CV↗">
            CV↗
            <span className="glitch-layer" aria-hidden="true" data-glitch-text="CV↗" />
          </a>
        </div>
      </nav>

      <aside className="site-hud" aria-hidden="true">
        <span>GMT+3 RU {clock}</span>
        <span ref={pointerRef}>{hasPointer ? "0000 X 0000 Y" : viewportLabel}</span>
        {hudMedia ? (
          <video
            className="site-hud__media"
            src={hudMedia}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          /* Globe: latitude rings plus meridians that squash on a staggered
             cycle, so the sphere reads as rotating. */
          <i className="site-globe">
            <u />
            <b /><b /><b /><b />
          </i>
        )}
      </aside>

      <section className="scene system-hero" id="top" aria-labelledby="hero-title" aria-label="Introduction">
        <div className="system-hero__field depth-0" data-depth="0" aria-hidden="true" />
        <div className="system-hero__glow depth-1" data-depth="1" aria-hidden="true"><span /><span /></div>

        <div className="system-hero__model depth-3" data-depth="3">
          <HeroTurntable />
        </div>

        {/* Section marker. Replaces the old full-bleed ghost word: quiet, small
            and to the side, so the background states a fact instead of
            competing with the object for attention. */}
        <p className="system-hero__marker depth-2" data-depth="2" aria-hidden="true">
          01 / Current practice
        </p>

        {/* Compact identity block: name first, then the exact CAD practice line. */}
        <header className="system-hero__intro depth-4" data-depth="4">
          <h1 id="hero-title">Daria<br />Melnikova</h1>
          <p>CAD / Mechanical Design<br />SolidWorks · Assemblies · Drawings</p>
        </header>

        {/* Sits beside the object rather than in the top rail, so the right of
            the composition carries meaning instead of a second masthead. */}
        <dl className="system-hero__card depth-4" data-depth="4">
          <dt>CAD practice /</dt>
          <dd>Parametric parts</dd>
          <dd>Assembly logic</dd>
          <dd>Technical drawings</dd>
          <dd>Product visualization</dd>
        </dl>

        <p
          className="system-hero__manifesto depth-4"
          data-depth="4"
          data-hero-manifesto
          data-words
          data-reveal="words"
        >
          {/* Spec: hero lines cascade at 300 / 500 / 700ms. */}
          <Scramble text="I BUILD" delay={300} />
          <Scramble text="PHYSICAL IDEAS" delay={500} />
          <Scramble text="THAT WORK" delay={700} />
        </p>

        <a className="system-hero__scroll glitch-trigger depth-4" data-depth="4" href="#work">
          <HudGlitch text="Scroll to work" />
          <span aria-hidden="true">↓</span>
        </a>
        <div className="system-hero__cursor-mark depth-5" data-depth="5" aria-hidden="true" />
      </section>

      <div className="fog-bridge" aria-hidden="true" />

      <WorkIndex projects={projectIndex} />
      <div className="section-transition" aria-hidden="true" />

      <section className="work-section" id="featured-work" aria-labelledby="work-title">
        <header className="scene work-intro">
          <div className="work-intro__field depth-0" data-depth="0" aria-hidden="true" />
          <div className="work-intro__glow depth-1" data-depth="1" aria-hidden="true" />
          <p className="work-intro__index depth-2" data-depth="2" aria-hidden="true">
            01—{String(featuredProjects.length).padStart(2, "0")}
          </p>
          <div className="work-intro__copy depth-4" data-depth="4">
            <p className="section-kicker" data-reveal="line">Work / personal / ideas — 2025—2026</p>
            <h2 id="work-title" data-reveal="text">SELECTED<br />WORK</h2>
            <p data-reveal="line">
              Every case follows the same path: the problem, the idea, how I built it,
              what works now and what it taught me.
            </p>
          </div>
          <p className="work-intro__note depth-5" data-depth="5" aria-hidden="true">PROBLEM / PROCESS / PROOF</p>
        </header>

        <div className="section-transition" aria-hidden="true" />
        {projectTracks.map((track) => {
          const cases = featuredProjects.filter((project) => project.track === track.key);
          const drafts = projectDrafts.filter((draft) => draft.track === track.key);
          if (!cases.length && !drafts.length) return null;

          return (
            <section
              className="project-track"
              id={`track-${track.key}`}
              key={track.key}
              aria-labelledby={`track-title-${track.key}`}
            >
              <header className="project-track__head">
                <span className="project-track__code" aria-hidden="true">{track.code}</span>
                <div>
                  <p className="section-kicker" data-reveal="line">{track.kicker}</p>
                  <h3 id={`track-title-${track.key}`} data-reveal="text">{track.title}</h3>
                </div>
                <p data-reveal="line">{track.description}</p>
                <span className="t-label">
                  {String(cases.length + drafts.length).padStart(2, "0")} projects
                </span>
              </header>

              {cases.length ? (
                <div className="project-gallery">
                  {cases.map((project, index) => (
                    <ProjectTile
                      project={project}
                      index={index}
                      featured={project.key === featuredProjects[0]?.key}
                      key={project.key}
                    />
                  ))}
                </div>
              ) : null}

              {drafts.length ? (
                <div className="draft-grid">
                  <p className="draft-grid__label">
                    {cases.length ? "More in this track — write-up in progress" : "Write-ups in progress"}
                  </p>
                  {drafts.map((draft) => <DraftCard draft={draft} key={draft.key} />)}
                </div>
              ) : null}
            </section>
          );
        })}
      </section>

      <VisualLab />

      <div className="section-transition" aria-hidden="true" />
      <section className="scene about-section" id="about" aria-labelledby="about-title">
        <div className="about-section__field depth-0" data-depth="0" aria-hidden="true" />
        <div className="about-section__halo depth-1" data-depth="1" aria-hidden="true" />
        <p className="about-section__ghost depth-2" data-depth="2" aria-hidden="true">ONE PRACTICE</p>

        <div className="about-section__copy depth-4" data-depth="4">
          <p className="section-kicker" data-reveal="line">CAD practice</p>
          <h2 id="about-title" data-reveal="text">
            MODEL + ASSEMBLE<br />DOCUMENT + RENDER
          </h2>
          <p data-reveal="line">
            I work across SolidWorks modeling, assemblies, technical drawings and Blender
            visualization — from editable geometry to a clear product presentation.
          </p>
        </div>

        <dl className="about-metrics depth-4" data-depth="4" aria-label="Portfolio evidence">
          {practiceMetrics.map((metric) => (
            <div data-reveal="block" key={metric.label}>
              <dt>{metric.value}</dt>
              <dd>{metric.label}</dd>
            </div>
          ))}
        </dl>

        <div className="discipline-grid depth-3" data-depth="3">
          {disciplines.map((discipline) => (
            <article data-reveal="block" key={discipline.number}>
              <span>{discipline.number}</span>
              <p>{discipline.tags}</p>
              <h3>{discipline.title}</h3>
              <small>{discipline.text}</small>
            </article>
          ))}
        </div>

        <div className="tool-groups depth-4" data-depth="4">
          {toolGroups.map((group) => (
            <section data-reveal="block" key={group.title} aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.tools.map((tool) => <li key={tool}>{tool}</li>)}
              </ul>
            </section>
          ))}
        </div>

        <ol className="process-strip depth-4" data-depth="4" aria-label="Product process">
          {process.map((step) => (
            <li data-reveal="block" key={step.number}>
              <span>{step.number}</span>
              <strong>{step.title}</strong>
              <small>{step.output}</small>
            </li>
          ))}
        </ol>
      </section>

      <div className="section-transition" aria-hidden="true" />
      <section className="scene contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-section__field depth-0" data-depth="0" aria-hidden="true" />
        <div className="contact-section__dm depth-2" data-depth="2" aria-hidden="true">DM</div>
        <div className="contact-section__copy depth-4" data-depth="4">
          <p className="section-kicker" data-reveal="line">Open to roles and selected collaborations</p>
          {/* Spec: adjacent footer words resolve in opposing directions. */}
          <h2 id="contact-title">
            <Scramble text="LET'S MAKE" direction="ltr" />
            <br />
            <Scramble text="SOMETHING" direction="rtl" />
            <br />
            <Scramble text="TANGIBLE." direction="ltr" className="contact-accent" />
          </h2>
          <div className="contact-section__links">
            <a className="glitch-trigger" href="mailto:daha442242@gmail.com">
              <HudGlitch text="Email Daria" /> <span aria-hidden="true">↗</span>
            </a>
            <a className="glitch-trigger" href={cvUrl} target="_blank" rel="noreferrer">
              <HudGlitch text="View CV" /> <span aria-hidden="true">↗</span>
            </a>
            <a className="glitch-trigger" href="https://github.com/Godcomplexx" target="_blank" rel="noreferrer">
              <HudGlitch text="GitHub" /> <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <footer className="contact-section__footer depth-5" data-depth="5">
          <span>Daria Melnikova</span>
          <span>3D / CAD / Product Prototyping</span>
          <span>© 2026</span>
        </footer>
      </section>
    </div>
  );
}
