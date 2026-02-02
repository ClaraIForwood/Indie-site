"use client";

import { createElement } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Group, MathUtils } from "three";

function MarioBox() {
  const { scene } = useGLTF("/super_mario_box/boxA.gltf");
  return createElement("primitive", { object: scene });
}

useGLTF.preload("/super_mario_box/boxA.gltf");

function Rotator({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const x = state.pointer.x / 2;
    const y = -state.pointer.y / 2;
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, x, 0.1);
    ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, y, 0.1);
  });

  return createElement("group", { ref }, children);
}

export default function ElectronicsCanvas({ className }: { className?: string }) {
  const classes = ["w-full", className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      <Canvas className="h-full w-full" style={{ display: "block" }}>
        <OrbitControls enableRotate={false} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Rotator>
            <MarioBox />
          </Rotator>
        </Suspense>
      </Canvas>
    </div>
  );
}
