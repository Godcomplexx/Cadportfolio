import type { ProjectIndexEntry } from "@/lib/projects";
import { Words } from "@/components/Words";

export function WorkIndex({ projects }: { projects: ProjectIndexEntry[] }) {
  const categories = [...new Set(projects.map((project) => project.category))];

  return (
    <section
      className="work-index grid12"
      id="work"
      aria-labelledby="project-index-title"
    >
      <header className="work-index__head">
        <div>
          <p className="section-kicker">All work / current stage</p>
          <Words
            as="h2"
            className="t-display"
            id="project-index-title"
            text="Project index"
          />
        </div>
        <p className="t-label">
          {String(projects.length).padStart(2, "0")} projects / 2025—2026
        </p>
      </header>

      <ul className="work-index__legend" aria-label="Project categories">
        {categories.map((category) => <li key={category}>{category}</li>)}
      </ul>

      <div className="work-index__list">
        {projects.map((project) => {
          const content = (
            <>
              <span className="work-index__number">{project.number}</span>
              <span className="work-index__title">{project.title}</span>
              <span className="work-index__category">{project.category}</span>
              <span className="work-index__status">{project.status}</span>
              <time dateTime={project.year}>{project.year}</time>
              <i aria-hidden="true">{project.href ? "↗" : "—"}</i>
            </>
          );

          return project.href ? (
            <a
              className="work-index__row"
              href={project.href}
              key={project.key}
              target={project.external ? "_blank" : undefined}
              rel={project.external ? "noreferrer" : undefined}
            >
              {content}
            </a>
          ) : (
            <div className="work-index__row work-index__row--pending" key={project.key}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
