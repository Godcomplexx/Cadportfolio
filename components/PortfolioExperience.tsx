"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CadHeroScene } from "@/components/CadHeroScene";
import { projects, type Project } from "@/lib/projects";

const cvUrl =
  "https://godcomplexx.github.io/portfolio/resume/daria_melnikova_resume_print.html";

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
    title: "CAD & Mechanical",
    text: "Enclosures, parts and assembly logic.",
    tags: "FORM / FIT / ASSEMBLY",
  },
  {
    number: "02",
    title: "3D & Motion",
    text: "Materials, light and product stories.",
    tags: "LIGHT / MATERIAL / STORY",
  },
  {
    number: "03",
    title: "Hardware",
    text: "Electronics, sensors and working behavior.",
    tags: "BOARD / SIGNAL / TEST",
  },
  {
    number: "04",
    title: "Reconstruction",
    text: "Capture, cleanup, UVs and texture.",
    tags: "CAPTURE / MESH / TEXTURE",
  },
] as const;

const process = [
  {
    number: "01",
    title: "Model",
    text: "Shape the product around its real component stack.",
    output: "CAD + assembly",
  },
  {
    number: "02",
    title: "Integrate",
    text: "Connect form, electronics and interaction.",
    output: "Working prototype",
  },
  {
    number: "03",
    title: "Prove",
    text: "Test what works and show the evidence clearly.",
    output: "Result + next step",
  },
] as const;

const chapterColors = ["#8bbab2", "#5f8b89", "#a9c7c2", "#759e9b"] as const;

function firstSentence(text: string) {
  return `${text.split(". ")[0].replace(/\.$/, "")}.`;
}

function compactRole(text: string) {
  return text.replace(/^I\s+/, "").replace(/\.$/, "");
}

function ProjectSchematic({ project }: { project: Project }) {
  if (project.actualImage) {
    return (
      <div className="project-visual project-visual--image">
        {/* The source is already a compressed portfolio asset and must keep its exact crop. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.actualImage}
          alt={project.actualImageAlt ?? project.title}
          loading="lazy"
          decoding="async"
        />
        <span className="project-visual__scan" aria-hidden="true" />
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
      <div className="schematic-axis schematic-axis--x" aria-hidden="true">
        X
      </div>
      <div className="schematic-axis schematic-axis--y" aria-hidden="true">
        Y
      </div>
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
    </div>
  );
}

function ProjectChapter({ project, index }: { project: Project; index: number }) {
  const style = {
    "--project-index": index,
    "--chapter-accent": chapterColors[index],
  } as StyleVariables;

  return (
    <article
      className={`project-chapter project-chapter--${project.key}`}
      id={`project-${project.key}`}
      aria-labelledby={`project-title-${project.key}`}
      style={style}
    >
      <div className="project-chapter__grid depth-0" data-depth="0" aria-hidden="true" />
      <div className="project-chapter__glow depth-1" data-depth="1" aria-hidden="true" />
      <div className="project-chapter__number depth-2" data-depth="2" aria-hidden="true">
        {project.number}
      </div>

      <figure className="project-chapter__stage depth-3" data-depth="3">
        <div className="project-stage__rail" aria-hidden="true">
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

      <div className="project-chapter__copy depth-4" data-depth="4">
        <p className="project-chapter__meta" data-reveal="line">
          {project.number} / 04 &nbsp; {project.year} &nbsp; {project.status}
        </p>
        <h3 id={`project-title-${project.key}`} data-reveal="text">
          {project.shortTitle}
        </h3>
        <p className="project-chapter__strapline" data-reveal="line">
          {project.strapline}
        </p>

        <dl className="project-chapter__facts" data-reveal="block">
          <div>
            <dt>My role</dt>
            <dd>{compactRole(project.role[0])}</dd>
          </div>
          <div>
            <dt>Current proof</dt>
            <dd>{firstSentence(project.result)}</dd>
          </div>
        </dl>

        <ul className="project-chapter__tools" aria-label={`${project.title} tools`}>
          {project.tools.slice(0, 3).map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>

        {project.source ? (
          <a
            className="text-link"
            href={project.source.href}
            target="_blank"
            rel="noreferrer"
          >
            {project.source.label}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <a className="text-link" href="#contact">
            Ask about this case
            <span aria-hidden="true">↘</span>
          </a>
        )}
      </div>

      <div className="project-chapter__status depth-5" data-depth="5" aria-hidden="true">
        <span>CASE {project.number}</span>
        <i />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}

export function PortfolioExperience() {
  const [activeSection, setActiveSection] = useState<SectionId>("top");

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
      {
        root: scrollRoot,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ocean-portfolio">
      <nav className="site-rail" aria-label="Primary navigation">
        <a className="site-rail__brand" href="#top" aria-label="Daria Melnikova, home">
          <span>DM</span>
          <strong>Daria Melnikova</strong>
        </a>
        <div className="site-rail__links">
          {navigation.slice(1).map(({ id, label }) => (
            <a
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
              key={id}
            >
              {label}
            </a>
          ))}
          <a href={cvUrl} target="_blank" rel="noreferrer">
            CV <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <aside className="site-index" aria-hidden="true">
        <span>{navigation.findIndex(({ id }) => id === activeSection) + 1}</span>
        <i />
        <span>04</span>
      </aside>

      <section className="scene storm-hero" id="top" aria-labelledby="hero-title">
        <div className="storm-hero__grid depth-0" data-depth="0" aria-hidden="true" />
        <div className="storm-hero__weather depth-1" data-depth="1" aria-hidden="true">
          <span />
          <span />
          <i />
        </div>
        <div className="storm-hero__ghost depth-2" data-depth="2" aria-hidden="true">
          FORM
          <span>TO</span>
          PROOF
        </div>

        <div className="storm-hero__scene depth-3" data-depth="3">
          <CadHeroScene />
        </div>

        <header className="storm-hero__header depth-4" data-depth="4">
          <div>
            <p>3D, CAD &amp; Product Prototyping</p>
            <h1 id="hero-title">Daria Melnikova</h1>
          </div>
          <p>
            Compact physical products
            <br />
            from model to working behavior.
          </p>
          <p>
            CAD / 3D / Hardware
            <br />
            Moscow · Available worldwide
          </p>
        </header>

        <div className="storm-hero__footer depth-4" data-depth="4">
          <p>I turn ideas into CAD models, visual stories and working prototypes.</p>
          <a href="#work">
            Selected work
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="storm-hero__crosshair depth-5" data-depth="5" aria-hidden="true">
          <span />
          <i />
        </div>
      </section>

      <div className="fog-bridge" aria-hidden="true">
        <div className="fog-bridge__wash depth-0" data-depth="0" data-fog-layer="wash" />
        <div
          className="fog-bridge__cloud fog-bridge__cloud--back depth-1"
          data-depth="1"
          data-fog-layer="back"
        >
          <span />
          <span />
          <span />
        </div>
        <div
          className="fog-bridge__cloud fog-bridge__cloud--middle depth-2"
          data-depth="2"
          data-fog-layer="middle"
        >
          <span />
          <span />
        </div>
        <div
          className="fog-bridge__cloud fog-bridge__cloud--front depth-5"
          data-depth="5"
          data-fog-layer="front"
        >
          <span />
          <span />
        </div>
      </div>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <header className="scene work-intro">
          <div className="work-intro__grid depth-0" data-depth="0" aria-hidden="true" />
          <div className="work-intro__glow depth-1" data-depth="1" aria-hidden="true" />
          <p className="work-intro__index depth-2" data-depth="2" aria-hidden="true">
            01—04
          </p>
          <div className="work-intro__copy depth-4" data-depth="4">
            <p className="section-kicker" data-reveal="line">
              Selected systems / 2025—2026
            </p>
            <h2 id="work-title" data-reveal="text">
              Small objects.
              <span>Complete thinking.</span>
            </h2>
            <p data-reveal="line">
              Four cases across CAD, motion, electronics and reconstruction.
            </p>
          </div>
          <div className="work-intro__axis depth-5" data-depth="5" aria-hidden="true">
            <span>X</span>
            <i />
            <span>Y</span>
          </div>
        </header>

        <div className="project-stack">
          {projects.map((project, index) => (
            <ProjectChapter project={project} index={index} key={project.key} />
          ))}
        </div>
      </section>

      <section className="scene practice-section" id="about" aria-labelledby="practice-title">
        <div className="practice-section__grid depth-0" data-depth="0" aria-hidden="true" />
        <div className="practice-section__orb depth-1" data-depth="1" aria-hidden="true" />
        <p className="practice-section__ghost depth-2" data-depth="2" aria-hidden="true">
          ONE PRACTICE
        </p>

        <div className="practice-section__heading depth-4" data-depth="4">
          <p className="section-kicker" data-reveal="line">
            About / connected disciplines
          </p>
          <h2 id="practice-title" data-reveal="text">
            Form, signal
            <span>and proof.</span>
          </h2>
          <p data-reveal="line">
            I handle the visible object and the technical process behind it.
          </p>
        </div>

        <div className="practice-grid depth-3" data-depth="3">
          {disciplines.map((discipline) => (
            <article data-reveal="block" key={discipline.number}>
              <span>{discipline.number}</span>
              <p>{discipline.tags}</p>
              <h3>{discipline.title}</h3>
              <small>{discipline.text}</small>
              <i aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="practice-section__mark depth-5" data-depth="5" aria-hidden="true">
          DM / 04
        </div>
      </section>

      <section className="scene process-section" id="process" aria-labelledby="process-title">
        <div className="process-section__grid depth-0" data-depth="0" aria-hidden="true" />
        <div className="process-section__line depth-2" data-depth="2" aria-hidden="true" />

        <div className="process-section__heading depth-4" data-depth="4">
          <p className="section-kicker" data-reveal="line">
            A short product loop
          </p>
          <h2 id="process-title" data-reveal="text">
            Model. Integrate.
            <span>Prove.</span>
          </h2>
        </div>

        <ol className="process-list depth-4" data-depth="4">
          {process.map((step) => (
            <li data-reveal="block" key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              <small>{step.output}</small>
            </li>
          ))}
        </ol>

        <p className="process-section__stamp depth-5" data-depth="5" aria-hidden="true">
          IDEA → OBJECT → EVIDENCE
        </p>
      </section>

      <section className="scene contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-section__grid depth-0" data-depth="0" aria-hidden="true" />
        <div className="contact-section__circle depth-2" data-depth="2" aria-hidden="true">
          DM
        </div>

        <div className="contact-section__copy depth-4" data-depth="4">
          <p className="section-kicker" data-reveal="line">
            Open to roles and selected collaborations
          </p>
          <h2 id="contact-title" data-reveal="text">
            Let&apos;s make it
            <span>tangible.</span>
          </h2>
          <div className="contact-section__links">
            <a href="mailto:daha442242@gmail.com">
              Email Daria <span aria-hidden="true">↗</span>
            </a>
            <a href={cvUrl} target="_blank" rel="noreferrer">
              View CV <span aria-hidden="true">↗</span>
            </a>
            <a href="https://github.com/Godcomplexx" target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
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
