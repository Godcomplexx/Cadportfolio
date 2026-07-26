import Link from "vinext/shims/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-atmosphere depth-0" data-depth="0" aria-hidden="true" />
      <div className="footer-orbit depth-2" data-depth="2" aria-hidden="true" />
      <div className="footer-content depth-4" data-depth="4">
        <p className="eyebrow">Available for selected roles and collaborations</p>
        <h2 data-reveal="text">
          Have a compact idea
          <em>that needs a body?</em>
        </h2>
        <a className="contact-cta" href="mailto:daha442242@gmail.com">
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </a>
        <div className="footer-links">
          <a href="mailto:daha442242@gmail.com">Email</a>
          <a href="https://github.com/Godcomplexx" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href="https://www.artstation.com/shakbo19" target="_blank" rel="noreferrer">
            ArtStation ↗
          </a>
          <a
            href="https://godcomplexx.github.io/portfolio/resume/daria_melnikova_resume_print.html"
            target="_blank"
            rel="noreferrer"
          >
            Current CV ↗
          </a>
        </div>
        <div className="footer-base">
          <p>Daria Melnikova © 2026</p>
          <p>3D · CAD · hardware · reconstruction</p>
          <Link href="#top">Back to top ↑</Link>
        </div>
      </div>
      <div className="footer-fx depth-5" data-depth="5" aria-hidden="true">
        <span />
        <span />
      </div>
    </footer>
  );
}
