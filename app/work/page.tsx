import type { Metadata } from "vinext/shims/metadata";
import { WorkFilter } from "@/components/WorkFilter";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected CAD, product visualization, hardware and reconstruction projects by Daria Melnikova.",
};

export default function WorkPage() {
  return (
    <main id="main-content">
      <section className="scene page-hero page-hero--work" id="top">
        <div className="page-hero__wash depth-0" data-depth="0" aria-hidden="true" />
        <div className="page-hero__orbit depth-2" data-depth="2" aria-hidden="true" />
        <div className="page-hero__content depth-4" data-depth="4">
          <p className="eyebrow">Work index · 2025—2026</p>
          <h1 data-reveal="text">
            Selected projects,
            <em>organized by proof.</em>
          </h1>
          <p>
            Filter the portfolio for CAD, motion, hardware or reconstruction.
            Every project states its status and personal contribution.
          </p>
        </div>
        <div className="page-hero__fx depth-5" data-depth="5" aria-hidden="true">
          01—04
        </div>
      </section>

      <section className="work-index-section" aria-label="Portfolio projects">
        <WorkFilter />
      </section>
    </main>
  );
}
