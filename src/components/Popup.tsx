"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
};

export default function Popup({ isOpen, onClose, imageSrc }: PopupProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 300, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zIndex, setZIndex] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isOpen || isMobile) return;
    const updateSize = () => {
      const maxWidth = Math.min(640, window.innerWidth - 32);
      const maxHeight = Math.min(360, window.innerHeight - 32);
      const targetRatio = 16 / 9;
      let width = maxWidth;
      let height = Math.round(width / targetRatio);
      if (height > maxHeight) {
        height = maxHeight;
        width = Math.round(height * targetRatio);
      }
      setSize({ width, height });
      setPosition({ x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2 });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (event: PointerEvent) => {
      if (!dragRef.current || event.pointerId !== dragRef.current.pointerId) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      });
    };
    const handleUp = (event: PointerEvent) => {
      if (!dragRef.current || event.pointerId !== dragRef.current.pointerId) return;
      dragRef.current = null;
      setIsDragging(false);
      if (containerRef.current?.hasPointerCapture(event.pointerId)) {
        containerRef.current.releasePointerCapture(event.pointerId);
      }
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-slate-950/70" onClick={onClose} aria-hidden="true" />
        <div
          className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-slate-400"
            aria-label="Close popup"
          >
            &times;
          </button>
          <div className="relative aspect-video w-full bg-slate-100">
            <Image src={imageSrc} alt="Popup Preview" fill className="object-contain" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div
        ref={containerRef}
        onPointerDown={(event) => {
          if (event.button !== 0 || (event.target as HTMLElement).closest(".close-btn")) return;
          setZIndex((current) => current + 1);
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDragging(true);
          dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            initialX: position.x,
            initialY: position.y,
          };
        }}
        style={{
          left: 0,
          top: 0,
          width: size.width,
          height: size.height,
          zIndex,
          touchAction: "none",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          boxSizing: "border-box",
        }}
        className={`relative flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="close-btn absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-slate-400"
          aria-label="Close popup"
        >
          X
        </button>
        <Image src={imageSrc} alt="Popup Preview" fill className="object-contain" />
      </div>
    </>
  );
}
