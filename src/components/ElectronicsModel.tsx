"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ElectronicsModelProps = {
  className?: string;
};

export default function ElectronicsModel({ className }: ElectronicsModelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.4, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(4, 6, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-3, 2, -4);
    scene.add(fillLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const boardMaterial = new THREE.MeshStandardMaterial({
      color: "#1a6e55",
      roughness: 0.7,
      metalness: 0.1,
    });
    materials.push(boardMaterial);

    const boardGeometry = new THREE.BoxGeometry(3.6, 0.22, 2.4);
    geometries.push(boardGeometry);
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.set(0, -0.12, 0);

    const chipMaterial = new THREE.MeshStandardMaterial({
      color: "#2c2c2c",
      roughness: 0.6,
      metalness: 0.2,
    });
    materials.push(chipMaterial);

    const chipGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.9);
    geometries.push(chipGeometry);
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0, 0.1, 0.1);

    const connectorMaterial = new THREE.MeshStandardMaterial({
      color: "#bfc7d1",
      roughness: 0.4,
      metalness: 0.6,
    });
    materials.push(connectorMaterial);

    const connectorGeometry = new THREE.BoxGeometry(0.9, 0.16, 0.3);
    geometries.push(connectorGeometry);
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.set(-0.8, 0.05, -0.95);

    const capacitorMaterial = new THREE.MeshStandardMaterial({
      color: "#2563eb",
      roughness: 0.4,
      metalness: 0.4,
    });
    materials.push(capacitorMaterial);

    const capacitorGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.52, 24);
    geometries.push(capacitorGeometry);
    const capacitorA = new THREE.Mesh(capacitorGeometry, capacitorMaterial);
    capacitorA.position.set(-1.2, 0.2, 0.6);
    const capacitorB = capacitorA.clone();
    capacitorB.position.set(-1.45, 0.2, 0.1);

    const coilMaterial = new THREE.MeshStandardMaterial({
      color: "#f59e0b",
      roughness: 0.3,
      metalness: 0.7,
    });
    materials.push(coilMaterial);

    const coilGeometry = new THREE.TorusGeometry(0.28, 0.08, 18, 60);
    geometries.push(coilGeometry);
    const coil = new THREE.Mesh(coilGeometry, coilMaterial);
    coil.position.set(1.1, 0.22, -0.6);
    coil.rotation.x = Math.PI / 2;

    const ledMaterial = new THREE.MeshStandardMaterial({
      color: "#fb923c",
      emissive: "#fb923c",
      emissiveIntensity: 0.7,
    });
    materials.push(ledMaterial);

    const ledGeometry = new THREE.SphereGeometry(0.08, 18, 18);
    geometries.push(ledGeometry);
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(1.3, 0.18, 0.8);

    const resistorMaterial = new THREE.MeshStandardMaterial({
      color: "#d97706",
      roughness: 0.5,
      metalness: 0.2,
    });
    materials.push(resistorMaterial);

    const resistorGeometry = new THREE.BoxGeometry(0.55, 0.12, 0.16);
    geometries.push(resistorGeometry);
    const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
    resistor.position.set(0.8, 0.08, 0.9);
    resistor.rotation.y = Math.PI / 7;

    const headerMaterial = new THREE.MeshStandardMaterial({
      color: "#111827",
      roughness: 0.4,
      metalness: 0.5,
    });
    materials.push(headerMaterial);

    const headerGeometry = new THREE.BoxGeometry(1.4, 0.15, 0.2);
    geometries.push(headerGeometry);
    const header = new THREE.Mesh(headerGeometry, headerMaterial);
    header.position.set(0.6, 0.06, -0.95);

    const pinGeometry = new THREE.BoxGeometry(0.08, 0.14, 0.08);
    geometries.push(pinGeometry);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: "#f8fafc",
      roughness: 0.3,
      metalness: 0.8,
    });
    materials.push(pinMaterial);
    const pins = new THREE.Group();
    for (let i = 0; i < 6; i += 1) {
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      pin.position.set(-0.25 + i * 0.1, 0.12, -0.95);
      pins.add(pin);
    }

    const assembly = new THREE.Group();
    assembly.add(
      board,
      chip,
      connector,
      capacitorA,
      capacitorB,
      coil,
      led,
      resistor,
      header,
      pins
    );
    scene.add(assembly);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      assembly.rotation.y = elapsed * 0.4;
      assembly.rotation.x = Math.sin(elapsed * 0.6) * 0.15;
      coil.rotation.z = elapsed * 1.1;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      // Clean up WebGL resources to avoid leaks.
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const combinedClassName = ["relative w-full", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={combinedClassName}
      role="img"
      aria-label="3D electronics board model"
    />
  );
}
