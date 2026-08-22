"use client";

import { useMemo, useState } from "react";
import Link from "vinext/shims/link";
import { MediaField } from "@/components/MediaField";
import { projects, type ProjectCategory } from "@/lib/projects";

const filters = [
  "All",
  "PRODUCT / MECHANICAL",
  "EMBEDDED HARDWARE",
  "VISUALIZATION / MOTION",
] as const;

export function WorkFilter() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((project) =>
            project.categories.includes(active as ProjectCategory),
          ),
    [active],
  );

  return (
    <>
      <div className="work-filters" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={active === filter ? "is-active" : ""}
            aria-pressed={active === filter}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="work-list" aria-live="polite">
        {visible.map((project, index) => (
          <article
            className={`work-list__item work-list__item--${index % 3}`}
            key={project.key}
            data-reveal="block"
          >
            <Link className="work-list__visual" href={`/work/${project.key}`}>
              <MediaField project={project} compact />
            </Link>
            <div className="work-list__copy">
              <p className="project-meta">
                <span>{project.number}</span>
                <span>{project.category}</span>
                <span>{project.year}</span>
                <span>{project.status}</span>
              </p>
              <h2>{project.shortTitle}</h2>
              <p>{project.strapline}</p>
              <Link className="text-link" href={`/work/${project.key}`}>
                View project <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
