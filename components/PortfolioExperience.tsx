"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HeroTurntable } from "@/components/HeroTurntable";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Scramble } from "@/components/Scramble";
import { WorkIndex } from "@/components/WorkIndex";
import {
  featuredProjects,
  practiceMetrics,
  projectIndex,
  researchProjects,
  toolGroups,
  visualStudies,
  type Project,
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

/* Hero callouts. Three, stacked down the left of the object with leader lines
   running toward it — four smaller ones read as noise rather than annotation. */
const heroCallouts = [
  { id: "01", label: "Enclosure" },
  { id: "02", label: "Interaction" },
  { id: "03", label: "Embedded system" },
] as const;

const disciplines = [
  {
    number: "01",
    title: "Product / Mechanical",
    text: "Enclosures, parts and assembly logic.",
    tags: "FORM / FIT / ASSEMBLY",
  },
  {
    number: "02",
    title: "Embedded Hardware",
    text: "Electronics, sensors and working behavior.",
    tags: "BOARD / SIGNAL / TEST",
  },
  {
    number: "03",
    title: "Visualization / Motion",
    text: "Materials, light and product stories.",
    tags: "LIGHT / MATERIAL / STORY",
  },
  {
    number: "04",
    title: "Applied Computation",
    text: "ML, computer vision and biomedical systems.",
    tags: "MODEL / VISION / SIGNAL",
  },
] as const;

const process = [
  { number: "01", title: "Model", output: "CAD + assembly" },
  { number: "02", title: "Integrate", output: "Working prototype" },
  { number: "03", title: "Prove", output: "Result + next step" },
] as const;

const projectColors = ["#a8ff35", "#60d9ff", "#ff6bdd", "#c3b8ff"] as const;

function firstSentence(text: string) {
  return `${text.split(". ")[0].replace(/\.$/, "")}.`;
}

function compactRole(text: string) {
  return text.replace(/^I\s+/, "").replace(/\.$/, "");
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

function ProjectSchematic({ project }: { project: Project }) {
  if (project.actualImage) {
    return (
      <div
        className={`project-visual project-visual--image ${
          project.supportingImage ? "project-visual--paired" : ""
        }`}
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

function ProjectProcessVideo({ project }: { project: Project }) {
  if (!project.processVideo) return null;

  const descriptionId = `project-video-description-${project.key}`;

  return (
    <figure
      className="project-video depth-3"
      data-depth="3"
      data-fixed-depth
      data-reveal="block"
    >
      <div className="project-video__rail" aria-hidden="true">
        <span>{project.processVideo.label}</span>
        <span>{project.processVideo.meta}</span>
      </div>
      <div className="project-video__frame">
        <video
          controls
          playsInline
          preload="metadata"
          poster={project.processVideo.poster}
          aria-label={`${project.title} process video`}
          aria-describedby={descriptionId}
        >
          <source src={project.processVideo.src} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
        <span className="project-video__scan" aria-hidden="true" />
        <span className="project-video__corner project-video__corner--a" aria-hidden="true" />
        <span className="project-video__corner project-video__corner--b" aria-hidden="true" />
      </div>
      <figcaption id={descriptionId}>{project.processVideo.description}</figcaption>
    </figure>
  );
}

function ProjectTile({ project, index }: { project: Project; index: number }) {
  const style = {
    "--project-index": index,
    "--project-accent": projectColors[index],
  } as StyleVariables;

  return (
    <article
      className={`project-tile project-tile--${project.key} ${index === 0 ? "project-tile--featured" : ""}`}
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
          {String(index + 1).padStart(2, "0")} / {String(featuredProjects.length).padStart(2, "0")} &nbsp; {project.year} &nbsp; {project.status}
        </p>
        <h3 id={`project-title-${project.key}`} data-reveal="text">
          {project.key === "smartmotion" ? <><span>Smart</span><br /><span>Motion</span></> : project.shortTitle}
        </h3>
        <p className="project-tile__strapline" data-reveal="line">
          {project.strapline}
        </p>
        {/* The overview carries the actual scope and the honest limits of the
            build. It was written in the data but never rendered, which left the
            case resting on a one-line strapline. */}
        <p className="project-tile__overview" data-reveal="line">
          {project.overview}
        </p>
        <dl className="project-tile__facts" data-reveal="block">
          <div>
            <dt>My role</dt>
            <dd>{compactRole(project.role[0])}</dd>
          </div>
          <div>
            <dt>Proof</dt>
            <dd>{firstSentence(project.result)}</dd>
          </div>
        </dl>

        {/* Hard specification. For a hardware role this is the most convincing
            content on the page — concrete parts and measured test counts. */}
        <dl className="project-tile__spec" data-reveal="block">
          {project.details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
        {/* How the thing was actually built. Reviewers hire for process as much
            as outcome, and these steps were sitting unused in the data. */}
        <ol className="project-tile__process" data-reveal="block">
          {project.development.map((step, stepIndex) => (
            <li key={step.title}>
              <span aria-hidden="true">{String(stepIndex + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

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
        <ProjectProcessVideo project={project} />
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
        {index === 0
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

function ResearchArchive() {
  return (
    <section className="research-section" id="research" aria-labelledby="research-title">
      <header className="research-section__head">
        <div>
          <p className="section-kicker" data-reveal="line">Research / computation</p>
          <h2 id="research-title" data-reveal="text">SYSTEMS BEYOND<br />THE OBJECT</h2>
        </div>
        <p data-reveal="line">
          Biomedical signal, imaging and computer-vision work shown as compact evidence cards —
          enough to understand the system, with source repositories for the full implementation.
        </p>
      </header>

      <div className="research-grid">
        {researchProjects.map((project) => (
          <article
            className="research-card"
            id={`research-${project.key}`}
            key={project.key}
            data-reveal="block"
          >
            <a href={project.href} target="_blank" rel="noreferrer">
              <div className="research-card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image.src}
                  alt={project.image.alt}
                  width={project.image.width}
                  height={project.image.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="research-card__body">
                <p className="research-card__index">{project.number} / RESEARCH CODE</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="research-card__metric">
                  <strong>{project.metric}</strong>
                  <span>{project.metricLabel}</span>
                </div>
                <ul aria-label={`${project.title} tools`}>
                  {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
                <span className="research-card__link">Open repository ↗</span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function VisualLab() {
  return (
    <section className="visual-lab" id="visual-lab" aria-labelledby="visual-lab-title">
      <header className="visual-lab__head">
        <div>
          <p className="section-kicker" data-reveal="line">Visual lab / selected studies</p>
          <h2 id="visual-lab-title" data-reveal="text">FORM, LIGHT<br />AND MOTION</h2>
        </div>
        <p data-reveal="line">
          A separate visual track for Blender, hard-surface form, materials and product motion.
          These studies support the engineering work without pretending to be validated products.
        </p>
      </header>

      <div className="visual-lab__grid">
        {visualStudies.map((study) => {
          const descriptionId = `visual-lab-description-${study.key}`;
          return (
            <article
              className={`visual-study visual-study--${study.layout}`}
              id={`visual-lab-${study.key}`}
              key={study.key}
              data-reveal="block"
            >
              <div className="visual-study__media">
                {study.video ? (
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster={study.video.poster}
                    aria-label={`${study.title} concept video`}
                    aria-describedby={descriptionId}
                  >
                    <source src={study.video.src} type="video/mp4" />
                    Your browser does not support embedded video.
                  </video>
                ) : study.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={study.image.src}
                    alt={study.image.alt}
                    width={study.image.width}
                    height={study.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
              <div className="visual-study__copy">
                <p>{study.number} / {study.discipline}</p>
                <h3>{study.title}</h3>
                <small id={descriptionId}>{study.description}</small>
              </div>
            </article>
          );
        })}
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
          DD<span>.studio</span>
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

        {/* Technical callouts. Decorative annotation of the object rather than
            content, so the whole layer is hidden from assistive tech — the same
            themes are stated as text in the card. */}
        <ul className="system-hero__callouts depth-4" data-depth="4" aria-hidden="true">
          {heroCallouts.map(({ id, label }) => (
            <li key={id} className="system-hero__callout">
              <span><b>{id}</b> {label}</span>
              <i />
            </li>
          ))}
        </ul>

        {/* Name block only. The supporting line and the role card were pulled
            out: three separate statements across the top read as three headers
            and flattened the hierarchy. */}
        <header className="system-hero__intro depth-4" data-depth="4">
          <p>R&amp;D, Product<br />Systems &amp; CAD</p>
          <h1 id="hero-title">Daria<br />Melnikova</h1>
        </header>

        {/* Sits beside the object rather than in the top rail, so the right of
            the composition carries meaning instead of a second masthead. */}
        <dl className="system-hero__card depth-4" data-depth="4">
          <dt>Designing /</dt>
          <dd>Physical systems</dd>
          <dd>Embedded behavior</dd>
          <dd>Internal architecture</dd>
          <dd>Working prototypes</dd>
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
            <p className="section-kicker" data-reveal="line">Selected systems / 2025—2026</p>
            <h2 id="work-title" data-reveal="text">SELECTED<br />WORK</h2>
            <p data-reveal="line">Four selected systems — embedded prototypes, native SolidWorks evidence and an applied computer-vision device.</p>
          </div>
          <p className="work-intro__note depth-5" data-depth="5" aria-hidden="true">FORM / SIGNAL / PROOF</p>
        </header>

        <div className="section-transition" aria-hidden="true" />
        <div className="project-gallery">
          {featuredProjects.map((project, index) => (
            <ProjectTile project={project} index={index} key={project.key} />
          ))}
        </div>
      </section>

      <div className="section-transition" aria-hidden="true" />
      <ResearchArchive />

      <div className="section-transition" aria-hidden="true" />
      <VisualLab />

      <div className="section-transition" aria-hidden="true" />
      <section className="scene signal-section" aria-labelledby="signal-title">
        <div className="signal-section__void depth-0" data-depth="0" aria-hidden="true" />
        <div className="signal-section__glow depth-1" data-depth="1" aria-hidden="true" />
        <div className="signal-section__rays depth-2" data-depth="2" data-signal-rays aria-hidden="true" />
        <h2 className="signal-section__title depth-4" data-depth="4" id="signal-title" data-reveal="text">
          BUILD<br />WITH<br />PURPOSE
        </h2>
        <div className="signal-section__principles depth-4" data-depth="4">
          <p>Clarity first.<br />Delight second.</p>
          <p>Independent by<br />design &amp; engineering.</p>
          <p>Small loops.<br />Long arcs.</p>
        </div>
        <div className="signal-section__reticle depth-5" data-depth="5" aria-hidden="true"><span /><i /></div>
      </section>

      <div className="section-transition" aria-hidden="true" />
      <section className="scene about-section" id="about" aria-labelledby="about-title">
        <div className="about-section__field depth-0" data-depth="0" aria-hidden="true" />
        <div className="about-section__halo depth-1" data-depth="1" aria-hidden="true" />
        <p className="about-section__ghost depth-2" data-depth="2" aria-hidden="true">ONE PRACTICE</p>

        <div className="about-section__copy depth-4" data-depth="4">
          <p className="section-kicker" data-reveal="line">Connected disciplines</p>
          <h2 id="about-title" data-reveal="text">
            FORM + SIGNAL<br />IN ONE PRACTICE
          </h2>
          <p data-reveal="line">
            I work across CAD, electronics, visual communication and applied AI — connecting
            the visible object to the system that makes it useful.
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
        <div className="contact-section__orb depth-1" data-depth="1" aria-hidden="true" />
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
