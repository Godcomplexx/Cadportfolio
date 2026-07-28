"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const MODEL_URL = "/media/cad-hero/cube_tv.glb";
const SCREEN_URL = "/media/cad-hero/screen.webp";

type SceneState = "loading" | "ready" | "error";

type DustParticle = {
  factor: number;
  speed: number;
  time: number;
  x: number;
  y: number;
  z: number;
};

function isScreenName(name: string) {
  const normalized = name.toLowerCase();
  return (
    normalized.includes("screen") ||
    normalized.includes("display") ||
    normalized.includes("monitor")
  );
}

function disposeMaterial(material: THREE.Material) {
  const texturedMaterial = material as THREE.Material & {
    map?: THREE.Texture | null;
    emissiveMap?: THREE.Texture | null;
    normalMap?: THREE.Texture | null;
    roughnessMap?: THREE.Texture | null;
    metalnessMap?: THREE.Texture | null;
  };

  texturedMaterial.map?.dispose();
  texturedMaterial.emissiveMap?.dispose();
  texturedMaterial.normalMap?.dispose();
  texturedMaterial.roughnessMap?.dispose();
  texturedMaterial.metalnessMap?.dispose();
  material.dispose();
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
    let isVisible = true;
    let modelRoot: THREE.Object3D | null = null;
    let environmentTarget: THREE.WebGLRenderTarget | null = null;
    let screenTexture: THREE.Texture | null = null;
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
        antialias: !liteMode,
        alpha: false,
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
    renderer.toneMappingExposure = 1.24;
    renderer.setClearColor(0x0c0a0a, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0a0a);
    scene.fog = new THREE.FogExp2(0x130e0c, 0.016);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.position.set(15.497, 1.9224, 16.001);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    environmentTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = environmentTarget.texture;
    pmremGenerator.dispose();

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    scene.add(new THREE.AmbientLight(0xf2efe8, 0.08));

    const fireflyCanvas = document.createElement("canvas");
    fireflyCanvas.width = 64;
    fireflyCanvas.height = 64;
    const fireflyContext = fireflyCanvas.getContext("2d");

    if (fireflyContext) {
      const gradient = fireflyContext.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,245,1)");
      gradient.addColorStop(0.22, "rgba(255,250,210,0.98)");
      gradient.addColorStop(0.55, "rgba(210,255,155,0.36)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      fireflyContext.fillStyle = gradient;
      fireflyContext.fillRect(0, 0, 64, 64);
    }

    const fireflyTexture = new THREE.CanvasTexture(fireflyCanvas);
    fireflyTexture.colorSpace = THREE.SRGBColorSpace;
    const dustCount = reducedMotion ? 900 : liteMode ? 1500 : 4200;
    const dustParticles: DustParticle[] = Array.from(
      { length: dustCount },
      () => ({
        time: Math.random() * 100,
        factor: 5 + Math.random() * 14,
        speed: 0.001 + Math.random() * 0.0012,
        x: -20 + Math.random() * 40,
        y: -10.5 + Math.random() * 21,
        z: -14 + Math.random() * 28,
      }),
    );
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustColor = new THREE.Color();

    dustParticles.forEach((particle, index) => {
      dustPositions[index * 3] = particle.x;
      dustPositions[index * 3 + 1] = particle.y;
      dustPositions[index * 3 + 2] = particle.z;
      dustColor.setHSL(
        0.16 + Math.random() * 0.08,
        0.7,
        0.74 + Math.random() * 0.08,
      );
      dustColors[index * 3] = dustColor.r;
      dustColors[index * 3 + 1] = dustColor.g;
      dustColors[index * 3 + 2] = dustColor.b;
    });

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3),
    );
    dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));
    const dustMaterial = new THREE.PointsMaterial({
      alphaTest: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: fireflyTexture,
      opacity: 0.8,
      size: 0.2,
      sizeAttenuation: true,
      toneMapped: false,
      transparent: true,
      vertexColors: true,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    dust.frustumCulled = false;
    scene.add(dust);

    const dustLight = new THREE.PointLight(0xe6ff9c, 3.6, 24, 2);
    scene.add(dustLight);

    const screenMaterials: Array<
      THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
    > = [];

    const syncScreenTexture = () => {
      if (!screenTexture) return;
      screenMaterials.forEach((material) => {
        material.map = screenTexture;
        material.emissiveMap = screenTexture;
        material.needsUpdate = true;
      });
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      SCREEN_URL,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        screenTexture = texture;
        syncScreenTexture();
        renderer.render(scene, camera);
      },
      undefined,
      () => {
        // The model remains usable if the small CRT poster cannot be loaded.
      },
    );

    const positionAttribute = dustGeometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const updateDust = () => {
      dustParticles.forEach((particle, index) => {
        particle.time += particle.speed;
        const t = particle.time;
        dustPositions[index * 3] =
          particle.x +
          Math.cos((t / 10) * particle.factor) +
          (Math.sin(t) * particle.factor) / 10;
        dustPositions[index * 3 + 1] =
          particle.y +
          Math.sin((t / 10) * particle.factor) +
          (Math.cos(t * 2) * particle.factor) / 10;
        dustPositions[index * 3 + 2] =
          particle.z +
          Math.cos((t / 10) * particle.factor) +
          (Math.sin(t * 3) * particle.factor) / 10;
      });
      positionAttribute.needsUpdate = true;
    };

    const animate = () => {
      if (disposed || !isVisible || reducedMotion) return;
      const elapsed = clock.getElapsedTime();
      pointerCurrent.lerp(pointerTarget, 0.045);

      if (modelRoot) {
        modelGroup.rotation.x =
          Math.sin(elapsed * 0.28) * 0.004 - pointerCurrent.y * 0.018;
        modelGroup.rotation.y =
          Math.sin(elapsed * 0.32) * 0.008 + pointerCurrent.x * 0.026;
        modelGroup.position.x = Math.sin(elapsed * 0.22) * 0.012;
        modelGroup.position.y = Math.sin(elapsed * 0.55) * 0.008;
        modelGroup.position.z = Math.cos(elapsed * 0.26) * 0.012;
      }

      updateDust();
      dust.rotation.y = Math.sin(elapsed * 0.035) * 0.025;
      renderScene();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (reducedMotion || disposed || animationFrame) {
        renderScene();
        return;
      }
      clock.start();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      clock.stop();
    };

    const updateCameraComposition = (screenTarget?: THREE.Vector3) => {
      const mobile = container.clientWidth <= 820;
      const target = screenTarget ?? new THREE.Vector3(0, 0.8, 0);
      const desktopPosition = new THREE.Vector3(15.497, 1.9224, 16.001);

      camera.fov = 40;
      modelGroup.visible = !mobile;
      if (mobile) {
        camera.position.copy(desktopPosition);
        camera.lookAt(target.clone().add(new THREE.Vector3(-1.65, -0.04, 0)));
      } else {
        camera.position.copy(desktopPosition);
        camera.lookAt(target.clone().add(new THREE.Vector3(-1.65, -0.04, 0)));
      }
      camera.updateProjectionMatrix();
    };

    let currentScreenTarget: THREE.Vector3 | undefined;
    const resize = () => {
      if (disposed) return;
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, liteMode ? 1.25 : 1.75),
      );
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      updateCameraComposition(currentScreenTarget);
      renderScene();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const onPointerMove = (event: PointerEvent) => {
      if (coarsePointer || reducedMotion) return;
      const bounds = container.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      );
    };
    const onPointerLeave = () => pointerTarget.set(0, 0);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startAnimation();
        else stopAnimation();
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(container);

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

        let screenMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const sourceMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          const objectIsScreen = isScreenName(object.name);

          if (
            !screenMesh &&
            (objectIsScreen ||
              sourceMaterials.some((material) => isScreenName(material.name)))
          ) {
            screenMesh = object;
          }

          const nextMaterials = sourceMaterials.map((sourceMaterial) => {
            const materialIsScreen =
              objectIsScreen || isScreenName(sourceMaterial.name);

            if (materialIsScreen) {
              const material = new THREE.MeshStandardMaterial({
                color: 0x68727c,
                emissive: 0xffffff,
                emissiveIntensity: 1.25,
                map: screenTexture,
                emissiveMap: screenTexture,
                metalness: 0,
                roughness: 0.72,
                toneMapped: false,
              });
              material.name = sourceMaterial.name;
              screenMaterials.push(material);
              sourceMaterial.dispose();
              return material;
            }

            const material = sourceMaterial.clone();
            if (
              material instanceof THREE.MeshStandardMaterial ||
              material instanceof THREE.MeshPhysicalMaterial
            ) {
              material.roughness = THREE.MathUtils.clamp(
                material.roughness,
                0.12,
                0.94,
              );
              material.metalness = THREE.MathUtils.clamp(
                material.metalness,
                0,
                0.82,
              );
              material.envMapIntensity = Math.max(material.envMapIntensity, 0.28);
              material.color.multiplyScalar(0.12);
              material.emissiveIntensity = 0.12;
              material.side = THREE.FrontSide;
            }
            sourceMaterial.dispose();
            return material;
          });

          object.material = Array.isArray(object.material)
            ? nextMaterials
            : nextMaterials[0];
        });

        gltf.scene.traverse((object) => {
          if (object instanceof THREE.PointLight || object instanceof THREE.SpotLight) {
            object.intensity = THREE.MathUtils.clamp(
              object.intensity * 0.00035,
              42,
              120,
            );
            object.distance = 56;
            object.decay = 1.2;
          } else if (object instanceof THREE.DirectionalLight) {
            object.intensity = THREE.MathUtils.clamp(
              object.intensity * 0.00035,
              0.65,
              1.8,
            );
          }
        });

        modelRoot = gltf.scene;
        modelRoot.position.set(0, 0, 0);
        modelRoot.scale.setScalar(1);
        modelGroup.add(modelRoot);

        const targetObject = screenMesh ?? modelRoot;
        currentScreenTarget = new THREE.Box3()
          .setFromObject(targetObject)
          .getCenter(new THREE.Vector3());
        updateCameraComposition(currentScreenTarget);
        syncScreenTexture();
        setLoadProgress(100);
        setSceneState("ready");
        renderScene();
      },
      (event) => {
        if (disposed || !event.lengthComputable) return;
        setLoadProgress(Math.round((event.loaded / event.total) * 100));
      },
      () => {
        if (disposed) return;
        setSceneState("error");
        renderScene();
      },
    );

    startAnimation();

    return () => {
      disposed = true;
      stopAnimation();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) {
          return;
        }
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach(disposeMaterial);
      });
      screenTexture?.dispose();
      fireflyTexture.dispose();
      environmentTarget?.dispose();
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
      <div className="cad-hero-scene__scanlines" aria-hidden="true" />
      <div className="cad-hero-scene__fallback" aria-hidden="true">
        <span />
        <i />
      </div>
      <p className="cad-hero-scene__status" role="status" aria-live="polite">
        {sceneState === "loading"
          ? `Loading original CAD scene · ${String(loadProgress).padStart(2, "0")}%`
          : sceneState === "ready"
            ? "Original CAD scene ready"
            : "3D preview unavailable · portfolio remains accessible"}
      </p>
    </div>
  );
}
