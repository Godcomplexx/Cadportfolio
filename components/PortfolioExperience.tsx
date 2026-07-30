"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { CadHeroScene } from "@/components/CadHeroScene";
import { LikeButton } from "@/components/LikeButton";
import { projects, type Project } from "@/lib/projects";

const cvUrl =
  "https://godcomplexx.github.io/portfolio/resume/daria_melnikova_resume_print.html";

const evidenceCards = [
  {
    number: "01",
    title: "CAD & mechanical design",
    text: "Concept enclosures, part families, assemblies and component-aware layouts.",
    className: "cad",
    caption: "FORM / INTERFACE / ASSEMBLY",
  },
  {
    number: "02",
    title: "3D visualization & motion",
    text: "Materials, lighting, renders and concise visual sequences that explain an object.",
    className: "motion",
    caption: "MATERIAL / LIGHT / STORY",
  },
  {
    number: "03",
    title: "Hardware prototyping",
    text: "Sensors, displays, ESP32 systems, soldering, firmware and physical testing.",
    className: "hardware",
    caption: "BOARD / SENSOR / BEHAVIOR",
  },
  {
    number: "04",
    title: "3D reconstruction",
    text: "Capture planning, mesh cleanup, retopology, UVs and texture preparation.",
    className: "scan",
    caption: "CAPTURE / MESH / TEXTURE",
  },
] as const;

const principles = [
  {
    number: "01",
    title: "Evidence before claims",
    text: "I separate concepts, prototypes and verified outcomes so the work stays credible.",
    mark: "PROOF",
  },
  {
    number: "02",
    title: "Form follows the stack",
    text: "Boards, sensors, connectors and assembly access shape the enclosure from the start.",
    mark: "FIT",
  },
  {
    number: "03",
    title: "Show the decision",
    text: "A useful case study explains what changed and why—not only the polished frame.",
    mark: "WHY",
  },
] as const;

const processSteps = [
  {
    number: "01",
    title: "Frame",
    text: "Define the behavior, constraints and proof the project needs.",
    output: "Brief + evidence plan",
  },
  {
    number: "02",
    title: "Model",
    text: "Build the form, interfaces and assembly logic in CAD or 3D.",
    output: "Parts + assembly",
  },
  {
    number: "03",
    title: "Integrate",
    text: "Place electronics, sensors, power and interaction around the real stack.",
    output: "Component layout",
  },
  {
    number: "04",
    title: "Prototype",
    text: "Print, assemble, solder and connect the physical and digital behavior.",
    output: "Working object",
  },
  {
    number: "05",
    title: "Test",
    text: "Record what works, expose what does not and define the next iteration.",
    output: "Result + next step",
  },
] as const;

const scanDots = Array.from({ length: 32 }, (_, index) => ({
  left: `${10 + ((index * 37) % 80)}%`,
  top: `${12 + ((index * 53) % 74)}%`,
  delay: `${(index % 8) * -0.22}s`,
}));

function EvidenceVisual({ type }: { type: (typeof evidenceCards)[number]["className"] }) {
  if (type === "cad") {
    return (
      <div className="evidence-visual evidence-visual--cad" aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
      </div>
    );
  }

  if (type === "motion") {
    return (
      <div className="evidence-visual evidence-visual--motion" aria-hidden="true">
        <span />
        <span />
        <i />
      </div>
    );
  }

  if (type === "hardware") {
    return (
      <div className="evidence-visual evidence-visual--hardware" aria-hidden="true">
        <span />
        <i />
        <i />
        <i />
        <b />
      </div>
    );
  }

  return (
    <div className="evidence-visual evidence-visual--scan" aria-hidden="true">
      {scanDots.slice(0, 18).map((dot, index) => (
        <i
          key={index}
          style={
            {
              "--dot-left": dot.left,
              "--dot-top": dot.top,
              "--dot-delay": dot.delay,
            } as CSSProperties
          }
        />
      ))}
      <span />
    </div>
  );
}

function ProjectDeviceVisual({ project }: { project: Project }) {
  if (project.key === "smartmotion") {
    return (
      <div className="project-device__visual project-device__visual--smartmotion">
        {/* The local 33 KB WebP is already compressed; preserving it avoids a
            deployment-time image optimisation dependency. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.actualImage}
          alt={project.actualImageAlt}
          width="1000"
          height="1000"
          loading="lazy"
        />
        <span aria-hidden="true">MOTION / OLED / BLE</span>
      </div>
    );
  }

  if (project.key === "modular-system") {
    return (
      <div
        className="project-device__visual project-device__visual--modular"
        aria-label="Schematic placeholder showing a modular exploded assembly"
        role="img"
      >
        <span className="module module--one" />
        <span className="module module--two" />
        <span className="module module--three" />
        <i />
        <small>SCHEMATIC / VERIFIED MEDIA PENDING</small>
      </div>
    );
  }

  if (project.key === "eeg-wearable") {
    return (
      <div
        className="project-device__visual project-device__visual--wearable"
        aria-label="Schematic placeholder showing an exploded wearable concept"
        role="img"
      >
        <span className="wearable-part wearable-part--left" />
        <span className="wearable-part wearable-part--board" />
        <span className="wearable-part wearable-part--right" />
        <i />
        <small>VISUAL DIRECTION / FINAL MOTION PENDING</small>
      </div>
    );
  }

  return (
    <div
      className="project-device__visual project-device__visual--scan"
      aria-label="Schematic placeholder showing an in-progress point-cloud reconstruction"
      role="img"
    >
      {scanDots.map((dot, index) => (
        <i
          key={index}
          style={
            {
              "--dot-left": dot.left,
              "--dot-top": dot.top,
              "--dot-delay": dot.delay,
            } as CSSProperties
          }
        />
      ))}
      <span>CAPTURE_04</span>
      <small>IN PROGRESS / NO RESULT CLAIMED</small>
    </div>
  );
}

function ProjectDevice({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className={`home-project home-project--${project.tone}`}
      style={{ "--project-index": index } as CSSProperties}
      aria-labelledby={`home-project-${project.key}`}
    >
      <div className="home-project__wash depth-0" data-depth="0" aria-hidden="true" />
      <div className="home-project__diagram depth-2" data-depth="2" aria-hidden="true">
        <span>{project.number}</span>
        <i />
        <small>{project.category}</small>
      </div>

      <div className="home-project__device depth-3" data-depth="3">
        <div className="project-device">
          <div className="project-device__top" aria-hidden="true">
            <span>DM / SELECTED WORK</span>
            <i />
          </div>
          <div className="project-device__screen">
            <ProjectDeviceVisual project={project} />
          </div>
          <div className="project-device__controls" aria-hidden="true">
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className="project-device__base" aria-hidden="true">
            <span>{project.status}</span>
            <i />
          </div>
        </div>
      </div>

      <div className="home-project__copy depth-4" data-depth="4">
        <p className="home-project__meta">
          {project.number} · {project.year} · {project.status}
        </p>
        <h3 id={`home-project-${project.key}`}>{project.shortTitle}</h3>
        <p>{project.strapline}</p>
        <ul aria-label={`${project.shortTitle} tools`}>
          {project.tools.slice(0, 4).map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <div className="home-project__actions">
          <a href="#contact">
            Discuss this project <span aria-hidden="true">↓</span>
          </a>
          <LikeButton project={project.key} projectName={project.title} />
        </div>
      </div>

      <div className="home-project__fx depth-5" data-depth="5" aria-hidden="true">
        <span>CASE / {project.number}</span>
        <i />
      </div>
    </article>
  );
}

export function PortfolioExperience() {
  const [showLoader, setShowLoader] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [activeSection, setActiveSection] =
    useState<"home" | "about" | "works" | "contact">("home");
  const loaderButtonRef = useRef<HTMLButtonElement>(null);

  const finishLoader = useCallback(() => {
    setLoaderProgress(100);
    setShowLoader(false);
    document.documentElement.classList.remove("intro-lock");
    window.sessionStorage.setItem("portfolio-intro-seen", "true");
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem("portfolio-intro-seen") === "true";

    if (reduced || seen) {
      queueMicrotask(finishLoader);
      return;
    }

    document.documentElement.classList.add("intro-lock");
    loaderButtonRef.current?.focus();

    let animationFrame = 0;
    let startTime = 0;
    const duration = 1100;

    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const next = Math.min(100, Math.round(((time - startTime) / duration) * 100));
      setLoaderProgress(next);

      if (next < 100) {
        animationFrame = window.requestAnimationFrame(tick);
      } else {
        window.setTimeout(finishLoader, 180);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.documentElement.classList.remove("intro-lock");
    };
  }, [finishLoader]);

  useEffect(() => {
    const updateActiveSection = () => {
      const about = document.getElementById("about");
      const selectedWork = document.getElementById("selected-work");
      const contact = document.getElementById("contact");

      if (!about || !selectedWork || !contact) return;

      const aboutStart = about.getBoundingClientRect().top + window.scrollY;
      const worksStart = selectedWork.getBoundingClientRect().top + window.scrollY;
      const contactStart = contact.getBoundingClientRect().top + window.scrollY;
      const currentPosition = window.scrollY + window.innerHeight * 0.32;

      if (currentPosition >= contactStart) {
        setActiveSection("contact");
      } else if (currentPosition >= aboutStart) {
        setActiveSection("about");
      } else if (currentPosition >= worksStart) {
        setActiveSection("works");
      } else {
        setActiveSection("home");
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <div className="portfolio-home" aria-busy={showLoader}>
      {showLoader ? (
        <div
          className="portfolio-loader"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-loader-title"
          style={{ "--load-progress": loaderProgress / 100 } as CSSProperties}
        >
          <div className="portfolio-loader__grid" aria-hidden="true" />
          <div className="portfolio-loader__content">
            <p>DM / PORTFOLIO ARCHIVE</p>
            <strong id="portfolio-loader-title">Calibrating physical ideas</strong>
            <div className="portfolio-loader__meter" aria-hidden="true">
              <span />
            </div>
            <div className="portfolio-loader__status" role="status" aria-live="polite">
              <span>{String(loaderProgress).padStart(3, "0")}%</span>
              <span>Interactive mode available</span>
            </div>
            <button ref={loaderButtonRef} type="button" onClick={finishLoader}>
              Skip intro
            </button>
          </div>
        </div>
      ) : null}

      <div inert={showLoader}>
        <nav className="cad-hero__nav depth-4" aria-label="Hero navigation">
          <a
            href="#top"
            aria-current={activeSection === "home" ? "location" : undefined}
            onClick={() => setActiveSection("home")}
          >
            Home
          </a>
          <a
            href="#selected-work"
            aria-current={activeSection === "works" ? "location" : undefined}
            onClick={() => setActiveSection("works")}
          >
            Works
          </a>
          <a
            href="#about"
            aria-current={activeSection === "about" ? "location" : undefined}
            onClick={() => setActiveSection("about")}
          >
            About me
          </a>
          <a
            href="#contact"
            aria-current={activeSection === "contact" ? "location" : undefined}
            onClick={() => setActiveSection("contact")}
          >
            Contact
          </a>
          <a href={cvUrl} target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>

        <section
          className="scene home-hero cad-hero"
          id="top"
          aria-labelledby="home-title"
        >
          <div
            className="cad-hero__background depth-0"
            data-depth="0"
            aria-hidden="true"
          >
            <p>CAD · PRODUCT · PROTOTYPING</p>
          </div>

          <div
            className="cad-hero__atmosphere depth-1"
            data-depth="1"
            aria-hidden="true"
          >
            <span />
            <span />
            <i />
          </div>

          <div className="cad-hero__scene depth-3" data-depth="3">
            <CadHeroScene />
          </div>

          <div className="cad-hero__intro depth-4" data-depth="4">
            <p>Hi, I&apos;m</p>
            <h1 id="home-title">Daria</h1>
            <p>
              A 3D, CAD &amp; product prototyping designer
              <br />
              turning compact ideas into working objects.
            </p>
          </div>

          <p className="cad-hero__badge depth-4">
            <span aria-hidden="true" />
            Available for work
          </p>

          <div
            className="cad-hero__foreground depth-5"
            data-depth="5"
            aria-hidden="true"
          >
            <span />
            <span />
            <i />
          </div>
        </section>

        <div className="home-fog-transition" aria-hidden="true">
          <div
            className="home-fog-transition__wash depth-0"
            data-depth="0"
            data-fog-layer="wash"
          />
          <div
            className="home-fog-transition__clouds home-fog-transition__clouds--back depth-1"
            data-depth="1"
            data-fog-layer="back"
          >
            <span />
            <span />
            <span />
          </div>
          <div
            className="home-fog-transition__clouds home-fog-transition__clouds--middle depth-2"
            data-depth="2"
            data-fog-layer="middle"
          >
            <span />
            <span />
            <span />
          </div>
          <div
            className="home-fog-transition__clouds home-fog-transition__clouds--front depth-5"
            data-depth="5"
            data-fog-layer="front"
          >
            <span />
            <span />
          </div>
        </div>

        <section
          className="home-work"
          id="selected-work"
          aria-labelledby="selected-work-title"
        >
          <header className="home-work__header">
            <p className="home-section-kicker">Selected work / proof in context</p>
            <h2 id="selected-work-title">
              Four cases.
              <em>Four kinds of evidence.</em>
            </h2>
            <p>
              Each project is labeled by its real status—from working prototype
              to in-progress reconstruction.
            </p>
            <a href="#contact">Discuss a project <span>↓</span></a>
          </header>

          <div className="home-work__stack">
            {projects.map((project, index) => (
              <ProjectDevice project={project} index={index} key={project.key} />
            ))}
          </div>
        </section>

        <section className="scene home-about" id="about" aria-labelledby="home-about-title">
          <div className="home-about__wash depth-0" data-depth="0" aria-hidden="true" />
          <div className="home-about__stamp depth-2" data-depth="2" aria-hidden="true">
            <span>DM</span>
            <small>FORM × LOGIC</small>
          </div>

          <div className="home-about__cards depth-3" data-depth="3">
            {evidenceCards.map((card, index) => (
              <article
                className={`evidence-card evidence-card--${card.className} evidence-card--${index + 1}`}
                key={card.title}
                data-reveal="block"
              >
                <div className="evidence-card__frame">
                  <EvidenceVisual type={card.className} />
                </div>
                <p>
                  <span>{card.number}</span>
                  {card.caption}
                </p>
                <h3>{card.title}</h3>
                <small>{card.text}</small>
              </article>
            ))}
          </div>

          <div className="home-about__copy depth-4" data-depth="4">
            <p className="home-section-kicker">About / one connected practice</p>
            <h2 id="home-about-title" data-reveal="text">
              Not only a model.
              <em>Not only a render.</em>
            </h2>
            <p>
              My work sits where enclosure geometry, visual communication and
              electronics meet. I use each discipline to make the next one more
              believable—and every case states exactly what I designed, built or
              tested.
            </p>
            <a href="#contact">Get in touch <span>↓</span></a>
          </div>

          <div className="home-about__fx depth-5" data-depth="5" aria-hidden="true">
            <span>01—04</span>
            <i />
          </div>
        </section>

        <div className="home-marquee" aria-label="Core disciplines">
          <div className="home-marquee__track" aria-hidden="true">
            <span>CAD &amp; MECHANICAL DESIGN</span>
            <i />
            <span>3D VISUALIZATION &amp; MOTION</span>
            <i />
            <span>HARDWARE PROTOTYPING</span>
            <i />
            <span>3D RECONSTRUCTION</span>
            <i />
            <span>CAD &amp; MECHANICAL DESIGN</span>
            <i />
            <span>3D VISUALIZATION &amp; MOTION</span>
            <i />
            <span>HARDWARE PROTOTYPING</span>
            <i />
            <span>3D RECONSTRUCTION</span>
          </div>
        </div>

        <section className="scene home-bridge" aria-labelledby="home-bridge-title">
          <div className="home-bridge__wash depth-0" data-depth="0" aria-hidden="true" />
          <div className="home-bridge__orbit depth-2" data-depth="2" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="home-bridge__copy depth-4" data-depth="4">
            <p>One compact object can require</p>
            <h2 id="home-bridge-title" data-reveal="text">
              geometry, behavior,
              <em>light and proof.</em>
            </h2>
            <p>
              That intersection—not a single software package—is the core of the
              portfolio.
            </p>
          </div>
          <div className="home-bridge__fx depth-5" data-depth="5" aria-hidden="true">
            <span>CAD</span>
            <span>3D</span>
            <span>HW</span>
            <span>SCAN</span>
          </div>
        </section>

        <section className="scene home-principles" aria-labelledby="principles-title">
          <div className="home-principles__wash depth-0" data-depth="0" aria-hidden="true" />
          <div className="home-principles__orbit depth-2" data-depth="2" aria-hidden="true">
            <span />
            <i />
          </div>

          <div className="home-principles__copy depth-4" data-depth="4">
            <p className="home-section-kicker">Field notes / how I judge the work</p>
            <h2 id="principles-title" data-reveal="text">
              Three principles
              <em>that keep the work honest.</em>
            </h2>
          </div>

          <div className="principle-books depth-3" data-depth="3">
            {principles.map((principle) => (
              <article className="principle-book" key={principle.number} data-reveal="block">
                <span>{principle.number}</span>
                <strong aria-hidden="true">{principle.mark}</strong>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>

          <div className="home-principles__fx depth-5" data-depth="5" aria-hidden="true">
            WORKING NOTES / 01—03
          </div>
        </section>

        <section
          className="scene home-process"
          id="process"
          aria-labelledby="process-title"
        >
          <div className="home-process__wash depth-0" data-depth="0" aria-hidden="true" />
          <div className="home-process__rail depth-2" data-depth="2" aria-hidden="true">
            <span />
            {processSteps.map((step) => <i key={step.number} />)}
          </div>

          <div className="home-process__heading depth-4" data-depth="4">
            <p className="home-section-kicker">A product path / not a fixed pipeline</p>
            <h2 id="process-title" data-reveal="text">
              From a behavior
              <em>to something testable.</em>
            </h2>
            <p>
              The order changes by project. The standard does not: every step
              should leave useful evidence for the next one.
            </p>
          </div>

          <ol className="home-process__steps depth-4" data-depth="4">
            {processSteps.map((step) => (
              <li key={step.number} data-reveal="block">
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <small>{step.output}</small>
              </li>
            ))}
          </ol>

          <div className="home-process__fx depth-5" data-depth="5" aria-hidden="true">
            <span>PROBLEM</span>
            <i>→</i>
            <span>PROOF</span>
          </div>
        </section>

        <section className="scene home-contact" id="contact" aria-labelledby="home-contact-title">
          <div className="home-contact__wash depth-0" data-depth="0" aria-hidden="true" />
          <div className="home-contact__object depth-2" data-depth="2" aria-hidden="true">
            <span>DM</span>
            <i />
          </div>
          <div className="home-contact__copy depth-4" data-depth="4">
            <p className="home-section-kicker">Open to roles and selected collaborations</p>
            <h2 id="home-contact-title" data-reveal="text">
              Need an idea
              <em>to become tangible?</em>
            </h2>
            <p>
              I am open to junior CAD, 3D, product visualization, hardware
              prototyping and reconstruction opportunities.
            </p>
            <div>
              <a href="mailto:daha442242@gmail.com">
                Email Daria <span>↗</span>
              </a>
              <a href={cvUrl} target="_blank" rel="noreferrer">
                View current CV <span>↗</span>
              </a>
            </div>
          </div>
          <div className="home-contact__fx depth-5" data-depth="5" aria-hidden="true">
            <span />
            <span />
          </div>
        </section>
      </div>
    </div>
  );
}
