import { projectTracks, type ProjectIndexEntry } from "@/lib/projects";
import { Words } from "@/components/Words";

function IndexRow({ project }: { project: ProjectIndexEntry }) {
  const content = (
    <>
      <span className="work-index__number">{project.number}</span>
      <span className="work-index__title">{project.title}</span>
      <span className="work-index__category">{project.category}</span>
      <span className="work-index__status">{project.status}</span>
      <time dateTime={project.year}>{project.year}</time>
      <i aria-hidden="true">{project.href ? "↘" : "—"}</i>
    </>
  );

  return project.href ? (
    <a
      className="work-index__row"
      href={project.href}
      target={project.external ? "_blank" : undefined}
      rel={project.external ? "noreferrer" : undefined}
    >
      {content}
    </a>
  ) : (
    <div className="work-index__row work-index__row--pending">{content}</div>
  );
}

export function WorkIndex({ projects }: { projects: ProjectIndexEntry[] }) {
  return (
    <section
      className="work-index grid12"
      id="work"
      aria-labelledby="project-index-title"
    >
      <header className="work-index__head">
        <div>
          <p className="section-kicker">All work / three tracks</p>
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

      {/* Jump links to the three shelves further down the page. */}
      <ul className="work-index__legend" aria-label="Project tracks">
        {projectTracks.map((track) => (
          <li key={track.key}>
            <a href={`#track-${track.key}`}>
              {track.code} / {track.title}
            </a>
          </li>
        ))}
      </ul>

      <div className="work-index__list">
        {projectTracks.map((track) => {
          const rows = projects.filter((project) => project.track === track.key);
          if (!rows.length) return null;

          return (
            <div className="work-index__group" key={track.key}>
              <p className="work-index__group-title">
                <span>{track.code}</span> {track.title}
                <small>{String(rows.length).padStart(2, "0")}</small>
              </p>
              {rows.map((project) => (
                <IndexRow project={project} key={project.key} />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
