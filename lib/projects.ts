import { publicPath } from "@/lib/public-path";

export const PROJECT_KEYS = [
  "copet-pilot",
  "smartmotion",
  "modular-system",
  "eeg-wearable",
  "handheld-media",
] as const;

export type ProjectKey = (typeof PROJECT_KEYS)[number];
export type ProjectCategory =
  | "PRODUCT / MECHANICAL"
  | "EMBEDDED HARDWARE"
  | "VISUALIZATION / MOTION";

type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
};

type ProjectVideo = {
  src: string;
  poster: string;
  label: string;
  meta: string;
  description: string;
};

export type Project = {
  key: ProjectKey;
  number: string;
  title: string;
  shortTitle: string;
  strapline: string;
  category: ProjectCategory;
  categories: ProjectCategory[];
  year: string;
  status:
    | "Concept"
    | "Documented study"
    | "Functional prototype"
    | "Working prototype";
  tools: string[];
  overview: string;
  role: string[];
  development: { title: string; text: string }[];
  details: { label: string; value: string }[];
  result: string;
  nextStep: string;
  evidence: { verified: string[]; next: string[] };
  visualLabel: string;
  visualRatio: string;
  actualImage?: ProjectImage;
  supportingImage?: ProjectImage;
  processVideo?: ProjectVideo;
  source?: { label: string; href: string };
  tone: "coral" | "blue" | "sage" | "violet";
};

export type ProjectIndexEntry = {
  key: ProjectKey;
  number: string;
  title: string;
  category: ProjectCategory;
  year: string;
  status: string;
  href: string;
  external?: boolean;
};

export type VisualStudy = {
  key: string;
  number: string;
  title: string;
  discipline: string;
  description: string;
  image: ProjectImage;
};

export const projects: Project[] = [
  {
    key: "copet-pilot",
    number: "01",
    title: "CoPet Pilot",
    shortTitle: "CoPet Pilot",
    strapline:
      "A desk companion built as a working ESP32 interaction and electronics prototype.",
    category: "EMBEDDED HARDWARE",
    categories: ["EMBEDDED HARDWARE", "PRODUCT / MECHANICAL"],
    year: "2026",
    status: "Working prototype",
    tools: ["ESP32", "ST7789", "Sensors", "Audio", "C / C++"],
    overview:
      "CoPet Pilot combines a 240 × 240 display, wheel input, touch, motion, environmental sensing and audio in one working desk prototype. The current build proves the electronics, firmware and interaction system. A custom PCB and integrated enclosure are the next product-development stage, so neither is presented here as finished.",
    role: [
      "I designed the interaction system and integrated the current hardware prototype.",
      "I implemented the firmware architecture and procedural face behavior.",
      "I connected the display, wheel, touch, sensors and audio path.",
      "I assembled and validated the physical prototype.",
    ],
    development: [
      {
        title: "System architecture",
        text: "The ESP32 coordinates display, input, sensor and audio subsystems through a state-based interaction model.",
      },
      {
        title: "Physical integration",
        text: "The open build establishes the real component stack and exposes the constraints for the enclosure pass.",
      },
      {
        title: "Interaction proof",
        text: "Wheel, touch and sensor inputs drive visible responses on the device rather than a disconnected screen mockup.",
      },
      {
        title: "Enclosure brief",
        text: "The next CAD stage packages the proven stack with service access, cable routing and repeatable assembly.",
      },
    ],
    details: [
      { label: "Controller", value: "ESP32-WROOM-32" },
      { label: "Display", value: "240 × 240 ST7789" },
      { label: "Input", value: "Wheel encoder + capacitive touch" },
      { label: "Sensors", value: "SHT31 + MPU6050" },
      { label: "Audio", value: "INMP441 + MAX98357A" },
      { label: "Validation", value: "322 host checks / 11 suites" },
    ],
    result:
      "The assembled prototype runs the interface, reacts to physical inputs and validates the core hardware and firmware integration.",
    nextStep:
      "Translate the proven component stack into enclosure CAD, then document section, assembly and fit-test evidence.",
    evidence: {
      verified: ["Physical build", "Component integration", "Functional test"],
      next: ["Enclosure CAD", "Section view", "Exploded assembly"],
    },
    visualLabel: "CURRENT PROTOTYPE / HARDWARE INTEGRATION",
    visualRatio: "1600 × 1406 / BUILD EVIDENCE",
    actualImage: {
      src: publicPath("/media/copet-hero.jpg"),
      alt: "Working CoPet Pilot electronics prototype with an ESP32 display, controls, sensors and wired modules.",
      width: 1600,
      height: 1406,
    },
    source: {
      label: "View prototype documentation",
      href: "https://github.com/Godcomplexx/COpet_pilot",
    },
    tone: "coral",
  },
  {
    key: "smartmotion",
    number: "02",
    title: "SmartMotion Keychain",
    shortTitle: "SmartMotion",
    strapline:
      "A motion-reactive ESP32-C3 keychain that turns movement into a small physical interface.",
    category: "EMBEDDED HARDWARE",
    categories: ["EMBEDDED HARDWARE", "PRODUCT / MECHANICAL"],
    year: "2026",
    status: "Working prototype",
    tools: ["ESP-IDF", "ESP32-C3", "MPU-6050", "OLED", "BLE", "Android"],
    overview:
      "SmartMotion is a compact object that reacts to movement, sleeps when still, wakes when picked up and becomes a tilt-controlled game. The firmware, companion app and electronics work together; the current enclosure image communicates the product direction, while enclosure integration remains in development.",
    role: [
      "I developed the product concept and interaction modes.",
      "I structured and implemented the ESP-IDF firmware.",
      "I integrated motion sensing, OLED rendering and on-demand BLE.",
      "I built the Android time-sync companion flow.",
    ],
    development: [
      {
        title: "Behavior first",
        text: "FLUID, SLEEP, TIME and GAME modes define what the object communicates before the shell is finalized.",
      },
      {
        title: "Hardware stack",
        text: "The ESP32-C3, OLED and MPU-6050 share a compact I²C-centered architecture with motion wake-up.",
      },
      {
        title: "Low-power logic",
        text: "Inactivity dims the animation, turns off the OLED and leaves the motion sensor as the wake source.",
      },
      {
        title: "Enclosure iteration",
        text: "The next CAD pass will reduce thickness, retain components and prepare the shell for repeatable printing.",
      },
    ],
    details: [
      { label: "Controller", value: "ESP32-C3 Super Mini" },
      { label: "Display", value: "0.96″ · 128 × 64 OLED" },
      { label: "Sensor", value: "MPU-6050 accelerometer / gyroscope" },
      { label: "Bus", value: "Shared 200 kHz I²C" },
      { label: "Interaction", value: "Tilt, movement and triple-shake" },
      { label: "Connectivity", value: "On-demand BLE GATT" },
    ],
    result:
      "The firmware, companion app and electronics operate as a connected prototype with motion input, a playable interface and low-power states.",
    nextStep:
      "Integrate the assembled electronics into the next enclosure iteration and document the physical fit.",
    evidence: {
      verified: ["Firmware", "Electronics", "Interaction test"],
      next: ["Assembled enclosure", "Internal layout", "Fit test"],
    },
    visualLabel: "CONCEPT RENDER / ENCLOSURE DIRECTION",
    visualRatio: "1000 × 1000 / SOURCE IMAGE",
    actualImage: {
      src: publicPath("/media/smartmotion-prototype.webp"),
      alt: "Green organic SmartMotion keychain enclosure concept suspended from a metal clip against a cloudy sky.",
      width: 1000,
      height: 1000,
    },
    source: {
      label: "View firmware and hardware documentation",
      href: "https://github.com/Godcomplexx/Keychain_motion",
    },
    tone: "blue",
  },
  {
    key: "modular-system",
    number: "03",
    title: "SolidWorks Mechanical Foundations",
    shortTitle: "SolidWorks Study",
    strapline:
      "A documented CAD practice spanning parts, assemblies and production-style drawings.",
    category: "PRODUCT / MECHANICAL",
    categories: ["PRODUCT / MECHANICAL"],
    year: "2025—2026",
    status: "Documented study",
    tools: ["SolidWorks", "Part modeling", "Assemblies", "Drawings", "Design intent"],
    overview:
      "This is a real SolidWorks study archive, not a placeholder concept. It contains 32 native CAD documents: 16 parts, 8 assemblies and 8 drawings. The work covers parametric features, patterns, configurations, mating, section views and drawing layouts; the case presents it honestly as mechanical foundations rather than manufacturing validation.",
    role: [
      "I modeled the parts and preserved editable feature histories.",
      "I assembled components with repeatable mating logic.",
      "I produced part and assembly drawings with orthographic and section views.",
      "I organized the native source set for continued iteration.",
    ],
    development: [
      {
        title: "Part system",
        text: "Brackets, sleeves, plates, shafts and enclosure elements build confidence with sketches, patterns, fillets and configurations.",
      },
      {
        title: "Assembly logic",
        text: "Eight native assemblies connect the parts through constraints and repeated components rather than flattened geometry.",
      },
      {
        title: "Drawing evidence",
        text: "Eight drawings document orthographic views, sections and assembly layouts directly from the CAD source.",
      },
      {
        title: "Next proof",
        text: "The next portfolio pass should add tolerances, one manufacturing drawing set and a physical fit-test revision.",
      },
    ],
    details: [
      { label: "Native parts", value: "16 × SLDPRT" },
      { label: "Assemblies", value: "8 × SLDASM" },
      { label: "Drawings", value: "8 × SLDDRW" },
      { label: "Focus", value: "Features, mates, configurations" },
      { label: "Documentation", value: "Views, sections, layouts" },
      { label: "Archive", value: "32 editable CAD documents" },
    ],
    result:
      "The archive demonstrates a complete beginner-to-intermediate SolidWorks workflow across editable parts, assemblies and linked drawings.",
    nextStep:
      "Select one mechanism for a tolerance-aware drawing package and document a physical Rev A to Rev B fit test.",
    evidence: {
      verified: ["Native parts", "Native assemblies", "Linked drawings"],
      next: ["Tolerance scheme", "Manufacturing drawing", "Physical fit test"],
    },
    visualLabel: "NATIVE SOLIDWORKS SOURCE / ASSEMBLY + DRAWING",
    visualRatio: "32 DOCUMENTS / EDITABLE CAD",
    actualImage: {
      src: publicPath("/media/solidworks/assembly.webp"),
      alt: "SolidWorks assembly preview of a rounded mechanical housing with repeated fasteners and mounting feet.",
      width: 1200,
      height: 900,
      label: "Assembly / SLDASM",
    },
    supportingImage: {
      src: publicPath("/media/solidworks/drawing.webp"),
      alt: "SolidWorks technical drawing sheet with isometric, front and side views of a bracket.",
      width: 1200,
      height: 900,
      label: "Drawing / SLDDRW",
    },
    tone: "sage",
  },
  {
    key: "eeg-wearable",
    number: "04",
    title: "Wearable EEG",
    shortTitle: "EEG Wearable",
    strapline:
      "A visualization and motion concept for explaining a compact wearable system.",
    category: "VISUALIZATION / MOTION",
    categories: ["VISUALIZATION / MOTION"],
    year: "2026",
    status: "Concept",
    tools: ["Blender", "Plasticity", "Lighting", "Animation", "Compositing"],
    overview:
      "This case focuses on communication: how external form, contact interface and an intended internal stack can be explained in one concise visual sequence. It is a visualization concept, not a validated medical device or a mechanical proof case.",
    role: ["I developed the visual direction and enclosure concept."],
    development: [
      {
        title: "Form direction",
        text: "The earpiece silhouette was developed as a compact wearable object with a clearly separated contact layer.",
      },
      {
        title: "Exploded sequence",
        text: "The animation separates the external shell, contact interface and intended electronics stack in a readable order.",
      },
      {
        title: "Material study",
        text: "Controlled surfaces, edge highlights and a restrained palette keep the construction legible in a vertical frame.",
      },
      {
        title: "Motion edit",
        text: "Camera movement and timing compress the assembled form and exploded story into a concise 26-second presentation.",
      },
    ],
    details: [
      { label: "Format", value: "Vertical product film" },
      { label: "Duration", value: "00:26" },
      { label: "Frame", value: "832 × 1152" },
      { label: "Frame rate", value: "25 fps" },
      { label: "Focus", value: "Form + exploded stack" },
      { label: "Output", value: "H.264" },
    ],
    result:
      "The work defines a concise visual language for a technically informed wearable concept without presenting it as a tested device.",
    nextStep: "Refine lighting, pacing and the captioned presentation export.",
    evidence: {
      verified: ["Form study", "Material direction", "Exploded sequence"],
      next: ["Final render polish", "Captioned export"],
    },
    visualLabel: "VISUALIZATION CONCEPT / MOTION",
    visualRatio: "832 × 1152 / 00:26",
    processVideo: {
      src: publicPath("/media/eeg-wearable/eeg-device2.mp4"),
      poster: publicPath("/media/eeg-wearable/eeg-device2-poster.webp"),
      label: "PROCESS CLIP / EEG EARPIECE",
      meta: "00:26 / 9:16",
      description:
        "Assembled form, exploded stack and electronics shown in one vertical concept sequence.",
    },
    tone: "violet",
  },
];

export const featuredProjects = projects.filter((project) =>
  ["copet-pilot", "smartmotion", "modular-system", "eeg-wearable"].includes(project.key),
);

export const visualStudies: VisualStudy[] = [
  {
    key: "handheld",
    number: "05",
    title: "Handheld Media Object",
    discipline: "HARD-SURFACE / PRODUCT RENDER",
    description:
      "A stylized handheld device study focused on silhouette, controls, color blocking and presentation.",
    image: {
      src: publicPath("/media/visual-lab/handheld.webp"),
      alt: "Stylized handheld media player render with a circular screen and physical controls.",
      width: 1400,
      height: 1400,
    },
  },
  {
    key: "procedural-object",
    number: "V01",
    title: "Organic Interface Study",
    discipline: "FORM / TRANSPARENCY / CONTRAST",
    description:
      "A transparent enclosure and organic elements used to test depth, overlap and visual tension.",
    image: {
      src: publicPath("/media/visual-lab/procedural-object.webp"),
      alt: "Transparent hard-surface object with dark organic tentacle-like forms passing through it.",
      width: 1080,
      height: 1080,
    },
  },
  {
    key: "glass",
    number: "V02",
    title: "Glass Material Study",
    discipline: "MATERIAL / LIGHTING",
    description:
      "A controlled material study built around refraction, highlights and a restrained studio palette.",
    image: {
      src: publicPath("/media/visual-lab/glass.webp"),
      alt: "Abstract glass object rendered with blue and magenta studio lighting.",
      width: 1400,
      height: 1400,
    },
  },
  {
    key: "interior",
    number: "V03",
    title: "Atmospheric Interior",
    discipline: "SPACE / LIGHT / COMPOSITION",
    description:
      "An environment study balancing a long perspective, warm practical light and a cool ambient field.",
    image: {
      src: publicPath("/media/visual-lab/interior.webp"),
      alt: "Long atmospheric interior hallway rendered with warm wall lights and a cool window glow.",
      width: 1600,
      height: 905,
    },
  },
  {
    key: "vending",
    number: "V04",
    title: "Vending Island",
    discipline: "ENVIRONMENT / PRODUCT VISUALIZATION",
    description:
      "A compact commercial island explored as both a designed object and a small architectural scene.",
    image: {
      src: publicPath("/media/visual-lab/vending.webp"),
      alt: "Isometric vending kiosk island rendered against a soft colored background.",
      width: 1400,
      height: 1400,
    },
  },
];

export const practiceMetrics = [
  { value: "32", label: "native SolidWorks documents" },
  { value: "08", label: "editable assemblies" },
  { value: "08", label: "linked technical drawings" },
] as const;

export const toolGroups = [
  {
    title: "CAD + physical form",
    tools: ["SolidWorks", "Plasticity", "Blender", "3D printing"],
  },
  {
    title: "Assemblies + documentation",
    tools: ["Assembly mates", "Configurations", "Section views", "Drawing layouts"],
  },
  {
    title: "Prototype development",
    tools: ["Enclosure studies", "Component layout", "3D printing", "Fit iteration"],
  },
  {
    title: "Visual communication",
    tools: ["Hard-surface modeling", "Materials", "Lighting", "Motion"],
  },
] as const;

export const projectIndex: ProjectIndexEntry[] = [
  ...featuredProjects.map((project) => ({
    key: project.key,
    number: project.number,
    title: project.title,
    category: project.category,
    year: project.year,
    status: project.status,
    href: `#project-${project.key}`,
  })),
  {
    key: "handheld-media",
    number: "05",
    title: "Handheld Media Object",
    category: "VISUALIZATION / MOTION",
    year: "2026",
    status: "Render study",
    href: "#visual-lab-handheld",
  },
];

export const projectByKey = Object.fromEntries(
  projects.map((project) => [project.key, project]),
) as Partial<Record<ProjectKey, Project>>;

export function isProjectKey(value: unknown): value is ProjectKey {
  return (
    typeof value === "string" &&
    (PROJECT_KEYS as readonly string[]).includes(value)
  );
}
