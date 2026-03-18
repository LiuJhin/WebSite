"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  Float,
  useGLTF,
  Environment,
  MeshReflectorMaterial,
  ContactShadows,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { easing } from "maath";

// ─── 配置数据（保持不变） ───
const SCENES = [
  {
    center: 0.0,
    cam: [8, 2, 12],
    title: "SUZILONG",
    sub: "01 / GENESIS",
    align: "left-center",
  },
  {
    center: 0.25,
    cam: [-7, 0.5, 7],
    title: "PRECISION",
    sub: "02 / STRUCTURE",
    align: "right-bottom",
  },
  {
    center: 0.5,
    cam: [0, 6, -10],
    title: "VELOCITY",
    sub: "03 / FLOW",
    align: "left-top",
  },
  {
    center: 0.75,
    cam: [6, 1.2, 4],
    title: "CARBON",
    sub: "04 / INTEGRITY",
    align: "right-center",
  },
  {
    center: 1.0,
    cam: [0, 0.5, 12],
    title: "VOID",
    sub: "05 / BEYOND",
    align: "center-center",
  },
];

// ─── 高级滚动进度条（无变化） ───
function ProgressBar({ offset }: { offset: number }) {
  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-[150]">
      <div className="text-[10px] text-emerald-500/50 rotate-90 mb-4 tracking-[0.3em]">
        PROGRESS
      </div>
      <div className="h-64 w-[1px] bg-white/10 relative">
        <div
          className="absolute top-0 w-full bg-emerald-500 transition-all duration-100 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ height: `${offset * 100}%` }}
        />
        {SCENES.map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 border border-white/20 bg-black -left-[2px] rounded-full"
            style={{ top: `${(i / (SCENES.length - 1)) * 100}%` }}
          />
        ))}
      </div>
      <div className="text-[10px] text-white/40 mt-4">
        {(offset * 100).toFixed(0)}%
      </div>
    </div>
  );
}

// ─── 实时 UI 层（已优化：useMemo + 更柔和曲线 + willChange） ───
function HighEndUI({ offset }: { offset: number }) {
  const uiItems = useMemo(() => {
    return SCENES.map((item, i) => {
      const dist = Math.abs(offset - item.center);
      const strength = Math.max(0, 1 - dist / 0.175); // 过渡范围 0.175（更自然）
      const opacity = Math.pow(strength, 1.65); // 更丝滑的缓入缓出曲线
      const yShift = (1 - opacity) * 55;

      const alignClass = {
        "left-center": "items-start justify-center pl-20",
        "right-bottom": "items-end justify-end pr-20 pb-32 text-right",
        "left-top": "items-start justify-start pl-20 pt-32",
        "right-center": "items-end justify-center pr-20 text-right",
        "center-center": "items-center justify-center text-center",
      }[item.align];

      return { item, i, opacity, yShift, alignClass };
    });
  }, [offset]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] font-mono select-none">
      {uiItems.map(({ item, i, opacity, yShift, alignClass }) => {
        if (opacity < 0.005) return null;

        return (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col ${alignClass}`}
            style={{
              opacity,
              transform: `translateY(${yShift}px)`,
              willChange: "opacity, transform", // GPU 加速关键
            }}
          >
            <div className="max-w-5xl space-y-4">
              <span className="text-emerald-500 text-xs tracking-[1.2em] uppercase block opacity-80">
                {item.sub}
              </span>
              <h1 className="text-[15vw] font-black italic leading-[0.7] tracking-tighter text-white mix-blend-difference uppercase">
                {item.title}
              </h1>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 运镜控制（核心优化：高斯权重 + 更长阻尼） ───
function CinematicDirector({ setOffset }: { setOffset: (o: number) => void }) {
  const scroll = useScroll();
  const { camera } = useThree();
  const blendedPos = useMemo(() => new THREE.Vector3(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const r = scroll.offset;
    setOffset(r);

    // 高斯权重（极致丝滑，消除跳段感）
    const sigma = 0.175;
    blendedPos.set(0, 0, 0);
    let totalWeight = 0;

    SCENES.forEach((s) => {
      const distance = Math.abs(r - s.center);
      const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));

      tempVec.set(s.cam[0], s.cam[1], s.cam[2]);
      blendedPos.add(tempVec.multiplyScalar(weight));
      totalWeight += weight;
    });

    if (totalWeight > 0) blendedPos.divideScalar(totalWeight);

    // 超长阻尼 + 轻微抬高注视点（电影级惯性）
    easing.damp3(camera.position, blendedPos, 1.35, delta);
    camera.lookAt(0, 0.12, 0); // 轻微抬高，构图更高级
  });

  return null;
}

// ─── 车辆模型（材质遍历优化） ───
function BMWModel() {
  const { scene } = useGLTF("/models/bmwModel/scene.gltf");
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);

  // 材质只初始化一次
  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.color.set("#020202");
          mat.metalness = 1;
          mat.roughness = 0.08;
          mat.envMapIntensity = 3;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (group.current) {
      const targetRotation = scroll.offset * Math.PI * 2;
      easing.dampE(group.current.rotation, [0, targetRotation, 0], 0.6, delta);
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={0.45} position={[0, -0.6, 0]} />
    </group>
  );
}

// ─── 主页面（整合所有优化） ───
export default function AutomotiveShowcase() {
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="bg-black w-screen h-screen" />;

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden font-mono">
      <HighEndUI offset={offset} />
      <ProgressBar offset={offset} />

      <Canvas shadows dpr={[1, 2]} camera={{ fov: 32 }}>
        {/* 关键：ScrollControls damping 略低于相机阻尼，形成自然惯性 */}
        <ScrollControls pages={10} damping={0.45}>
          <Suspense fallback={null}>
            <CinematicDirector setOffset={setOffset} />
            <Environment preset="night" />

            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
              <BMWModel />
            </Float>

            <ContactShadows opacity={0.4} scale={12} blur={2.5} far={1.5} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.61, 0]}>
              <planeGeometry args={[100, 100]} />
              <MeshReflectorMaterial
                blur={[400, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={80}
                roughness={1}
                color="#050505"
                metalness={0.5}
                mirror={1}
              />
            </mesh>

            {/* Post-processing 降负优化 */}
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom luminanceThreshold={1.2} intensity={1.2} mipmapBlur />
              <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
              <Vignette darkness={0.75} />
            </EffectComposer>
          </Suspense>
        </ScrollControls>
      </Canvas>

      <div className="fixed top-10 left-10 pointer-events-none z-50 mix-blend-difference opacity-30 text-[9px] tracking-[0.5em] text-white uppercase">
        AERO_X // DYNAMIC_SEQUENCE
      </div>
    </main>
  );
}
