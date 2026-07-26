import type { Metadata } from "vinext/shims/metadata";
import Link from "vinext/shims/link";
import { notFound } from "vinext/shims/navigation";
import { LikeButton } from "@/components/LikeButton";
import { MediaField } from "@/components/MediaField";
import { isProjectKey, projectByKey, projects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.key }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isProjectKey(slug)) return {};
  const project = projectByKey[slug];

  return {
    title: project.title,
    description: project.strapline,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!isProjectKey(slug)) notFound();

  const project = projectByKey[slug];
  const index = projects.findIndex((item) => item.key === project.key);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="main-content" className={`case-page case-page--${project.tone}`}>
      <section className="scene case-hero" id="top" aria-labelledby="case-title">
        <div className="case-hero__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="case-hero__orbit depth-2" data-depth="2" aria-hidden="true" />
        <div className="case-hero__content depth-4" data-depth="4">
          <Link className="back-link" href="/work">← Work index</Link>
          <p className="project-meta project-meta--hero">
            <span>{project.number}</span>
            <span>{project.category}</span>
            <span>{project.year}</span>
            <span>{project.status}</span>
          </p>
          <h1 id="case-title" data-reveal="text">{project.title}</h1>
          <p className="case-strapline" data-reveal="text">{project.strapline}</p>
          <div className="case-tools">
            {project.tools.map((tool) => <span key={tool}>{tool}</span>)}
          </div>
        </div>
        <div className="case-hero__fx depth-5" data-depth="5" aria-hidden="true">
          {project.number}
        </div>
      </section>

      <section className="case-visual-section" aria-label={`${project.title} visual`}>
        <MediaField project={project} priority />
      </section>

      <section className="scene case-overview" aria-labelledby="overview-title">
        <div className="case-section__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="case-section__mark depth-2" data-depth="2" aria-hidden="true">
          A
        </div>
        <div className="case-section__content depth-4" data-depth="4">
          <div className="case-section__heading">
            <p className="eyebrow">A · Overview</p>
            <h2 id="overview-title" data-reveal="text">
              The project,
              <em>without inflated claims.</em>
            </h2>
          </div>
          <div className="case-overview__copy">
            <p data-reveal="text">{project.overview}</p>
            <LikeButton project={project.key} projectName={project.title} />
            {project.source ? (
              <a
                className="text-link"
                href={project.source.href}
                target="_blank"
                rel="noreferrer"
              >
                {project.source.label} ↗
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="scene case-role" aria-labelledby="role-title">
        <div className="case-section__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="case-section__mark depth-2" data-depth="2" aria-hidden="true">
          B
        </div>
        <div className="case-section__content depth-4" data-depth="4">
          <div className="case-section__heading">
            <p className="eyebrow">B · My role</p>
            <h2 id="role-title" data-reveal="text">
              What I did,
              <em>stated directly.</em>
            </h2>
          </div>
          <ol className="role-list">
            {project.role.map((item, itemIndex) => (
              <li key={item} data-reveal="block">
                <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="scene case-development" aria-labelledby="development-title">
        <div className="case-section__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="case-section__mark depth-2" data-depth="2" aria-hidden="true">
          C
        </div>
        <div className="case-section__content depth-4" data-depth="4">
          <div className="case-section__heading">
            <p className="eyebrow">C · Development</p>
            <h2 id="development-title" data-reveal="text">
              Decisions,
              <em>not a screenshot dump.</em>
            </h2>
          </div>
          <div className="development-list">
            {project.development.map((item, itemIndex) => (
              <article key={item.title} data-reveal="block">
                <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scene case-details" aria-labelledby="details-title">
        <div className="case-section__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="case-section__mark depth-2" data-depth="2" aria-hidden="true">
          D
        </div>
        <div className="case-section__content depth-4" data-depth="4">
          <div className="case-section__heading">
            <p className="eyebrow">D · Technical details</p>
            <h2 id="details-title" data-reveal="text">
              The useful
              <em>specifics.</em>
            </h2>
          </div>
          <dl className="detail-list">
            {project.details.map((detail) => (
              <div key={detail.label} data-reveal="block">
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="scene case-result" aria-labelledby="result-title">
        <div className="case-result__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="case-result__disc depth-2" data-depth="2" aria-hidden="true" />
        <div className="case-result__content depth-4" data-depth="4">
          <p className="eyebrow">E · Result and next step</p>
          <h2 id="result-title" data-reveal="text">
            Where it stands
            <em>right now.</em>
          </h2>
          <div className="case-result__copy">
            <div>
              <span>Result</span>
              <p>{project.result}</p>
            </div>
            <div>
              <span>Next</span>
              <p>{project.nextStep}</p>
            </div>
          </div>
        </div>
        <div className="case-result__fx depth-5" data-depth="5" aria-hidden="true">
          RESULT
        </div>
      </section>

      <nav className="project-navigation" aria-label="Project navigation">
        <Link href={`/work/${previous.key}`}>
          <span>Previous</span>
          <strong>← {previous.shortTitle}</strong>
        </Link>
        <Link href="/work" className="project-navigation__index">
          All work
        </Link>
        <Link href={`/work/${next.key}`}>
          <span>Next</span>
          <strong>{next.shortTitle} →</strong>
        </Link>
      </nav>
    </main>
  );
}
