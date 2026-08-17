import type { Metadata } from "vinext/shims/metadata";
import { MotionSystem } from "@/components/MotionSystem";
import { SiteLoader } from "@/components/SiteLoader";
import { ElementPicker } from "@/components/ElementPicker";
import { SmoothScrollFrame } from "@/components/SmoothScrollFrame";
import "./globals.css";

const githubPages = process.env.GITHUB_PAGES === "1";
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(
    githubPages
      ? "https://godcomplexx.github.io/Cadportfolio/"
      : "https://daria-cad-archive.daydd385.chatgpt.site",
  ),
  title: {
    default: "Daria Melnikova — 3D, CAD & Product Prototyping",
    template: "%s — Daria Melnikova",
  },
  description:
    "Compact physical products, CAD models, visual stories and working prototypes by Daria Melnikova.",
  keywords: [
    "CAD designer",
    "3D designer",
    "product prototyping",
    "hardware prototyping",
    "product visualization",
    "photogrammetry",
  ],
  openGraph: {
    title: "Daria Melnikova — 3D, CAD & Product Prototyping",
    description:
      "Compact devices, physical interfaces and visual product stories.",
    type: "website",
    images: [
      {
        url: `${publicBasePath}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Daria Melnikova — 3D, CAD & Product Prototyping",
      },
    ],
  },
  icons: {
    icon: `${publicBasePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto !important; }
          }
        `}</style>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
        />
      </head>
      <body>
        <SiteLoader />
        <SmoothScrollFrame>
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>
          {children}
        </SmoothScrollFrame>
        {process.env.NODE_ENV === "development" ? <ElementPicker /> : null}
        <MotionSystem />
      </body>
    </html>
  );
}
