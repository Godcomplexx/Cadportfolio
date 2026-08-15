import type { ProjectIndexEntry } from "@/lib/projects";
import { Words } from "@/components/Words";

export function WorkIndex({ projects }: { projects: ProjectIndexEntry[] }) {
  return (
    <section
      className="work-index grid12"
      id="project-index"
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
            <a className="work-index__row" href={project.href} key={project.key}>
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
