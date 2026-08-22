import { publicPath } from "@/lib/public-path";

export const PROJECT_KEYS = [
  "copet-pilot",
  "smartmotion",
  "modular-system",
  "concussion-screening",
  "eeg-wearable",
  "handheld-media",
  "mri-segmentation",
  "eeg-seizure-prediction",
  "hybrid-eeg-speller",
  "eeg-gcs-assessment",
] as const;

export type ProjectKey = (typeof PROJECT_KEYS)[number];
export type ProjectCategory =
  | "PRODUCT / MECHANICAL"
  | "EMBEDDED HARDWARE"
  | "VISUALIZATION / MOTION"
  | "APPLIED COMPUTATION";

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

export type ResearchProject = {
  key: ProjectKey;
  number: string;
  title: string;
  summary: string;
  metric: string;
  metricLabel: string;
  tools: string[];
  image: ProjectImage;
  href: string;
};

export type VisualStudy = {
  key: string;
  number: string;
  title: string;
  discipline: string;
  description: string;
  layout: "wide" | "square" | "portrait";
  image?: ProjectImage;
  video?: ProjectVideo;
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
    key: "concussion-screening",
    number: "04",
    title: "AI Concussion Screening Device",
    shortTitle: "Concussion Screen",
    strapline:
      "A compact vision system that turns eye capture and five screening models into one operator flow.",
    category: "APPLIED COMPUTATION",
    categories: ["APPLIED COMPUTATION", "PRODUCT / MECHANICAL"],
    year: "2026",
    status: "Functional prototype",
    tools: ["Orange Pi", "IR camera", "Python", "Computer vision", "ML", "Blender"],
    overview:
      "This prototype connects an Orange Pi, infrared eye capture, five analysis models and a guided operator interface. The enclosure render describes the intended physical product while the repository documents the working capture and inference pipeline. It is a screening research prototype, not a clinical diagnostic device.",
    role: [
      "I connected the physical device concept to the computer-vision pipeline.",
      "I structured the capture, inference and operator flow.",
      "I integrated five model outputs into a single screening sequence.",
      "I modeled and rendered the enclosure direction.",
    ],
    development: [
      {
        title: "Capture hardware",
        text: "An Orange Pi and IR camera establish a compact acquisition path for controlled eye imaging.",
      },
      {
        title: "Inference stack",
        text: "Five model outputs are orchestrated as one screening pipeline instead of isolated notebook results.",
      },
      {
        title: "Operator flow",
        text: "The interface guides capture and makes model status legible during a session.",
      },
      {
        title: "Product direction",
        text: "The CAD/render pass translates the electronics and camera constraints into a compact desktop device.",
      },
    ],
    details: [
      { label: "Compute", value: "Orange Pi" },
      { label: "Capture", value: "Infrared eye camera" },
      { label: "Analysis", value: "5 model outputs" },
      { label: "Pipeline", value: "Capture → inference → result" },
      { label: "Interface", value: "Guided operator workflow" },
      { label: "Scope", value: "Research screening prototype" },
    ],
    result:
      "The project demonstrates an end-to-end path from physical eye capture to a combined machine-learning result and operator-facing interface.",
    nextStep:
      "Calibrate capture conditions, publish evaluation details and build the next enclosure around a measured camera geometry.",
    evidence: {
      verified: ["Eye capture", "Five-model pipeline", "Device concept"],
      next: ["Larger evaluation", "Calibration protocol", "Integrated enclosure"],
    },
    visualLabel: "DEVICE RENDER + REAL CAPTURE OUTPUT",
    visualRatio: "PRODUCT DIRECTION / SYSTEM EVIDENCE",
    actualImage: {
      src: publicPath("/media/concussion/device-render.webp"),
      alt: "White compact concussion screening device concept rendered on a dark background.",
      width: 2560,
      height: 1440,
      label: "Enclosure direction",
    },
    supportingImage: {
      src: publicPath("/media/concussion/eye-capture.webp"),
      alt: "Infrared eye capture interface from the working concussion screening pipeline.",
      width: 724,
      height: 350,
      label: "IR capture output",
    },
    source: {
      label: "View system repository",
      href: "https://github.com/Godcomplexx/AI-based-Concussion-Screening-Device",
    },
    tone: "violet",
  },
  {
    key: "eeg-wearable",
    number: "05",
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
    development: [],
    details: [],
    result:
      "The work defines a concise visual language for a technically informed wearable concept without presenting it as a tested device.",
    nextStep: "Refine lighting, pacing and the captioned presentation export.",
    evidence: {
      verified: ["Form study", "Material direction", "Exploded sequence"],
      next: ["Final render polish", "Captioned export"],
    },
    visualLabel: "VISUALIZATION CONCEPT / MOTION",
    visualRatio: "00:26 / 9:16",
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
  ["copet-pilot", "smartmotion", "modular-system", "concussion-screening"].includes(
    project.key,
  ),
);

export const researchProjects: ResearchProject[] = [
  {
    key: "mri-segmentation",
    number: "07",
    title: "Medical Image Segmentation",
    summary:
      "A containerized MRI processing platform with queued jobs, service boundaries and a lesion-analysis cascade.",
    metric: "11",
    metricLabel: "service containers",
    tools: ["FastAPI", "React", "PostgreSQL", "RabbitMQ", "Celery", "FastSurfer"],
    image: {
      src: publicPath("/media/research/mri-architecture.webp"),
      alt: "Service architecture diagram for the medical image segmentation platform.",
      width: 819,
      height: 496,
    },
    href: "https://github.com/Godcomplexx/Medical-Image-Segmentation",
  },
  {
    key: "eeg-seizure-prediction",
    number: "08",
    title: "EEG Seizure Prediction",
    summary:
      "A CNN–LSTM research pipeline for patient-independent EEG seizure prediction and transfer learning.",
    metric: "86.5%",
    metricLabel: "sensitivity on unseen patients",
    tools: ["Python", "PyTorch", "CNN–LSTM", "EEG", "Transfer learning"],
    image: {
      src: publicPath("/media/research/seizure-confusion.webp"),
      alt: "Confusion matrix from the EEG seizure prediction evaluation.",
      width: 914,
      height: 828,
    },
    href: "https://github.com/Godcomplexx/epilepsy",
  },
  {
    key: "hybrid-eeg-speller",
    number: "09",
    title: "Hybrid EEG Speller",
    summary:
      "A P300 spelling interface that combines EEG selection with language-model assistance and timing analysis.",
    metric: "06",
    metricLabel: "participants in the study",
    tools: ["P300", "EEG", "Python", "LLM assistance", "Experiment design"],
    image: {
      src: publicPath("/media/research/hybrid-eeg.webp"),
      alt: "Metrics dashboard for the hybrid P300 and language-model EEG speller study.",
      width: 1400,
      height: 847,
    },
    href: "https://github.com/Godcomplexx/Hybrid-EEG-Speller-P300-LLM-",
  },
  {
    key: "eeg-gcs-assessment",
    number: "10",
    title: "EEG Consciousness Assessment",
    summary:
      "An EEG feature-analysis study for three-class consciousness assessment against Glasgow Coma Scale labels.",
    metric: "76.2%",
    metricLabel: "best three-class accuracy",
    tools: ["EEG", "Python", "Feature analysis", "GCS", "Classification"],
    image: {
      src: publicPath("/media/research/gcs-heatmap.webp"),
      alt: "EEG feature correlation heatmap from the GCS consciousness assessment study.",
      width: 1000,
      height: 800,
    },
    href: "https://github.com/Godcomplexx/EEG-based-Consciousness-Assessment-GCS-",
  },
];

export const visualStudies: VisualStudy[] = [
  {
    key: "eeg",
    number: "05",
    title: "Wearable EEG",
    discipline: "PRODUCT MOTION / EXPLODED STORY",
    description:
      "A compact form, contact layer and intended electronics stack explained as one restrained vertical sequence.",
    layout: "portrait",
    video: projects.find((project) => project.key === "eeg-wearable")?.processVideo,
  },
  {
    key: "handheld",
    number: "06",
    title: "Handheld Media Object",
    discipline: "HARD-SURFACE / PRODUCT RENDER",
    description:
      "A stylized handheld device study focused on silhouette, controls, color blocking and presentation.",
    layout: "square",
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
    layout: "square",
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
    layout: "square",
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
    layout: "wide",
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
    layout: "square",
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
  { value: "02", label: "working embedded systems" },
  { value: "04", label: "biomedical AI research cases" },
] as const;

export const toolGroups = [
  {
    title: "CAD + physical form",
    tools: ["SolidWorks", "Plasticity", "Blender", "3D printing"],
  },
  {
    title: "Embedded systems",
    tools: ["ESP32", "ESP-IDF", "Zephyr", "C / C++", "BLE", "I²C"],
  },
  {
    title: "Applied computation",
    tools: ["Python", "PyTorch", "FastAPI", "Computer vision", "EEG / MRI"],
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
    key: "eeg-wearable",
    number: "05",
    title: "Wearable EEG",
    category: "VISUALIZATION / MOTION",
    year: "2026",
    status: "Concept film",
    href: "#visual-lab-eeg",
  },
  {
    key: "handheld-media",
    number: "06",
    title: "Handheld Media Object",
    category: "VISUALIZATION / MOTION",
    year: "2026",
    status: "Render study",
    href: "#visual-lab-handheld",
  },
  ...researchProjects.map((project) => ({
    key: project.key,
    number: project.number,
    title: project.title,
    category: "APPLIED COMPUTATION" as const,
    year: "2026",
    status: "Research code",
    href: `#research-${project.key}`,
  })),
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
