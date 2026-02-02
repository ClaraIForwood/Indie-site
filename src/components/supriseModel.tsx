"use client";

import { easing } from "maath";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Gltf, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import * as THREE from "three";

type SupriseModelProps = {
  className?: string;
};

// 1. Create a "Rig" component to handle the rotation logic
function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // x = mouse horizontal position (-1 to 1)
    // y = mouse vertical position (-1 to 1)
    
    // Target rotation values (Adjust the division numbers to change sensitivity)
    // dividing by 2 means it rotates 45 degrees max. 
    const targetY = state.pointer.x / 2; 
    const targetX = -state.pointer.y / 2;

    // Smoothly interpolate current rotation to target rotation
    // 0.1 is the "smoothing" factor (lower is slower/heavier, higher is snappier)
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.1);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 0.1);
  });

  return <group ref={ref}>{children}</group>;
}

export default function SupriseModel({ className }: SupriseModelProps) {
  const wrapperClassName = ["w-full", className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <Canvas className="h-full w-full" style={{ display: "block" }}>
        {/* Note: OrbitControls might conflict with cursor rotation if you drag.
           You might want to remove <OrbitControls /> if you want PURE cursor follow.
           Or set <OrbitControls enableRotate={false} /> 
        */}
        <OrbitControls enableRotate={false} /> 
        
        <Environment preset="city" />

        <Suspense fallback={null}>
          {/* 2. Wrap your model in the Rig */}
          <Rig>
            <Gltf src="/super_mario_box/boxA.gltf" />
          </Rig>
        </Suspense>
      </Canvas>
    </div>
  );
}

