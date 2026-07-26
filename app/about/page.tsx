import type { Metadata } from "vinext/shims/metadata";
import Link from "vinext/shims/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "R&D experience, tools and product development process of Daria Melnikova.",
};

const toolGroups = [
  {
    title: "CAD & 3D",
    items: ["SolidWorks", "Plasticity", "Blender", "Hard-surface modeling"],
  },
  {
    title: "Hardware",
    items: ["ESP32", "Sensors", "OLED interfaces", "PCB integration", "Soldering"],
  },
  {
    title: "Visual",
    items: ["Materials", "Lighting", "Rendering", "Animation", "Compositing"],
  },
  {
    title: "Reconstruction",
    items: ["Capture planning", "Mesh cleanup", "Retopology", "UV", "Texturing"],
  },
];

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="scene page-hero page-hero--about" id="top">
        <div className="page-hero__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="page-hero__orbit depth-2" data-depth="2" aria-hidden="true" />
        <div className="page-hero__content depth-4" data-depth="4">
          <p className="eyebrow">About · R&amp;D to physical product</p>
          <h1 data-reveal="text">
            I design around
            <em>what is actually inside.</em>
          </h1>
          <p>
            My embedded-systems background keeps product decisions connected to
            boards, sensors, displays, connectors and real assembly constraints.
          </p>
        </div>
        <div className="page-hero__fx depth-5" data-depth="5" aria-hidden="true">
          DM
        </div>
      </section>

      <section className="scene about-story" aria-labelledby="about-story-title">
        <div className="about-story__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="about-story__mark depth-2" data-depth="2" aria-hidden="true">
          FORM × LOGIC
        </div>
        <div className="about-story__content depth-4" data-depth="4">
          <p className="eyebrow">Profile</p>
          <h2 id="about-story-title" data-reveal="text">
            A bridge between engineering,
            <em>3D and product communication.</em>
          </h2>
          <div className="about-story__copy">
            <p data-reveal="text">
              I am an R&amp;D systems engineer moving deeper into CAD, compact
              physical products and visualization. I am most interested in
              devices where form, interaction and electronics have to be solved
              together.
            </p>
            <p data-reveal="text">
              My broader work includes AI, neurotechnology, computer vision and
              embedded systems. In this portfolio, that experience becomes
              practical product context: component-aware enclosures, readable
              technical stories and prototypes that can be tested.
            </p>
          </div>
        </div>
      </section>

      <section className="scene tools-section" aria-labelledby="tools-title">
        <div className="tools-section__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="tools-section__disc depth-2" data-depth="2" aria-hidden="true" />
        <div className="tools-section__content depth-4" data-depth="4">
          <header>
            <p className="eyebrow">Tools &amp; working areas</p>
            <h2 id="tools-title" data-reveal="text">
              Used as evidence,
              <em>not percentages.</em>
            </h2>
          </header>
          <div className="tool-groups">
            {toolGroups.map((group, index) => (
              <article key={group.title} data-reveal="block">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scene availability-section" aria-labelledby="availability-title">
        <div className="availability-section__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="availability-section__mark depth-2" data-depth="2" aria-hidden="true">
          AVAILABLE
        </div>
        <div className="availability-section__content depth-4" data-depth="4">
          <p className="eyebrow">Roles &amp; collaboration</p>
          <h2 id="availability-title" data-reveal="text">
            Open to focused,
            <em>cross-disciplinary work.</em>
          </h2>
          <p>
            Junior CAD, 3D and product visualization roles; hardware prototyping;
            R&amp;D collaboration; internships and selected freelance work.
          </p>
          <div className="button-row">
            <Link className="button button--dark" href="/work">
              Review selected work ↗
            </Link>
            <a className="button button--line" href="mailto:daha442242@gmail.com">
              Email Daria ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
