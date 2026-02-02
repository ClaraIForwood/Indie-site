"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type ProjectCard = {
  title: string;
  desc: string;
  img: string;
  href?: string;
  opensModal?: boolean;
};

const PROJECTS: ProjectCard[] = [
  {
    title: "Engineering Projects",
    desc: "Electrical and Electronic Engineering BENG projects from university and beyond",
    img: "/project-electronics.jpg",
    href: "/electronics",
  },
  {
    title: "Acting Projects",
    desc: "More will be revealed as the projects are released!",
    img: "/actor.jpg",
  },
  {
    title: "Crash Site",
    desc: "Indie Game dev project from game jam",
    img: "/project-crashsite.jpg",
    opensModal: true,
  },
];

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  centerText?: string;
};

function Popup({ isOpen, onClose, imageSrc, centerText = "Hi" }: PopupProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 300, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  useId();

  useEffect(() => {
    if (!isOpen) return;
    const updateSize = () => {
      const width = Math.min(300, window.innerWidth - 48);
      const height = Math.min(300, window.innerHeight - 48);
      setSize({ width, height });
      setPosition({ x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2 });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isOpen]);

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

  return (
    <div
      ref={containerRef}
      onPointerDown={(event) => {
        if (event.button !== 0 || (event.target as HTMLElement).closest(".close-btn")) {
          return;
        }
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
      className={`relative flex flex-col overflow-hidden rounded-xl bg-green-500 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } transition-shadow`}
    >
      <div className="bg-green-600 text-white text-[8px] shrink-0 leading-none font-mono flex items-center px-2 py-0 h-3" />
      <button
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="close-btn absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md bg-green-700 text-[10px] font-bold text-white shadow-sm transition hover:bg-green-800"
        aria-label="Close popup"
      >
        X
      </button>
      <div className="relative flex-1 w-full bg-green-500 flex flex-col items-center justify-start pt-1">
        <img
          src={imageSrc}
          alt="Popup Preview"
          className="h-[25%] w-[25%] object-contain"
          draggable="false"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-black text-black uppercase drop-shadow-[0_2px_0_rgba(255,255,255,1)]">
            {centerText}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectGrid() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full justify-center px-4 py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 justify-items-center gap-6 text-center sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map(({ title, desc, img, href, opensModal }) => (
          <article key={title} className="w-full max-w-xs sm:max-w-sm">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-100">
              {href ? (
                <Link className="group block h-full w-full" aria-label={`View ${title}`} href={href}>
                  <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-cover transition duration-200 ease-out group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                    quality={95}
                  />
                </Link>
              ) : opensModal ? (
                <button
                  type="button"
                  className="group block h-full w-full"
                  onClick={() => setIsOpen(true)}
                  aria-haspopup="dialog"
                  aria-label={`Open ${title} preview`}
                >
                  <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-cover transition duration-200 ease-out group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                    quality={95}
                  />
                </button>
              ) : (
                <Image
                  src={img}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                  quality={95}
                />
              )}
            </div>
            {href ? (
              <h3 className="mt-2 text-sm font-semibold text-neutral-900">
                <Link className="hover:underline" href={href}>
                  {title}
                </Link>
              </h3>
            ) : opensModal ? (
              <h3 className="mt-2 text-sm font-semibold text-neutral-900">
                <button
                  type="button"
                  className="hover:underline"
                  onClick={() => setIsOpen(true)}
                  aria-haspopup="dialog"
                >
                  {title}
                </button>
              </h3>
            ) : (
              <h3 className="mt-2 text-sm font-semibold text-neutral-900">{title}</h3>
            )}
            <p className="mt-1 text-xs leading-5 text-neutral-500">{desc}</p>
          </article>
        ))}
      </div>
      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} imageSrc="/flowerPopUp.png" />
    </section>
  );
}
