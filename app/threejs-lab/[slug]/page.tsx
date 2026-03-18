"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  Scroll,
  useScroll,
  Float,
  useGLTF,
  Environment,
  MeshReflectorMaterial,
  Html,
  ContactShadows,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Scanline,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { easing } from "maath";
import Link from "next/link";

// ─── 1. 车辆模型组件：专注于完整性与灯光 ───
function BMWModel() {
  const { scene } = useGLTF("/models/bmwModel/scene.gltf");
  const scroll = useScroll();
  const carGroup = useRef<THREE.Group>(null);

  // 初始化材质，确保支持发光且质感高级
  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const name = obj.name.toLowerCase();

        if (
          name.includes("lamp") ||
          name.includes("light") ||
          name.includes("glass")
        ) {
          // 强制为灯具部件分配标准材质，防止报错
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#111",
            emissive: new THREE.Color("#000"),
            emissiveIntensity: 0,
            metalness: 1,
            roughness: 0,
          });
        } else {
          // 车身钢琴漆
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#050505",
            metalness: 1,
            roughness: 0.05,
            envMapIntensity: 2,
          });
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    const offset = scroll.offset;

    // 1. 车身动态姿态（整体旋转与微调俯仰）
    const rotationY = offset * Math.PI * 2; // 随滚动 360 度自转
    const tiltX = Math.sin(offset * Math.PI) * 0.08; // 模拟行驶中的重心移动

    if (carGroup.current) {
      easing.dampE(
        carGroup.current.rotation,
        [tiltX, rotationY, 0],
        0.4,
        delta,
      );
    }

    // 2. 局部细节动画
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const name = obj.name.toLowerCase();

        // 车轮自转
        if (name.includes("wheel")) {
          obj.rotateX(delta * 15 * (1 - offset * 0.5));
        }

        // 安全地设置发光（修复之前的 undefined 报错）
        if (name.includes("light") || name.includes("lamp")) {
          if (mesh.material && "emissiveIntensity" in mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            // 在滚动到 70% 之后激活“呼吸灯”效果
            const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 3;
            mat.emissive.set("#34d399");
            mat.emissiveIntensity = offset > 0.7 ? pulse : 0;
          }
        }
      }
    });
  });

  return (
    <group ref={carGroup}>
      <primitive object={scene} scale={0.45} position={[0, -0.6, 0]} />
    </group>
  );
}

// ─── 2. 导演级运镜逻辑 ───
function CinematicDirector() {
  const scroll = useScroll();
  const { camera } = useThree();
  const targetPos = new THREE.Vector3();

  useFrame((state, delta) => {
    const r = scroll.offset;

    // 电影剪辑路径：5段核心机位
    if (r < 0.2) {
      targetPos.set(8, 2, 12); // 远景入场
    } else if (r < 0.4) {
      targetPos.set(-6, 0.4, 6); // 侧方轮毂低角度
    } else if (r < 0.6) {
      targetPos.set(0, 6, -8); // 尾部俯瞰
    } else if (r < 0.8) {
      targetPos.set(5, 1, 4); // 门板侧切特写
    } else {
      targetPos.set(0, 0.5, 10); // 正面视觉终章
    }

    easing.damp3(camera.position, targetPos, 0.6, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── 3. 场景渲染 ───
function Scene() {
  return (
    <>
      <color attach="background" args={["#000"]} />
      <Environment preset="night" />

      {/* 科技感地面辅助线 */}
      <gridHelper
        args={[100, 50, "#111", "#050505"]}
        position={[0, -0.61, 0]}
      />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <BMWModel />
      </Float>

      {/* 软阴影 */}
      <ContactShadows opacity={0.6} scale={10} blur={2} far={1} color="#000" />

      {/* 镜面地面 */}
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
        <Bloom luminanceThreshold={1.2} intensity={2} mipmapBlur />
        <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
        <Scanline opacity={0.1} />
        <Vignette darkness={0.8} />
      </EffectComposer>
    </>
  );
}

// ─── 4. 主页面 ───
export default function AutomotiveShowcase() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-black text-white font-mono h-screen w-screen overflow-hidden">
      {mounted && (
        <div className="fixed inset-0">
          <Canvas shadows dpr={[1, 2]} camera={{ fov: 35 }}>
            {/* 设置 12 页滚动，节奏非常舒缓，不急促 */}
            <ScrollControls pages={12} damping={0.4}>
              <Suspense fallback={<Loader />}>
                <CinematicDirector />
                <Scene />
              </Suspense>

              <Scroll html>
                <div className="w-screen">
                  {/* 第一屏：引言 */}
                  <section className="h-screen flex items-end p-20">
                    <div className="space-y-4 max-w-xl">
                      <div className="w-20 h-1 bg-emerald-500" />
                      <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-none">
                        Aero_X
                      </h1>
                      <p className="text-[10px] tracking-[0.8em] text-emerald-500 uppercase">
                        Digital Integrity Sequence
                      </p>
                    </div>
                  </section>

                  {/* 留出中间大量的纯 3D 展示空间 */}
                  <div className="h-[900vh]" />

                  {/* 最后一屏：呼应 */}
                  <section className="h-screen flex flex-col items-center justify-center">
                    <div className="text-center group">
                      <h2 className="text-sm tracking-[2em] opacity-20 group-hover:opacity-100 transition-opacity mb-12">
                        END_OF_TRANSMISSION
                      </h2>
                      <Link
                        href="/"
                        className="px-16 py-5 border border-white/10 hover:border-emerald-500 transition-all rounded-full text-[10px] tracking-[0.5em] uppercase"
                      >
                        Terminate Session
                      </Link>
                    </div>
                  </section>
                </div>
              </Scroll>
            </ScrollControls>
          </Canvas>
        </div>
      )}

      {/* 悬浮 HUD UI */}
      <div className="fixed inset-0 pointer-events-none z-50 p-12 flex flex-col justify-between mix-blend-difference text-[9px] opacity-40 tracking-[0.4em]">
        <div className="flex justify-between uppercase">
          <div>Engine_Render: Solid</div>
          <div>Telemetry: Active</div>
        </div>
        <div className="flex justify-between items-end uppercase">
          <div>Structural: 100%</div>
          <div className="w-24 h-[1px] bg-white/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500 animate-[loading_3s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <Html
      center
      className="text-emerald-500 text-[10px] tracking-[1em] uppercase whitespace-nowrap animate-pulse"
    >
      Calibrating_Optics...
    </Html>
  );
}
