"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  useGLTF,
  Environment,
  MeshReflectorMaterial,
  Grid,
  Stars,
  Loader,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { easing } from "maath";

const SCENES = [
  {
    center: 0.0,
    cam: [8, 2, 12],
    title: "SUZILONG",
    sub: "01 / GENESIS",
    desc: "A new era of computational design.",
    align: "left-center",
  },
  {
    center: 0.25,
    cam: [-7, 0.5, 7],
    title: "PRECISION",
    sub: "02 / STRUCTURE",
    desc: "Fluid dynamics manifestation.",
    align: "right-bottom",
  },
  {
    center: 0.5,
    cam: [0, 6, -10],
    title: "VELOCITY",
    sub: "03 / FLOW",
    desc: "Redefining air and metal.",
    align: "left-top",
  },
  {
    center: 0.75,
    cam: [6, 1.2, 4],
    title: "CARBON",
    sub: "04 / INTEGRITY",
    desc: "Monocoque architecture.",
    align: "right-center",
  },
  {
    center: 1.0,
    cam: [0, 0.5, 12],
    title: "VOID",
    sub: "05 / BEYOND",
    desc: "System sequence completed.",
    align: "center-center",
  },
];

// ─── 2. 动态环境背景 ───
function SceneBackground({ offset }: { offset: number }) {
  const starsRef = useRef<THREE.Points>(null);
  const gridRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01;
      easing.damp(starsRef.current.position, "y", -offset * 3, 0.3, delta);
    }
    if (gridRef.current) {
      gridRef.current.position.z = (offset * 5) % 2;
    }
  });

  return (
    <group>
      <Stars
        ref={starsRef}
        radius={40}
        depth={40}
        count={1200}
        factor={2}
        fade
        speed={1}
      />
      <Grid
        ref={gridRef}
        position={[0, -0.62, 0]}
        args={[60, 60]}
        cellSize={1}
        sectionSize={4}
        cellColor="#101010"
        sectionColor="#181818"
        fadeDistance={25}
      />
    </group>
  );
}

// 运镜控制逻辑
function CinematicDirector({ setOffset }: { setOffset: (o: number) => void }) {
  const scroll = useScroll();
  const { camera } = useThree();
  const blendedPos = useMemo(() => new THREE.Vector3(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const lookAtVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const lastOffset = useRef(0);

  useFrame((state, delta) => {
    const r = scroll.offset;
    const velocity = scroll.delta;

    if (Math.abs(r - lastOffset.current) > 0.0005) {
      setOffset(r);
      lastOffset.current = r;
    }

    const sigma = 0.18;
    blendedPos.set(0, 0, 0);
    let totalWeight = 0;
    SCENES.forEach((s) => {
      const dist = Math.abs(r - s.center);
      const weight = Math.exp(-(dist * dist) / (2 * sigma * sigma));
      tempVec.set(s.cam[0], s.cam[1], s.cam[2]);
      blendedPos.add(tempVec.multiplyScalar(weight));
      totalWeight += weight;
    });
    if (totalWeight > 0) blendedPos.divideScalar(totalWeight);

    easing.damp(camera, "fov", 32 + velocity * 80, 0.25, delta);
    camera.updateProjectionMatrix();
    easing.damp3(lookAtVec, [0, 0.1 + velocity * 1, 0], 0.2, delta);
    easing.damp3(camera.position, blendedPos, 0.3, delta);
    camera.lookAt(lookAtVec);
  });
  return null;
}

function BMWModel() {
  const { scene } = useGLTF("/models/bmwModel/scene.gltf");
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        const isBody =
          obj.name.toLowerCase().includes("body") ||
          mat.name.toLowerCase().includes("paint");

        if (isBody) {
          mat.color.set("#020202");
          mat.metalness = 1.0;
          mat.roughness = 0.02;
          mat.envMapIntensity = 4;
        } else {
          mat.envMapIntensity = 1.5;
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (group.current) {
      easing.dampE(
        group.current.rotation,
        [0, scroll.offset * Math.PI * 2, 0],
        0.4,
        delta,
      );
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={0.4} position={[0, -0.6, 0]} />
    </group>
  );
}

function HighEndUI({ offset }: { offset: number }) {
  const uiItems = useMemo(() => {
    return SCENES.map((item, i) => {
      const dist = Math.abs(offset - item.center);
      const strength = 1 - THREE.MathUtils.smoothstep(dist, 0, 0.2);
      const opacity = Math.pow(strength, 2);
      const yShift = (1 - opacity) * 20;

      const layoutProps = {
        "left-center": {
          container: "items-start justify-center px-10 md:px-24",
          text: "text-left items-start",
        },
        "right-bottom": {
          container: "items-end justify-end px-10 md:px-24 pb-32",
          text: "text-right items-end",
        },
        "left-top": {
          container: "items-start justify-start px-10 md:px-24 pt-32",
          text: "text-left items-start",
        },
        "right-center": {
          container: "items-end justify-center px-10 md:px-24",
          text: "text-right items-end",
        },
        "center-center": {
          container: "items-center justify-center px-6",
          text: "text-center items-center",
        },
      }[item.align] || {
        container: "items-center justify-center",
        text: "text-center items-center",
      };

      return { item, i, opacity, yShift, layoutProps };
    });
  }, [offset]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] font-mono select-none">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
        <div
          className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
          style={{
            width: `${offset * 100}%`,
            transition: "width 0.1s ease-out",
          }}
        />
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-center">
        {SCENES.map((_, i) => (
          <div
            key={i}
            className={`w-[2px] transition-all duration-700 ${
              Math.abs(offset - SCENES[i].center) < 0.12
                ? "bg-emerald-500 h-10 shadow-[0_0_8px_#10b981]"
                : "bg-white/10 h-6"
            }`}
          />
        ))}
        <div className="text-white/20 text-[8px] mt-2 rotate-90 origin-left translate-x-1">
          NAV_SYSTEM
        </div>
      </div>

      {uiItems.map(({ item, i, opacity, yShift, layoutProps }) => {
        if (opacity < 0.01) return null;
        return (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col ${layoutProps.container}`}
            style={{
              opacity,
              transform: `translate3d(0, ${yShift}px, 0)`,
              transition: "opacity 0.15s linear",
            }}
          >
            <div className={`flex flex-col ${layoutProps.text} max-w-5xl`}>
              <span className="text-emerald-500 text-[10px] tracking-[1em] uppercase mb-4">
                {item.sub}
              </span>
              <h1 className="text-[12vw] md:text-9xl font-black italic leading-[0.75] text-white uppercase tracking-tighter">
                {item.title}
              </h1>
              <p className="mt-6 text-white/30 text-[10px] tracking-[0.2em] leading-relaxed uppercase max-w-xs sm:block hidden">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AutomotiveShowcase() {
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="relative w-screen h-screen bg-[#020202] overflow-hidden">
      <Loader
        containerStyles={{ background: "#000", zIndex: 1000 }}
        innerStyles={{ backgroundColor: "#10b981", height: "2px" }}
        barStyles={{ backgroundColor: "#10b981" }}
        dataStyles={{
          color: "#10b981",
          fontFamily: "monospace",
          fontSize: "10px",
          letterSpacing: "2px",
        }}
        dataInterpolation={(p) => `CORE_SYSTEM_LOADING: ${p.toFixed(0)}%`}
      />

      <HighEndUI offset={offset} />

      <Canvas
        shadows={false}
        dpr={1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 32 }}
      >
        <ScrollControls pages={6} damping={0.2}>
          <Suspense fallback={null}>
            <CinematicDirector setOffset={setOffset} />
            <SceneBackground offset={offset} />

            <Environment preset="night" />

            <BMWModel />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.61, 0]}>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial
                blur={[200, 50]}
                resolution={256}
                mixBlur={1}
                mixStrength={50}
                roughness={1}
                color="#050505"
                metalness={0.5}
                mirror={0.8}
                transparent
                opacity={0.7}
              />
            </mesh>

            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom luminanceThreshold={1.3} intensity={0.9} />
              <Vignette darkness={0.8} />
            </EffectComposer>
          </Suspense>
        </ScrollControls>
      </Canvas>

      <div className="fixed bottom-8 left-8 text-white/10 text-[8px] tracking-[0.5em] uppercase z-50">
        System: Stable // Mode: Stealth_Black // Build: 2024.v1
      </div>
    </main>
  );
}
