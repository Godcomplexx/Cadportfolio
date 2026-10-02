import { publicPath } from "@/lib/public-path";

export const PROJECT_KEYS = [
  "concussion-screener",
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

/**
 * The three shelves the work is presented on. Every project — full case or
 * draft — belongs to exactly one of them.
 */
export type ProjectTrack = "work" | "personal" | "idea";

export const projectTracks: {
  key: ProjectTrack;
  code: string;
  title: string;
  kicker: string;
  description: string;
}[] = [
  {
    key: "work",
    code: "A",
    title: "Work projects",
    kicker: "Built with a team / lab",
    description:
      "Projects developed inside a team, with real users and real constraints. Each case states exactly which part was mine.",
  },
  {
    key: "personal",
    code: "B",
    title: "Personal projects",
    kicker: "Self-initiated builds",
    description:
      "Things I wanted to exist, so I built them — from the first sketch to a working prototype on my desk.",
  },
  {
    key: "idea",
    code: "C",
    title: "Ideas & concepts",
    kicker: "Not built yet — on purpose",
    description:
      "Directions explored through renders, motion and system design before committing to hardware.",
  },
];

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

/** One step of the build story, optionally illustrated with a process image. */
export type ProjectStep = {
  title: string;
  text: string;
  image?: ProjectImage;
};

export type Project = {
  key: ProjectKey;
  track: ProjectTrack;
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
  /** 01 — what was wrong or missing, and for whom. */
  problem: string;
  /** 02 — the idea and the solution that came out of it. */
  solution: string;
  /** Scope and honest limits of what was built. */
  overview: string;
  role: string[];
  /** 03 — how it was built, step by step. */
  development: ProjectStep[];
  details: { label: string; value: string }[];
  /** 04 — what works now. */
  result: string;
  /** 05 — lessons taken from the build. */
  learned: string[];
  nextStep: string;
  evidence: { verified: string[]; next: string[] };
  visualLabel: string;
  visualRatio: string;
  actualImage?: ProjectImage;
  supportingImage?: ProjectImage;
  /**
   * A set of images shown as one advancing frame instead of a static pair.
   * Takes precedence over actualImage / supportingImage when present.
   */
  carousel?: ProjectImage[];
  processVideo?: ProjectVideo;
  source?: { label: string; href: string };
  tone: "coral" | "blue" | "sage" | "violet";
};

/**
 * A project that is real but not yet written up as a full case: no final
 * images or process photos yet. It is shown as a compact card with an image
 * placeholder, and promoted to `projects` once the material is ready.
 */
export type ProjectDraft = {
  key: string;
  track: ProjectTrack;
  number: string;
  title: string;
  year: string;
  status: string;
  problem: string;
  solution: string;
  tools: string[];
  /** What the missing image should show — printed inside the placeholder. */
  imageNote: string;
  image?: ProjectImage;
  source?: { label: string; href: string };
};

export type ProjectIndexEntry = {
  key: string;
  track: ProjectTrack;
  number: string;
  title: string;
  category: string;
  year: string;
  status: string;
  href: string;
  external?: boolean;
};

export const projects: Project[] = [
  {
    key: "concussion-screener",
    track: "work",
    number: "01",
    title: "AI Concussion Screener",
    shortTitle: "Concussion Screener",
    strapline:
      "A handheld eyepiece device that screens for concussion from a one-minute eye-tracking session — offline, at the point of injury.",
    category: "EMBEDDED HARDWARE",
    categories: ["EMBEDDED HARDWARE", "PRODUCT / MECHANICAL"],
    year: "2026",
    status: "Working prototype",
    tools: ["Orange Pi", "IR camera", "OpenCV", "PyTorch", "scikit-learn", "3D printing"],
    problem:
      "Concussion checks are slow and subjective — and rarely available on the sideline, where the first call is made.",
    solution:
      "Look into an eyepiece, press one button: an IR camera and five on-device models screen eye movement in a minute.",
    overview:
      "The capture protocol is fixed: a 3 s resting baseline, about 35 s of light flashes and 20 s of fixation. Every session is stored for later review. This is a screening prototype, not a certified diagnostic device.",
    role: [
      "I designed the system architecture across hardware, software and ML.",
      "I implemented the embedded state machine with camera, GPIO and LED control.",
      "I built the eye-tracking pipeline and trained and validated five models.",
      "I wrote the deployment layer: boot services, USB export and model updates.",
    ],
    development: [
      {
        title: "Define what to measure",
        text: "Pupil light reflex, fixation stability, smooth pursuit, saccades and random-shift tracking were chosen as measurable indicators and fixed into one timed capture sequence.",
      },
      {
        title: "Capture hardware",
        text: "An IR camera and IR LED array behind an eyepiece give a dark, repeatable view of the pupil, independent of room light. An Orange Pi handles capture and inference.",
        image: {
          src: publicPath("/media/concussion/ir-capture.webp"),
          alt: "Infrared camera frame of an eye captured through the device eyepiece.",
          width: 724,
          height: 350,
          label: "IR capture through the eyepiece",
        },
      },
      {
        title: "Signal to decision",
        text: "Eye detection and pupil tracking turn video into time series; outliers are removed and the data normalised before five classifiers — SVM, MLP, CNN, Naive Bayes and KNN — each judge one eye pattern.",
      },
      {
        title: "Enclosure",
        text: "The housing is modelled for 3D printing around the camera and eyepiece, the compute board, IR LEDs, status LEDs, start button, USB-C power and USB-A data port.",
      },
      {
        title: "Field-ready behaviour",
        text: "The device boots straight into a waiting state, protects itself from overheating, exports sessions to a USB drive and accepts new models the same way.",
      },
    ],
    details: [
      { label: "Compute", value: "Orange Pi · ARM64" },
      { label: "Sensor", value: "IR camera + IR LED array" },
      { label: "Session", value: "≈ 60 s, button to result" },
      { label: "Models", value: "5 classifiers, k-fold validated" },
      { label: "Output", value: "Green / red LED" },
      { label: "Network", value: "None — fully offline" },
    ],
    result:
      "Working offline prototype, ~60 s from button to result. Co-authored patent.",
    learned: [
      "Hardware starts from the measurement: the eyepiece, IR light and camera position exist to make one signal clean.",
      "A device for non-specialists needs one button and one unambiguous output — every extra state is a place to fail.",
      "Shipping embedded ML is mostly the unglamorous part: boot, heat, storage and updates took as long as the models.",
    ],
    nextStep:
      "Validate on a larger dataset and document the enclosure revision with section views and an assembly drawing.",
    evidence: {
      verified: ["Working device", "5 validated models", "Co-authored patent"],
      next: ["Larger dataset", "Enclosure drawings"],
    },
    visualLabel: "DEVICE RENDER + ENCLOSURE CAD",
    visualRatio: "2 VIEWS / BUILD EVIDENCE",
    carousel: [
      {
        src: publicPath("/media/concussion/device-render.webp"),
        alt: "Render of the cylindrical concussion screening device with a black eyepiece, status LEDs and a red start button.",
        width: 1600,
        height: 900,
        label: "Product render",
      },
      {
        src: publicPath("/media/concussion/enclosure-cad.webp"),
        alt: "CAD model of the 3D-printable device enclosure with eyepiece cone, mounting lugs and LED openings.",
        width: 1002,
        height: 779,
        label: "Enclosure CAD / for print",
      },
    ],
    source: {
      label: "View system documentation",
      href: "https://github.com/Godcomplexx/AI-based-Concussion-Screening-Device",
    },
    tone: "coral",
  },
  {
    key: "copet-pilot",
    track: "personal",
    number: "02",
    title: "CoPet Pilot",
    shortTitle: "CoPet Pilot",
    strapline:
      "A desk companion built as a working ESP32 interaction and electronics prototype.",
    category: "EMBEDDED HARDWARE",
    categories: ["EMBEDDED HARDWARE", "PRODUCT / MECHANICAL"],
    year: "2026",
    status: "Working prototype",
    tools: ["ESP32", "ST7789", "Sensors", "Audio", "C / C++"],
    problem:
      "Desk gadgets are either silent or one more screen demanding attention through an app.",
    solution:
      "An ESP32 companion that reacts to touch, motion and the room with a face, not notifications.",
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
      "Assembled prototype runs the full interface; 322 host checks pass.",
    learned: [
      "Bringing up one subsystem at a time, backed by host-side tests, made the final integration predictable.",
      "An open build is the best enclosure brief: it shows the real cable runs, component heights and service points before any CAD.",
      "Interaction only feels alive when it is fast — firmware structure mattered as much as the face animation.",
    ],
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
    track: "personal",
    number: "03",
    title: "SmartMotion Keychain",
    shortTitle: "SmartMotion",
    strapline:
      "A motion-reactive ESP32-C3 keychain that turns movement into a small physical interface.",
    category: "EMBEDDED HARDWARE",
    categories: ["EMBEDDED HARDWARE", "PRODUCT / MECHANICAL"],
    year: "2026",
    status: "Working prototype",
    tools: ["ESP-IDF", "ESP32-C3", "MPU-6050", "OLED", "BLE", "Android"],
    problem:
      "A keychain goes everywhere but does nothing — could it react to movement and still last on a tiny battery?",
    solution:
      "An ESP32-C3 keychain with OLED and motion sensor: animates on tilt, sleeps when still, plays a tilt game.",
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
      "Firmware, electronics and Android app work together; enclosure is the next pass.",
    learned: [
      "Designing the behaviour before the shell kept the form honest — the modes defined what the object had to be.",
      "Low power is a product feature: using the motion sensor as the wake source shaped both firmware and wiring.",
      "At keychain scale every millimetre is a decision, so the next enclosure starts from measured parts, not from the render.",
    ],
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
    track: "personal",
    number: "04",
    title: "SolidWorks Mechanical Foundations",
    shortTitle: "SolidWorks Study",
    strapline:
      "A documented CAD practice spanning parts, assemblies and production-style drawings.",
    category: "PRODUCT / MECHANICAL",
    categories: ["PRODUCT / MECHANICAL"],
    year: "2025—2026",
    status: "Documented study",
    tools: ["SolidWorks", "Part modeling", "Assemblies", "Drawings", "Design intent"],
    problem:
      "I could model shapes, but not documentation someone else could manufacture from.",
    solution:
      "A structured SolidWorks practice: parametric parts, constrained assemblies, linked drawings.",
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
      "32 native documents: 16 parts, 8 assemblies, 8 drawings.",
    learned: [
      "Design intent is decided in the first sketch: dimensioning to function makes later changes cheap.",
      "Assemblies expose mistakes that single parts hide — mates are a test of the geometry.",
      "A drawing is written for its reader: views, sections and tolerances are chosen for the person who has to make the part.",
    ],
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
    // Captured from the native SolidWorks documents in the study archive.
    carousel: [
      {
        src: publicPath("/media/solidworks/assembly-housing.webp"),
        alt: "SolidWorks assembly of a rounded gearbox housing with a bolted cover, two bores and mounting feet.",
        width: 1600,
        height: 852,
        label: "Housing assembly / SLDASM",
      },
      {
        src: publicPath("/media/solidworks/assembly-stand.webp"),
        alt: "SolidWorks assembly of a stand: a circular flanged base, two angled columns and a top bracket plate.",
        width: 1600,
        height: 852,
        label: "Stand assembly / SLDASM",
      },
      {
        src: publicPath("/media/solidworks/drawing-pipe.webp"),
        alt: "SolidWorks A4 drawing sheet of a pipe fitting with a sectioned view, toleranced diameters and two 2:1 detail views.",
        width: 651,
        height: 922,
        label: "Pipe drawing / SLDDRW",
      },
    ],
    tone: "sage",
  },
  {
    key: "eeg-wearable",
    track: "idea",
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
    problem:
      "Wearable neurotech is hard to explain — the important parts are hidden inside.",
    solution:
      "A 26-second film that explodes the earpiece layer by layer: shell, contacts, electronics.",
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
      "A clear visual language for the concept — presented as a concept, not a tested device.",
    learned: [
      "An exploded view needs an order: the sequence of separation is itself the explanation.",
      "Restrained materials and lighting keep attention on construction rather than surface.",
      "A concept should say it is a concept — the film communicates intent, not validation.",
    ],
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

const featuredProjectOrder = [
  "concussion-screener",
  "copet-pilot",
  "smartmotion",
  "modular-system",
  "eeg-wearable",
] as const;

export const featuredProjects = featuredProjectOrder
  .map((key) => projects.find((project) => project.key === key))
  .filter((project): project is Project => project !== undefined);

/**
 * Real projects still waiting for final images and a full write-up. Move one
 * into `projects` (with problem → solution → steps → result → learned) once
 * its photos and renders exist.
 */
export const projectDrafts: ProjectDraft[] = [
  {
    key: "neuro-mirror",
    track: "work",
    number: "W2",
    title: "Neuro Mirror",
    year: "2026",
    status: "Case study in progress",
    problem:
      "Cognitive tests like MoCA need a specialist to read, score and track every session.",
    solution:
      "A local voice app that runs and scores MoCA automatically, with explicit consent for recordings.",
    tools: ["Python", "GigaAM", "Ollama", "OpenCV", "rPPG"],
    imageNote: "Screens: voice test flow + cognitive profile",
    source: { label: "Source", href: "https://github.com/Godcomplexx/nero_mirro" },
  },
  {
    key: "finger-gym",
    track: "work",
    number: "W3",
    title: "Finger GYM",
    year: "2026",
    status: "Case study in progress",
    problem:
      "Hand fine-motor skills are judged by eye, so small changes go unnoticed.",
    solution:
      "A webcam test: MediaPipe tracks 21 hand points and turns exercises into a readiness score.",
    tools: ["Python", "MediaPipe", "OpenCV", "Ultraleap"],
    imageNote: "Photo: hand skeleton overlay during a test",
    source: { label: "Source", href: "https://github.com/Godcomplexx/Finger_GYM" },
  },
  {
    key: "nfc-image-writer",
    track: "personal",
    number: "P5",
    title: "NFC Image Writer",
    year: "2026",
    status: "Experiment",
    problem:
      "Updating a small display usually needs a cable, a radio and device firmware.",
    solution:
      "Tap a phone: a web page converts an image and writes it to an NFC-powered OLED.",
    tools: ["Web NFC", "ST25DV16K", "OLED 128 × 64", "JavaScript"],
    imageNote: "Photo: phone tapping the display, before / after",
    source: { label: "Source", href: "https://github.com/Godcomplexx/nfc_harvest_test" },
  },
  {
    key: "eink-oracle",
    track: "idea",
    number: "I2",
    title: "E-ink Oracle",
    year: "2026",
    status: "Concept · web version live",
    problem:
      "Every screen at home is an endless feed.",
    solution:
      "An e-ink object with one button: one image, one message a day, then it stops.",
    tools: ["XIAO ESP32-S3", "E-paper 3.7″", "Enclosure CAD"],
    imageNote: "Enclosure sketch + first render",
    source: { label: "Web version", href: "https://einkoracle.org/" },
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

export const projectIndex: ProjectIndexEntry[] = projectTracks.flatMap((track) => [
  ...featuredProjects
    .filter((project) => project.track === track.key)
    .map((project) => ({
      key: project.key,
      track: project.track,
      number: project.number,
      title: project.title,
      category: project.category,
      year: project.year,
      status: project.status,
      href: `#project-${project.key}`,
    })),
  ...projectDrafts
    .filter((draft) => draft.track === track.key)
    .map((draft) => ({
      key: draft.key,
      track: draft.track,
      number: draft.number,
      title: draft.title,
      category: draft.tools.slice(0, 2).join(" / ").toUpperCase(),
      year: draft.year,
      status: draft.status,
      href: `#draft-${draft.key}`,
    })),
]);

export const projectByKey = Object.fromEntries(
  projects.map((project) => [project.key, project]),
) as Partial<Record<ProjectKey, Project>>;

export function isProjectKey(value: unknown): value is ProjectKey {
  return (
    typeof value === "string" &&
    (PROJECT_KEYS as readonly string[]).includes(value)
  );
}
