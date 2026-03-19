"use client";

import type { ReactNode } from "react";
import { Component, createElement, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Group, MathUtils } from "three";

function MarioBox() {
  const { scene } = useGLTF("/super_mario_box/boxA.gltf");
  return createElement("primitive", { object: scene });
}

useGLTF.preload("/super_mario_box/boxA.gltf");

function Rotator({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const x = state.pointer.x / 2;
    const y = -state.pointer.y / 2;
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, x, 0.1);
    ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, y, 0.1);
  });

  // eslint-disable-next-line react-hooks/refs -- standard R3F pattern; ref is attached by the renderer, not read during render
  return createElement("group", { ref }, children);
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError?: (error: unknown) => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <span
            style={{
              fontSize: 12,
              color: "#f8fafc",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Error 404
          </span>
        </Html>
      );
    }
    return this.props.children;
  }
}

export default function ElectronicsCanvas({
  className,
  onError,
}: {
  className?: string;
  onError?: (error: unknown) => void;
}) {
  const classes = ["w-full", className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      <Canvas className="h-full w-full" style={{ display: "block" }}>
        <OrbitControls enableRotate={false} />
        <Environment preset="city" />
        <ModelErrorBoundary onError={onError}>
          <Suspense
            fallback={
              <Html center>
                <span style={{ fontSize: 12, color: "#888" }}>Loading...</span>
              </Html>
            }
          >
            <Rotator>
              <MarioBox />
            </Rotator>
          </Suspense>
        </ModelErrorBoundary>
      </Canvas>
    </div>
  );
}
