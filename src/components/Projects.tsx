"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ProjectCard = {
  title: string;
  subtitle?: string;
  desc: string;
  img: string;
  tag: string;
  href?: string;
  opensModal?: boolean;
};

const PROJECTS: ProjectCard[] = [
  {
    title: "Engineering Degree",
    subtitle: "Electrical and Electronic Engineering",
    desc: "I studied a wide range of electrical fundamentals from Signal analysis to Electromagnetics however in my final year I used my growing interest in AI to direct my final year thesis into Algorithmic Financial forecasting.",
    img: "/project-electronics.jpg",
    tag: "",
    href: "/dissertation",
  },
  {
    title: "Crash Site",
    desc: "An indie game world built from scratch with a heavy dose of atmosphere and puzzle design.",
    img: "/project-crashsite.jpg",
    tag: "",
    href: "/crash-site",
  },
  {
    title: "Creative Portfolio",
    desc: "Performance work that explores presence, storytelling, and embodied systems.",
    img: "/actor.jpg",
    tag: "",
    opensModal: true,
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
};

function Popup({ isOpen, onClose, imageSrc }: PopupProps) {
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

export default function Projects() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <section id="projects" className="relative w-full pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Selected work</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Projects that blend engineering with curiosity.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              I focus on work that mixes hands-on experimentation, system thinking, and a bit of playful risk.
            </p>
          </div>
        </div>

        <motion.div
          variants={shouldReduce ? undefined : container}
          initial={shouldReduce ? false : "hidden"}
          whileInView={shouldReduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {PROJECTS.map(({ title, subtitle, desc, img, href, opensModal, tag }) => {
            const cardClasses = "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl";

            const imageClassName =
              title === "Creative Portfolio"
                ? "object-cover object-[center_20%]"
                : "object-cover";

            const content = (
              <>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={img}
                    alt={title}
                    fill
                    className={`${imageClassName} transition duration-300 ease-out group-hover:scale-[1.05]`}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                    quality={95}
                  />
                        </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  {tag && (
                    <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {tag}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                  {subtitle && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{subtitle}</p>}
                  <p className="text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              </>
            );

            return (
              <motion.article key={title} variants={shouldReduce ? undefined : item} className={cardClasses}>
                {href ? (
                  <Link className="flex h-full flex-col" href={href} aria-label={`View ${title}`}>
                    {content}
                  </Link>
                ) : opensModal ? (
                  <button
                    type="button"
                    className="flex h-full flex-col text-left"
                    onClick={() => setIsOpen(true)}
                    aria-haspopup="dialog"
                    aria-label={`Open ${title} preview`}
                  >
                    {content}
                  </button>
                ) : (
                  content
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} imageSrc="/flowerPopUp.png" />
    </section>
  );
}
