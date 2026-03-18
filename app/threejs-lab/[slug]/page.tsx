"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  Float,
  useGLTF,
  Environment,
  MeshReflectorMaterial,
  Html,
  ContactShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { easing } from "maath";

// ─── 1. 文字配置 (与运镜区间严格对应) ───
const TEXT_STEPS = [
  {
    range: [0, 0.2],
    title: "AERO_X EVOLUTION",
    subtitle: "DESIGNED FOR THE NEXT GENERATION",
    position: "left-center",
  },
  {
    range: [0.2, 0.4],
    title: "21' PERFORMANCE",
    subtitle: "FORGED LIGHTWEIGHT ALLOY WHEELS",
    position: "right-bottom",
  },
  {
    range: [0.4, 0.6],
    title: "AERO DYNAMICS",
    subtitle: "0.21 CD ULTRA-LOW DRAG COEFFICIENT",
    position: "left-top",
  },
  {
    range: [0.6, 0.8],
    title: "CARBON CHASSIS",
    subtitle: "REINFORCED STRUCTURAL INTEGRITY",
    position: "right-center",
  },
  {
    range: [0.8, 1.0],
    title: "FUTURE ARCH",
    subtitle: "TERMINATE SESSION / DRIVE NOW",
    position: "center-center",
  },
];

// ─── 2. 车辆模型 ───
function BMWModel() {
  const { scene } = useGLTF("/models/bmwModel/scene.gltf");
  const scroll = useScroll();
  const carGroup = useRef<THREE.Group>(null);

  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#050505",
          metalness: 1,
          roughness: 0.05,
          envMapIntensity: 2,
        });
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    const offset = scroll.offset;
    if (carGroup.current) {
      easing.dampE(
        carGroup.current.rotation,
        [Math.sin(offset * Math.PI) * 0.08, offset * Math.PI * 2, 0],
        0.4,
        delta,
      );
    }
  });

  return (
    <group ref={carGroup}>
      <primitive object={scene} scale={0.45} position={[0, -0.6, 0]} />
    </group>
  );
}

// ─── 3. 文字交互层 (修正版：直接使用 Html 组件) ───
function OverlayText() {
  const scroll = useScroll();
  const groupRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const sections = groupRef.current.querySelectorAll(".text-section");
    const r = scroll.offset;

    sections.forEach((el, i) => {
      const [start, end] = TEXT_STEPS[i].range;
      const htmlEl = el as HTMLElement;

      // 计算透明度逻辑
      let opacity = 0;
      const margin = 0.08;
      if (r >= start && r <= end) {
        if (r < start + margin) opacity = (r - start) / margin;
        else if (r > end - margin) opacity = (end - r) / margin;
        else opacity = 1;
      }

      htmlEl.style.opacity = opacity.toString();
      htmlEl.style.transform = `translateY(${(1 - opacity) * 30}px)`;
      htmlEl.style.display = opacity <= 0 ? "none" : "flex";
    });
  });

  const getPosClass = (pos: string) => {
    switch (pos) {
      case "left-center":
        return "items-start justify-center pl-24";
      case "right-bottom":
        return "items-end justify-end p-24 pb-40";
      case "left-top":
        return "items-start justify-start p-24 pt-40";
      case "right-center":
        return "items-end justify-center pr-24";
      case "center-center":
        return "items-center justify-center";
      default:
        return "";
    }
  };

  return (
    <Html fullscreen zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
      <div ref={groupRef} className="w-full h-full relative">
        {TEXT_STEPS.map((step, i) => (
          <div
            key={i}
            className={`text-section absolute inset-0 flex flex-col transition-opacity duration-300 pointer-events-none ${getPosClass(step.position)}`}
            style={{ opacity: 0, display: "none" }}
          >
            <div className="space-y-2 border-l-2 border-emerald-500 pl-8 bg-black/10 backdrop-blur-[2px] py-4 pr-10">
              <h2 className="text-[11px] tracking-[0.8em] text-emerald-400 uppercase font-bold">
                {step.subtitle}
              </h2>
              <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                {step.title}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </Html>
  );
}

// ─── 4. 运镜控制 ───
function CinematicDirector() {
  const scroll = useScroll();
  const { camera } = useThree();
  const targetPos = new THREE.Vector3();

  useFrame((state, delta) => {
    const r = scroll.offset;
    if (r < 0.2) targetPos.set(8, 2, 12);
    else if (r < 0.4) targetPos.set(-6, 0.4, 6);
    else if (r < 0.6) targetPos.set(0, 6, -8);
    else if (r < 0.8) targetPos.set(5, 1, 4);
    else targetPos.set(0, 0.5, 10);

    easing.damp3(camera.position, targetPos, 0.6, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── 5. 主页面 ───
export default function AutomotiveShowcase() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-black text-white font-mono h-screen w-screen overflow-hidden">
      {mounted && (
        <div className="fixed inset-0">
          <Canvas shadows dpr={[1, 2]} camera={{ fov: 35 }}>
            <ScrollControls pages={6} damping={0.4}>
              <Suspense
                fallback={
                  <Html
                    center
                    className="text-emerald-500 tracking-widest uppercase"
                  >
                    Initializing...
                  </Html>
                }
              >
                <CinematicDirector />
                <BMWModel />
                <SceneDecoration />
                <OverlayText />
              </Suspense>
            </ScrollControls>
          </Canvas>
        </div>
      )}

      {/* 底部 HUD */}
      <div className="fixed bottom-10 left-10 right-10 flex justify-between pointer-events-none z-50 text-[10px] tracking-[0.5em] opacity-50 mix-blend-difference">
        <div>SYSTEM_ACTIVE</div>
        <div>SCROLL_TO_EXPLORE</div>
        <div>SERIES_01X</div>
      </div>
    </div>
  );
}

function SceneDecoration() {
  return (
    <>
      <color attach="background" args={["#000"]} />
      <Environment preset="night" />
      <gridHelper
        args={[100, 50, "#111", "#050505"]}
        position={[0, -0.61, 0]}
      />
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
        {/* 这里原本包裹模型，为简化逻辑模型已独立 */}
      </Float>
      <ContactShadows opacity={0.6} scale={10} blur={2} far={1} color="#000" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={60}
          color="#050505"
          metalness={0.9}
          mirror={1}
        />
      </mesh>
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1.2} intensity={1.5} mipmapBlur />
        <Vignette darkness={0.8} />
      </EffectComposer>
    </>
  );
}
