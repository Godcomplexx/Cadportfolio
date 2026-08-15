import { publicPath } from "@/lib/public-path";

export const PROJECT_KEYS = [
  "copet-pilot",
  "smartmotion",
  "modular-system",
  "eeg-wearable",
  "handheld-media",
  "photogrammetry",
] as const;

export type ProjectKey = (typeof PROJECT_KEYS)[number];
export type ProjectCategory =
  | "PRODUCT / MECHANICAL"
  | "EMBEDDED HARDWARE"
  | "VISUALIZATION / MOTION"
  | "RECONSTRUCTION";

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
    | "Prototype"
    | "Working prototype"
    | "Evidence in progress";
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
  actualImage?: string;
  actualImageAlt?: string;
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
  href?: string;
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
        text: "The present open build establishes the real component stack and exposes the constraints for the enclosure pass.",
      },
      {
        title: "Interaction proof",
        text: "Wheel, touch and sensor inputs drive visible responses on the device rather than a disconnected screen mockup.",
      },
      {
        title: "Enclosure brief",
        text: "The next CAD stage must package the proven stack with service access, cable routing and repeatable assembly.",
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
    visualRatio: "4:3 / BUILD EVIDENCE",
    actualImage:
      "https://raw.githubusercontent.com/Godcomplexx/COpet_pilot/main/docs/media/copet-hero.jpg",
    actualImageAlt:
      "Working CoPet Pilot electronics prototype with an ESP32 display, controls, sensors and wired modules.",
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
    visualRatio: "1:1 / SOURCE IMAGE",
    actualImage: publicPath("/media/smartmotion-prototype.webp"),
    actualImageAlt:
      "Green organic SmartMotion keychain enclosure concept suspended from a metal clip against a cloudy sky.",
    source: {
      label: "View firmware and hardware documentation",
      href: "https://github.com/Godcomplexx/Keychain_motion",
    },
    tone: "blue",
  },
  {
    key: "modular-system",
    number: "03",
    title: "Mechanical Design Study",
    shortTitle: "Mechanical Study",
    strapline:
      "A hard-surface CAD study built around repeatable interfaces and readable assembly logic.",
    category: "PRODUCT / MECHANICAL",
    categories: ["PRODUCT / MECHANICAL"],
    year: "2025",
    status: "Evidence in progress",
    tools: ["SolidWorks", "Plasticity", "Blender", "3D printing"],
    overview:
      "This study explores how differently sized housings can share one construction language. Openings, mounting surfaces and repeated details are treated as a system rather than isolated forms. It remains explicitly marked as a study until dimensioned drawings and physical fit-test evidence are published.",
    role: [
      "I built the hard-surface CAD components.",
      "I developed the repeated openings and interface language.",
      "I organized the assembly hierarchy and exploded presentation.",
      "I prepared the concept for prototype evaluation.",
    ],
    development: [
      {
        title: "Shared language",
        text: "Recurring radii, seams and openings keep differently sized modules visually related.",
      },
      {
        title: "Interface logic",
        text: "Mounting surfaces and connection points are separated from the outer form so they can evolve independently.",
      },
      {
        title: "Proof plan",
        text: "Assembly, exploded view, section A–A, details, dimensions and a Rev A to Rev B fit test form the evidence set.",
      },
    ],
    details: [
      { label: "System", value: "Repeated housing family" },
      { label: "Focus", value: "Interfaces, openings, hierarchy" },
      { label: "Output", value: "CAD assembly + exploded view" },
      { label: "Status", value: "Evidence in progress" },
      { label: "Evidence pending", value: "Dimensions + fit testing" },
      { label: "Method", value: "Additive prototype evaluation" },
    ],
    result:
      "The current study establishes a coherent part family and assembly hierarchy without claiming unverified manufacturing performance.",
    nextStep:
      "Publish section A–A, dimensioned drawings, joint close-ups and one repeatable physical fit test.",
    evidence: {
      verified: ["CAD assembly", "Interface study"],
      next: ["Section A–A", "Dimensioned drawing", "Rev A → B fit test"],
    },
    visualLabel: "EVIDENCE MAP / MECHANICAL STUDY",
    visualRatio: "ASSEMBLY → FIT TEST",
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
    role: [
      "I developed the visual direction and enclosure concept.",
      "I modeled the product form and intended internal stack.",
      "I created the material, lighting and render direction.",
      "I planned the transition from assembled object to exploded view.",
    ],
    development: [
      {
        title: "Silhouette",
        text: "The outer form is judged first as a compact wearable object before internal layers are introduced.",
      },
      {
        title: "Contact zone",
        text: "A softer interface is visually separated from the structural housing and electronics volume.",
      },
      {
        title: "Exploded story",
        text: "The assembly opens in a controlled order so each layer remains connected to its role in the concept.",
      },
    ],
    details: [
      { label: "Case type", value: "Visualization + motion" },
      { label: "Primary output", value: "Renders + exploded sequence" },
      { label: "Product status", value: "Concept" },
      { label: "Emphasis", value: "Form, light, materials, story" },
      { label: "Not claimed", value: "Medical or mechanical validation" },
      { label: "Media pending", value: "Final animation export" },
    ],
    result:
      "The work defines a concise visual language for a technically informed wearable concept without presenting it as a tested device.",
    nextStep:
      "Complete the final render set and export a silent, captioned product sequence.",
    evidence: {
      verified: ["Form study", "Material direction", "Motion structure"],
      next: ["Final renders", "Exploded animation"],
    },
    visualLabel: "VISUALIZATION CONCEPT / MOTION PLAN",
    visualRatio: "9:16 + 16:9 / FINAL MEDIA",
    tone: "violet",
  },
];

export const projectIndex: ProjectIndexEntry[] = [
  ...projects.map((project) => ({
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
    title: "Handheld Media Player",
    category: "PRODUCT / MECHANICAL",
    year: "2026",
    status: "Case in development",
  },
  {
    key: "photogrammetry",
    number: "06",
    title: "Photogrammetry Study",
    category: "RECONSTRUCTION",
    year: "2026",
    status: "Capture in progress",
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
