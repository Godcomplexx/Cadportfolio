"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { publicPath } from "@/lib/public-path";

const MODEL_URL = publicPath("/media/cad-hero/cad-hero.glb");

/**
 * The model ships with lighting baked into its base colour textures, so scene
 * lights are kept minimal — they would otherwise double up on the shading that
 * is already painted in.
 */
const LIGHTING_IS_BAKED = true;

/**
 * When true, materials authored in Blender are kept exactly as exported and
 * only the screen is swapped for the live canvas texture. Set this for models
 * that already carry their own colours and textures.
 *
 * When false, the legacy behaviour applies: source materials are replaced with
 * the generated pastel palette.
 */
const KEEP_AUTHORED_MATERIALS = true;

/**
 * The exported model already renders its own screen artwork, so the generated
 * canvas texture is not substituted in. Set true to drive the display from the
 * live canvas instead.
 */
const REPLACE_SCREEN_TEXTURE = false;

type SceneState = "loading" | "ready" | "error";

function isScreenName(name: string) {
  const normalized = name.toLowerCase();
  return (
    normalized.includes("screen") ||
    normalized.includes("display") ||
    normalized.includes("monitor")
  );
}

function createScreenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#31c8f0");
    gradient.addColorStop(0.56, "#8ee5d0");
    gradient.addColorStop(1, "#b8db79");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(255,255,255,0.74)";
    context.beginPath();
    context.arc(760, 120, 92, 0, Math.PI * 2);
    context.arc(850, 150, 120, 0, Math.PI * 2);
    context.arc(660, 150, 72, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#eef2ef";
    context.strokeStyle = "#26334b";
    context.lineWidth = 12;
    context.fillRect(236, 168, 610, 420);
    context.strokeRect(236, 168, 610, 420);

    context.fillStyle = "#2c3342";
    context.fillRect(236, 168, 610, 54);
    context.fillStyle = "#ff745f";
    context.beginPath();
    context.arc(274, 195, 12, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffd45d";
    context.beginPath();
    context.arc(312, 195, 12, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#7ce29a";
    context.beginPath();
    context.arc(350, 195, 12, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";
    context.fillRect(270, 256, 530, 276);
    context.fillStyle = "#212842";
    context.font = "700 58px Geist Mono, monospace";
    context.fillText("HELLO, I'M", 316, 344);
    context.font = "500 96px STIX Two Text, serif";
    context.fillText("Daria", 316, 442);
    context.font = "600 28px Geist Mono, monospace";
    context.fillStyle = "#5a6182";
    context.fillText("CAD  /  3D  /  PROTOTYPES", 316, 492);

    context.fillStyle = "#5577f2";
    context.fillRect(52, 112, 112, 112);
    context.fillStyle = "#ff5f95";
    context.fillRect(72, 254, 72, 72);
    context.fillStyle = "#c7e650";
    context.beginPath();
    context.arc(108, 414, 50, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#865cf3";
    context.fillRect(66, 514, 84, 84);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function disposeMaterial(material: THREE.Material) {
  const textured = material as THREE.Material & {
    map?: THREE.Texture | null;
    emissiveMap?: THREE.Texture | null;
  };
  textured.map?.dispose();
  textured.emissiveMap?.dispose();
  material.dispose();
}

function pastelMaterial(
  color: THREE.ColorRepresentation,
  options: Partial<THREE.MeshStandardMaterialParameters> = {},
) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.04,
    roughness: 0.48,
    ...options,
  });
}

export function CadHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneState, setSceneState] = useState<SceneState>("loading");
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationFrame = 0;
    let visible = true;
    let renderer: THREE.WebGLRenderer;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const liteMode =
      coarsePointer || document.documentElement.classList.contains("perf-lite");
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const clock = new THREE.Clock();

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !liteMode,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setSceneState("error"));
      return;
    }

    renderer.domElement.className = "cad-hero-scene__canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = LIGHTING_IS_BAKED ? 1 : 0.82;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !liteMode;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(8.2, 1.6, 7.4);
    camera.lookAt(0, -0.35, 0);

    // The model uses transmission and clearcoat, which need an environment to
    // reflect and refract — without one they render flat black.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envSource = new THREE.Scene();
    envSource.background = new THREE.Color(0x2c3648);
    const envGlow = new THREE.Mesh(
      new THREE.SphereGeometry(8, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x8f9bb5, side: THREE.BackSide }),
    );
    envSource.add(envGlow);
    const envTarget = pmrem.fromScene(envSource, 0.05);
    scene.environment = envTarget.texture;

    // Low fill so the key light can carve out shadow: the render has a wide
    // range from lit top (~194) to shadowed side (~53).
    // Baked models carry their own shading; scene lights only lift them enough
    // to sit in the page's blue environment.
    scene.add(
      new THREE.HemisphereLight(
        0xc9d8f5,
        0x0a0c12,
        LIGHTING_IS_BAKED ? 0.12 : 0.32,
      ),
    );
    scene.add(
      new THREE.AmbientLight(0xffffff, LIGHTING_IS_BAKED ? 1.35 : 0.06),
    );

    // Single dominant key from above and slightly left, matching the render:
    // the top face reads bright while the right flank falls into shadow.
    const keyLight = new THREE.DirectionalLight(
      0xfff6ec,
      LIGHTING_IS_BAKED ? 0.25 : 2.9,
    );
    keyLight.position.set(-3.5, 11, 5.5);
    keyLight.castShadow = !liteMode && !LIGHTING_IS_BAKED;
    keyLight.shadow.mapSize.set(liteMode ? 512 : 1024, liteMode ? 512 : 1024);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -7;
    scene.add(keyLight);

    // Faint rims for separation from the blue page — kept low so they do not
    // fill the shadow side back in.
    const blueRim = new THREE.PointLight(0x5db9ff, LIGHTING_IS_BAKED ? 2 : 6, 18, 2);
    blueRim.position.set(6, 3, -3);
    scene.add(blueRim);

    const pinkRim = new THREE.PointLight(0xff70c6, LIGHTING_IS_BAKED ? 1 : 3.5, 16, 2);
    pinkRim.position.set(-5, 0, 4);
    scene.add(pinkRim);

    const stage = new THREE.Group();
    const stageObjects = new THREE.Group();
    const computerGroup = new THREE.Group();
    stage.add(stageObjects, computerGroup);
    scene.add(stage);

    // The authored model carries its own plinth, keys and casing, so no
    // primitive stand-ins are built here.

    const screenTexture = createScreenTexture();
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach(disposeMaterial);
          });
          return;
        }

        let materialIndex = 0;
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Light) {
            object.visible = false;
            return;
          }
          if (!(object instanceof THREE.Mesh)) return;

          const sourceMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          // The legacy model shipped a stray backdrop box named "Cube".
          if (!KEEP_AUTHORED_MATERIALS && object.name === "Cube") {
            object.visible = false;
            sourceMaterials.forEach((material) => material.dispose());
            return;
          }
          // In the authored model "display.002" is a casing panel carrying the
          // cat decal, not the screen — name matching alone would clobber it.
          const screenObject =
            !LIGHTING_IS_BAKED &&
            (isScreenName(object.name) ||
              sourceMaterials.some((material) => isScreenName(material.name)));

          // Authored models keep their own look; only the screen is replaced.
          if (KEEP_AUTHORED_MATERIALS) {
            // Blender's procedural "dust" maps bake out fully black (or as a
            // magenta mask), which multiplies the base colour down to nothing.
            // Drop them and keep the material's own colour.
            sourceMaterials.forEach((material) => {
              const m = material as THREE.MeshStandardMaterial;
              // Only the pre-bake export needed the black "dust" maps stripped;
              // baked textures are the shading and must be kept.
              const dusty =
                !LIGHTING_IS_BAKED &&
                (/dust/i.test(m.map?.name ?? "") ||
                  /off white plastic|plastic blue$/i.test(m.name));
              if (dusty && m.map) {
                m.map = null;
              }
              // Keep the environment as a subtle sheen only, so the directional
              // key light defines the form instead of flat ambient bounce.
              m.envMapIntensity = LIGHTING_IS_BAKED ? 0.12 : 0.3;
              // Blender's "nacre"/"glossy" presets export as semi-metallic,
              // which samples the environment evenly and flattens the form.
              // Dialling metalness down lets the key light shade the surfaces.
              if (!LIGHTING_IS_BAKED && m.metalness !== undefined && m.metalness > 0.15) {
                m.metalness = 0.08;
              }
              m.needsUpdate = true;
            });

            if (screenObject && REPLACE_SCREEN_TEXTURE) {
              const screenMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.62,
                emissiveMap: screenTexture,
                map: screenTexture,
                metalness: 0,
                roughness: 0.48,
                toneMapped: false,
              });
              sourceMaterials.forEach((material) => material.dispose());
              object.material = screenMaterial;
            }
            object.castShadow = true;
            object.receiveShadow = true;
            return;
          }

          const nextMaterials = sourceMaterials.map((sourceMaterial) => {
            const screen =
              screenObject || isScreenName(sourceMaterial.name);
            sourceMaterial.dispose();

            if (screen) {
              const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.62,
                emissiveMap: screenTexture,
                map: screenTexture,
                metalness: 0,
                roughness: 0.48,
                toneMapped: false,
              });
              return material;
            }

            const materialName = sourceMaterial.name.toLowerCase();
            const materialColor = materialName.includes("button.001")
              ? 0xffd357
              : materialName.includes("button")
                ? 0xff637d
                : materialName.includes("screw")
                  ? 0x40538c
                  : materialIndex % 2 === 0
                    ? 0x7188e2
                    : 0x91a5f2;
            const material = pastelMaterial(
              materialColor,
              {
                roughness: materialIndex % 3 === 0 ? 0.38 : 0.52,
                metalness: 0.06,
              },
            );
            materialIndex += 1;
            return material;
          });

          object.material = Array.isArray(object.material)
            ? nextMaterials
            : nextMaterials[0];
          object.castShadow = true;
          object.receiveShadow = true;
        });

        gltf.scene.updateMatrixWorld(true);
        const bounds = new THREE.Box3();
        gltf.scene.traverse((object) => {
          if (
            object instanceof THREE.Mesh &&
            object.visible &&
            object.name !== "Cube"
          ) {
            bounds.expandByObject(object);
          }
        });
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        // The authored model includes its own plinth, so it fills more width.
        const targetWidth = 6.4;
        const modelScale = targetWidth / Math.max(size.x, 0.001);

        gltf.scene.scale.setScalar(modelScale);
        gltf.scene.position.copy(center).multiplyScalar(-modelScale);
        // Turn the front face toward the camera, which sits off to the right.
        gltf.scene.rotation.y = 0.62;
        computerGroup.add(gltf.scene);
        computerGroup.position.set(0.12, 0.18, 0.16);
        setLoadProgress(100);
        setSceneState("ready");
        renderer.render(scene, camera);
      },
      (event) => {
        if (disposed || !event.lengthComputable) return;
        setLoadProgress(Math.round((event.loaded / event.total) * 100));
      },
      () => {
        if (disposed) return;
        setSceneState("error");
        renderer.render(scene, camera);
      },
    );

    const renderScene = () => renderer.render(scene, camera);

    const animate = () => {
      if (disposed || !visible || reducedMotion) return;
      const elapsed = clock.getElapsedTime();
      pointerCurrent.lerp(pointerTarget, 0.075);

      // Roughly ±17° horizontally, ±8° vertically — enough to read as the
      // terminal turning to follow the cursor.
      stage.rotation.y = pointerCurrent.x * 0.3;
      stage.rotation.x = pointerCurrent.y * -0.14;
      computerGroup.position.y = 0.18 + Math.sin(elapsed * 0.72) * 0.055;
      computerGroup.rotation.y =
        -0.02 + Math.sin(elapsed * 0.37) * 0.012 + pointerCurrent.x * 0.018;

      renderScene();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      renderScene();
      if (reducedMotion || disposed || animationFrame) return;
      clock.start();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      clock.stop();
    };

    const resize = () => {
      if (disposed) return;
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const mobile = width <= 820;

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, liteMode ? 1.25 : 1.75),
      );
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = mobile ? 40 : 35;
      camera.position.set(
        mobile ? 10.6 : 8.2,
        mobile ? 2.4 : 1.6,
        mobile ? 10 : 7.4,
      );
      camera.lookAt(0, mobile ? -0.45 : -0.35, 0);
      camera.updateProjectionMatrix();

      stage.scale.setScalar(mobile ? 0.68 : 1);
      renderScene();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Tracked across the whole viewport, not just over the canvas, so the
    // terminal keeps following the cursor anywhere in the hero.
    const onPointerMove = (event: PointerEvent) => {
      if (coarsePointer || reducedMotion) return;
      pointerTarget.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        (event.clientY / window.innerHeight - 0.5) * 2,
      );
    };
    const onPointerLeave = () => pointerTarget.set(0, 0);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) startAnimation();
        else stopAnimation();
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(container);
    startAnimation();

    return () => {
      disposed = true;
      stopAnimation();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);

      const materials = new Set<THREE.Material>();
      const geometries = new Set<THREE.BufferGeometry>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        const objectMaterials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        objectMaterials.forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach(disposeMaterial);
      screenTexture.dispose();
      envGlow.geometry.dispose();
      (envGlow.material as THREE.Material).dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className={`cad-hero-scene cad-hero-scene--${sceneState}`}
      ref={containerRef}
    >
      <div className="cad-hero-scene__fallback" aria-hidden="true">
        <span />
        <i />
      </div>
      <p className="cad-hero-scene__status" role="status" aria-live="polite">
        {sceneState === "loading"
          ? `Building the 3D desk · ${String(loadProgress).padStart(2, "0")}%`
          : sceneState === "ready"
            ? "3D product desk ready"
            : "3D preview unavailable · portfolio remains accessible"}
      </p>
    </div>
  );
}
