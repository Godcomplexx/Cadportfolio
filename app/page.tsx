import Link from "vinext/shims/link";
import { LikeButton } from "@/components/LikeButton";
import { MediaField } from "@/components/MediaField";
import { projects } from "@/lib/projects";

const capabilities = [
  {
    number: "01",
    title: "CAD & Enclosure Design",
    line: "Compact housings, assemblies and component-aware layouts.",
    tools: "SolidWorks · Plasticity · Blender",
  },
  {
    number: "02",
    title: "Product Visualization & Motion",
    line: "Materials, light and sequences that explain how a product works.",
    tools: "Blender · Lighting · Animation",
  },
  {
    number: "03",
    title: "Electronics Integration",
    line: "Boards, sensors, displays and physical prototypes in one system.",
    tools: "PCB · ESP32 · Sensors · Soldering",
  },
  {
    number: "04",
    title: "Mesh & Reconstruction",
    line: "Capture planning, cleanup, UVs and evidence-led comparison.",
    tools: "Photogrammetry · Retopology · UV",
  },
];

const process = [
  "Problem",
  "Research",
  "CAD / 3D",
  "Hardware",
  "Prototype",
  "Testing",
  "Result",
];

export default function Home() {
  const [smartmotion, modular, eeg, photogrammetry] = projects;

  return (
    <main id="main-content">
      <section className="scene hero-scene" id="top" aria-labelledby="hero-title">
        <div className="hero-background depth-0" data-depth="0" aria-hidden="true" />
        <div className="hero-glow depth-1" data-depth="1" aria-hidden="true" />
        <div className="hero-orbits depth-2" data-depth="2" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-object depth-3" data-depth="3" aria-hidden="true">
          <div className="hero-object__shell">
            <i />
            <i />
            <b>DM</b>
          </div>
        </div>
        <div className="hero-content depth-4" data-depth="4">
          <p className="eyebrow" data-reveal="text">
            Daria Melnikova · R&amp;D systems engineer
          </p>
          <h1 id="hero-title" data-reveal="text">
            3D, CAD <span>&amp; product</span>
            <em>prototyping.</em>
          </h1>
          <div className="hero-intro" data-reveal="text">
            <p>
              I design compact physical products and turn ideas into CAD models,
              visual stories and working prototypes.
            </p>
            <p className="tool-line">
              Blender · Plasticity · SolidWorks · PCB · Embedded systems
            </p>
            <div className="button-row">
              <Link className="button button--dark" href="#selected-work">
                View selected work <span aria-hidden="true">↓</span>
              </Link>
              <a
                className="button button--line"
                href="https://godcomplexx.github.io/portfolio/resume/daria_melnikova_resume_print.html"
                target="_blank"
                rel="noreferrer"
              >
                View current CV <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
        <div className="hero-fx depth-5" data-depth="5" aria-hidden="true">
          <span>FORM</span>
          <span>FUNCTION</span>
          <span>PROTOTYPE</span>
        </div>
      </section>

      <section
        className="scene selected-work"
        id="selected-work"
        aria-labelledby="selected-work-title"
      >
        <div className="section-wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="section-orbit depth-2" data-depth="2" aria-hidden="true" />
        <div className="section-content depth-4" data-depth="4">
          <header className="section-heading">
            <p className="eyebrow">Selected work · 2025—2026</p>
            <h2 id="selected-work-title" data-reveal="text">
              Four projects.
              <em>Four kinds of proof.</em>
            </h2>
            <p>
              Physical behavior, assembly logic, visual communication and
              reconstruction—shown as distinct case studies.
            </p>
          </header>

          <article className="project-feature project-feature--wide" data-reveal="block">
            <Link href={`/work/${smartmotion.key}`} className="project-feature__media">
              <MediaField project={smartmotion} />
            </Link>
            <div className="project-feature__copy">
              <p className="project-meta">
                <span>{smartmotion.number}</span>
                <span>{smartmotion.category}</span>
                <span>{smartmotion.year}</span>
                <span>{smartmotion.status}</span>
              </p>
              <h3>{smartmotion.shortTitle}</h3>
              <p>{smartmotion.strapline}</p>
              <div className="project-actions">
                <Link className="text-link" href={`/work/${smartmotion.key}`}>
                  View project ↗
                </Link>
                <LikeButton project={smartmotion.key} projectName={smartmotion.title} />
              </div>
            </div>
          </article>

          <div className="project-duet">
            {[modular, eeg].map((project, index) => (
              <article
                className={`project-feature project-feature--portrait project-feature--${index}`}
                data-reveal="block"
                key={project.key}
              >
                <Link href={`/work/${project.key}`} className="project-feature__media">
                  <MediaField project={project} compact />
                </Link>
                <div className="project-feature__copy">
                  <p className="project-meta">
                    <span>{project.number}</span>
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                    <span>{project.status}</span>
                  </p>
                  <h3>{project.shortTitle}</h3>
                  <p>{project.strapline}</p>
                  <Link className="text-link" href={`/work/${project.key}`}>
                    View project ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <article className="project-feature project-feature--teaser" data-reveal="block">
            <div className="project-feature__copy">
              <p className="project-meta">
                <span>{photogrammetry.number}</span>
                <span>{photogrammetry.category}</span>
                <span>{photogrammetry.year}</span>
                <span>{photogrammetry.status}</span>
              </p>
              <h3>{photogrammetry.shortTitle}</h3>
              <p>{photogrammetry.strapline}</p>
              <Link className="text-link" href={`/work/${photogrammetry.key}`}>
                View in-progress case ↗
              </Link>
            </div>
            <Link href={`/work/${photogrammetry.key}`} className="project-feature__media">
              <MediaField project={photogrammetry} compact />
            </Link>
          </article>

          <Link className="all-work-link" href="/work">
            <span>Explore all work</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="section-fx depth-5" data-depth="5" aria-hidden="true">
          WORK / WORK / WORK
        </div>
      </section>

      <section className="scene capabilities-section" aria-labelledby="capabilities-title">
        <div className="capabilities-wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="capabilities-mark depth-2" data-depth="2" aria-hidden="true">
          ×
        </div>
        <div className="section-content depth-4" data-depth="4">
          <header className="section-heading section-heading--compact">
            <p className="eyebrow">Capabilities</p>
            <h2 id="capabilities-title" data-reveal="text">
              At the intersection
              <em>of four disciplines.</em>
            </h2>
          </header>
          <div className="capability-list">
            {capabilities.map((capability) => (
              <article key={capability.number} data-reveal="block">
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.line}</p>
                <small>{capability.tools}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scene process-section" aria-labelledby="process-title">
        <div className="process-wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="process-circle depth-2" data-depth="2" aria-hidden="true" />
        <div className="section-content depth-4" data-depth="4">
          <div className="process-heading">
            <p className="eyebrow">A flexible product process</p>
            <h2 id="process-title" data-reveal="text">
              Enough structure
              <em>to show the work.</em>
            </h2>
            <p>
              Each case only shows stages that were actually completed. No
              decorative process theatre.
            </p>
          </div>
          <ol className="process-list">
            {process.map((step, index) => (
              <li key={step} data-reveal="block">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
                {index < process.length - 1 ? <i aria-hidden="true">→</i> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="scene about-preview" aria-labelledby="about-preview-title">
        <div className="about-wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="about-object depth-3" data-depth="3" aria-hidden="true">
          <span>R&amp;D</span>
        </div>
        <div className="about-content depth-4" data-depth="4">
          <p className="eyebrow">About Daria</p>
          <h2 id="about-preview-title" data-reveal="text">
            Engineering context,
            <em>product attention.</em>
          </h2>
          <p data-reveal="text">
            I work across R&amp;D systems, embedded hardware and visual product
            development. That background helps me design around real boards,
            sensors, displays, connectors and assembly constraints—while still
            caring about form, light and communication.
          </p>
          <Link className="button button--dark" href="/about">
            More about my process ↗
          </Link>
        </div>
        <div className="about-fx depth-5" data-depth="5" aria-hidden="true">
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
