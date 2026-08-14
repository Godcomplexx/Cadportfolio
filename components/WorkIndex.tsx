import type { CSSProperties } from "react";
import type { Project } from "@/lib/projects";
import { Words } from "@/components/Words";

const accents = ["#8ef07a", "#62efff", "#ff6bdd", "#c3b8ff"] as const;

/**
 * Compact work index on the 12-column grid — several projects visible at once,
 * each a preview card linking through to the full case.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <section className="work-index grid12" id="work" aria-labelledby="work-title">
      <header className="work-index__head">
        <Words as="h2" className="t-display" text="Selected work" />
        <p className="t-label">
          {String(projects.length).padStart(2, "0")} projects / 2025—2026
        </p>
      </header>

      {projects.map((project, index) => (
        <a
          className="work-card"
          key={project.key}
          href={`#project-${project.key}`}
          style={{ "--project-accent": accents[index % accents.length] } as CSSProperties}
          data-reveal="block"
        >
          <div className="work-card__frame" data-index={project.number}>
            {project.actualImage ? (
              <img
                src={project.actualImage}
                alt={project.actualImageAlt ?? ""}
                loading="lazy"
              />
            ) : null}
            <span
              className="project-border-motion depth-5"
              data-reveal="border"
              data-depth="5"
              data-fixed-depth
              aria-hidden="true"
            />
            <span className="work-card__tag">{project.status}</span>
          </div>
          <div className="work-card__line">
            <span>{project.shortTitle}</span>
            <div>
              <time dateTime={project.year}>{project.year}</time>
              <span className="work-card__cat">
                {project.category}
                <i aria-hidden="true">↗</i>
              </span>
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}
