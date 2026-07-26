import type { Project } from "@/lib/projects";

type MediaFieldProps = {
  project: Project;
  priority?: boolean;
  compact?: boolean;
  label?: string;
  ratio?: string;
};

export function MediaField({
  project,
  priority = false,
  compact = false,
  label = project.visualLabel,
  ratio = project.visualRatio,
}: MediaFieldProps) {
  return (
    <figure
      className={`media-field media-field--${project.tone}${
        compact ? " media-field--compact" : ""
      }`}
      data-reveal="media"
    >
      <div className="media-layer media-layer--bg depth-0" data-depth="0" aria-hidden="true" />
      <div className="media-layer media-layer--glow depth-1" data-depth="1" aria-hidden="true" />
      <div className="media-layer media-layer--orbit depth-2" data-depth="2" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="media-layer media-layer--object depth-3" data-depth="3">
        {project.actualImage ? (
          // This is a small, already-compressed local source image; preserving it
          // avoids a deployment-time image optimisation dependency.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.actualImage}
            alt={project.actualImageAlt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div
            className="placeholder-object"
            role="img"
            aria-label={`Placeholder for ${project.title}: ${label}`}
          >
            <span className="placeholder-object__one" aria-hidden="true" />
            <span className="placeholder-object__two" aria-hidden="true" />
            <span className="placeholder-object__three" aria-hidden="true" />
            <b>{project.number}</b>
          </div>
        )}
      </div>
      <div className="media-layer media-layer--meta depth-4" data-depth="4">
        <span>{project.number} / {project.shortTitle}</span>
        <span>{label}</span>
        <span>{ratio}</span>
      </div>
      <div className="media-layer media-layer--fx depth-5" data-depth="5" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <figcaption className="sr-only">
        {project.actualImageAlt ?? `Composition placeholder for ${project.title}`}
      </figcaption>
    </figure>
  );
}
