import type { Metadata } from "vinext/shims/metadata";
import { MotionSystem } from "@/components/MotionSystem";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daria-cad-archive.daydd385.chatgpt.site"),
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
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Daria Melnikova — 3D, CAD & Product Prototyping",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <SiteFooter />
        <MotionSystem />
      </body>
    </html>
  );
}
