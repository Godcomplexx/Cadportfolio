export const PROJECT_KEYS = [
  "smartmotion",
  "modular-system",
  "eeg-wearable",
  "photogrammetry",
] as const;

export type ProjectKey = (typeof PROJECT_KEYS)[number];
export type ProjectCategory =
  | "Product & CAD"
  | "3D & Motion"
  | "Hardware"
  | "Reconstruction";

export type Project = {
  key: ProjectKey;
  number: string;
  title: string;
  shortTitle: string;
  strapline: string;
  category: ProjectCategory;
  categories: ProjectCategory[];
  year: string;
  status: "Concept" | "Prototype" | "Working prototype" | "In progress";
  tools: string[];
  overview: string;
  role: string[];
  development: { title: string; text: string }[];
  details: { label: string; value: string }[];
  result: string;
  nextStep: string;
  visualLabel: string;
  visualRatio: string;
  actualImage?: string;
  actualImageAlt?: string;
  source?: { label: string; href: string };
  tone: "coral" | "blue" | "sage" | "violet";
};

export const projects: Project[] = [
  {
    key: "smartmotion",
    number: "01",
    title: "SmartMotion Keychain",
    shortTitle: "SmartMotion",
    strapline:
      "A motion-reactive ESP32-C3 keychain that turns movement into a small physical interface.",
    category: "Hardware",
    categories: ["Hardware", "Product & CAD"],
    year: "2026",
    status: "Working prototype",
    tools: ["ESP-IDF", "ESP32-C3", "MPU-6050", "OLED", "BLE", "Android"],
    overview:
      "SmartMotion began as a Tamagotchi-like keychain: a compact object that reacts to movement, sleeps when still, wakes when picked up and can become a tilt-controlled game. The working electronics combine an ESP32-C3, a 0.96-inch OLED, an MPU-6050 and a LiPo power system. The current enclosure direction is a concept shell; assembled-product photography will replace the visual placeholder after enclosure integration.",
    role: [
      "I developed the product concept and interaction modes.",
      "I structured and implemented the ESP-IDF firmware.",
      "I integrated motion sensing, OLED rendering and on-demand BLE.",
      "I built the Android time-sync companion flow.",
      "I am iterating the enclosure direction around the real component stack.",
    ],
    development: [
      {
        title: "Behavior first",
        text: "FLUID, SLEEP, TIME and GAME modes define what the object needs to communicate before the shell is finalized.",
      },
      {
        title: "Hardware stack",
        text: "The ESP32-C3, OLED and MPU-6050 share a compact I²C-centered architecture with a motion interrupt for wake-up.",
      },
      {
        title: "Low-power logic",
        text: "Inactivity dims the animation, turns off the OLED and leaves the motion sensor as the wake source.",
      },
      {
        title: "Enclosure iteration",
        text: "The next CAD pass will reduce thickness, retain components more clearly and prepare the shell for repeatable printing.",
      },
    ],
    details: [
      { label: "Controller", value: "ESP32-C3 Super Mini" },
      { label: "Display", value: "0.96″ · 128×64 OLED" },
      { label: "Sensor", value: "MPU-6050 accelerometer / gyroscope" },
      { label: "Bus", value: "Shared 200 kHz I²C" },
      { label: "Interaction", value: "Tilt, movement and triple-shake" },
      { label: "Connectivity", value: "On-demand BLE GATT" },
    ],
    result:
      "The firmware, companion app and electronics operate as a connected prototype. Motion controls the interface and Breakout game; a triple shake opens a short BLE synchronization window; inactivity transitions the device into lower-power states.",
    nextStep:
      "Integrate the assembled electronics into the next enclosure iteration and measure battery current with USB disconnected.",
    visualLabel: "CONCEPT RENDER / ENCLOSURE DIRECTION",
    visualRatio: "1:1 / SOURCE IMAGE",
    actualImage: "/media/smartmotion-prototype.webp",
    actualImageAlt:
      "Green organic SmartMotion keychain enclosure concept suspended from a metal clip against a cloudy sky.",
    source: {
      label: "View firmware and hardware documentation",
      href: "https://github.com/Godcomplexx/Keychain_motion",
    },
    tone: "coral",
  },
  {
    key: "modular-system",
    number: "02",
    title: "Modular Mechanical System",
    shortTitle: "Modular System",
    strapline:
      "A hard-surface CAD study built around repeatable interfaces and readable assembly logic.",
    category: "Product & CAD",
    categories: ["Product & CAD"],
    year: "2025",
    status: "Prototype",
    tools: ["SolidWorks", "Plasticity", "Blender", "3D printing"],
    overview:
      "This study explores how differently sized housings can share one construction language. Openings, mounting surfaces and repeated details are treated as a system rather than as isolated forms. The project is presented as a CAD and assembly study—not as a manufactured product—and the next content pass will add verified dimensions, drawings and fit-test evidence.",
    role: [
      "I built the hard-surface CAD components.",
      "I developed the repeated openings and interface language.",
      "I organized the assembly hierarchy and exploded presentation.",
      "I prepared the current concept for prototype evaluation.",
    ],
    development: [
      {
        title: "Shared language",
        text: "A small family of recurring radii, seams and openings keeps differently sized modules visually related.",
      },
      {
        title: "Interface logic",
        text: "Mounting surfaces and connection points are separated from the outer form so they can evolve independently.",
      },
      {
        title: "Assembly view",
        text: "The exploded sequence shows part order and interface ownership without filling the page with redundant screenshots.",
      },
    ],
    details: [
      { label: "System", value: "Repeated housing family" },
      { label: "Focus", value: "Interfaces, openings, hierarchy" },
      { label: "Output", value: "CAD assembly + exploded view" },
      { label: "Status", value: "Prototype study" },
      { label: "Evidence pending", value: "Dimensions + fit testing" },
      { label: "Method", value: "Additive prototype evaluation" },
    ],
    result:
      "The study produced a coherent part family and a legible assembly hierarchy. It demonstrates controlled hard-surface modeling and modular thinking while remaining explicit about what has not yet been physically verified.",
    nextStep:
      "Publish the dimensioned drawings, joint close-ups and one repeatable physical fit test.",
    visualLabel: "PROJECT VISUAL / EXPLODED ASSEMBLY",
    visualRatio: "16:10 / FINAL RENDER",
    tone: "blue",
  },
  {
    key: "eeg-wearable",
    number: "03",
    title: "Wearable EEG",
    shortTitle: "EEG Wearable",
    strapline:
      "A product visualization study that moves from soft external form to internal architecture.",
    category: "3D & Motion",
    categories: ["3D & Motion", "Product & CAD"],
    year: "2026",
    status: "Concept",
    tools: ["Blender", "Plasticity", "Lighting", "Animation", "Compositing"],
    overview:
      "The EEG wearable case focuses on communication: how an external product form, contact interface and internal electronics can be explained in one concise visual sequence. It is a concept and motion study, not a validated medical device. The case is structured to separate beauty rendering from technical explanation and to make the intended product story readable without a 3D application interface.",
    role: [
      "I developed the enclosure concept and component arrangement.",
      "I modeled the product form and internal stack.",
      "I created the materials, lighting and final render direction.",
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
        text: "The assembly opens in a controlled order so each layer remains connected to its role in the object.",
      },
      {
        title: "Motion edit",
        text: "A short product-film structure connects exterior, internal architecture and material detail.",
      },
    ],
    details: [
      { label: "Case type", value: "Product visualization + motion" },
      { label: "Primary output", value: "Clean renders + exploded sequence" },
      { label: "Product status", value: "Concept" },
      { label: "Emphasis", value: "Form, light, materials, story" },
      { label: "Not claimed", value: "Medical validation" },
      { label: "Media pending", value: "Final animation export" },
    ],
    result:
      "The case establishes a clear visual language for presenting a technically informed wearable concept. Final high-resolution renders and the motion export will replace the current proportion-accurate placeholders.",
    nextStep:
      "Complete the final render set and export a silent, captioned MP4/WebM product sequence.",
    visualLabel: "PROJECT VISUAL / PRODUCT MOTION",
    visualRatio: "9:16 + 16:9 / FINAL MEDIA",
    tone: "violet",
  },
  {
    key: "photogrammetry",
    number: "04",
    title: "Photogrammetry Study",
    shortTitle: "Reconstruction",
    strapline:
      "A documented capture-to-clean-mesh workflow prepared as a dedicated reconstruction case.",
    category: "Reconstruction",
    categories: ["Reconstruction", "3D & Motion"],
    year: "2026",
    status: "In progress",
    tools: ["Photogrammetry", "Mesh cleanup", "Retopology", "UV", "Texturing"],
    overview:
      "This case is intentionally marked in progress. Its structure is ready for a complete reconstruction study: capture plan, aligned images, point cloud, high-poly mesh, error review, cleanup, UVs, texture and final comparison. No scan quality, polygon count or reconstruction result is claimed until the source set and final model are available.",
    role: [
      "I am defining the capture and documentation workflow.",
      "I will perform alignment, mesh cleanup and optimization.",
      "I will prepare UVs, texture and the final comparison.",
      "I will publish source counts and polygon data with the finished case.",
    ],
    development: [
      {
        title: "Capture",
        text: "The final case will document the object, lighting, coverage plan and the complete 50–150 image source set.",
      },
      {
        title: "Reconstruction",
        text: "Alignment, point cloud and high-poly mesh stages will be shown as evidence, not hidden behind a final render.",
      },
      {
        title: "Cleanup",
        text: "Artifacts, topology decisions, UV layout and optimization will be compared before and after.",
      },
      {
        title: "Delivery",
        text: "The finished page will include model scale, polygon counts, texture size and a source-to-result comparison.",
      },
    ],
    details: [
      { label: "Status", value: "In progress" },
      { label: "Capture target", value: "50–150 photographs" },
      { label: "Required evidence", value: "Cloud · mesh · cleanup · UV" },
      { label: "Final comparison", value: "Object / source / model" },
      { label: "Metrics", value: "To be measured" },
      { label: "Media", value: "Not yet published" },
    ],
    result:
      "The information architecture is complete, but the reconstruction is not presented as finished. This protects the portfolio from overstating an unverified result.",
    nextStep:
      "Select the physical subject, complete the controlled capture and replace every placeholder with measured process evidence.",
    visualLabel: "PROJECT VISUAL / CAPTURE → CLEAN MESH",
    visualRatio: "16:9 / PROCESS COMPARISON",
    tone: "sage",
  },
];

export const projectByKey = Object.fromEntries(
  projects.map((project) => [project.key, project]),
) as Record<ProjectKey, Project>;

export function isProjectKey(value: unknown): value is ProjectKey {
  return (
    typeof value === "string" &&
    (PROJECT_KEYS as readonly string[]).includes(value)
  );
}
