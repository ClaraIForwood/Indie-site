"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CarouselItem = {
  title: string;
  description: string;
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  clipStart?: number;
  clipEnd?: number;
};

const ITEMS: CarouselItem[] = [
  {
    title: "Infrared Audio Telecommunications System",
    description:
      "Designed and built the complete modulation and demodulation subsystems for a wireless IR audio transmitter — from datasheet to soldered PCB. Achieved a 43 kHz carrier frequency using the CD74HC7046 phase-locked loop, with integrated low-pass filters for voice frequencies (50 Hz–17 kHz). Independently validated both subsystems via oscilloscope analysis before integration, confirming clean audio at the target 10 cm range. Developed in Multisim and Ultiboard.",
    type: "image",
    src: "/project-electronics.jpg",
    alt: "Telecoms Project",
  },
  {
    title: "Arduino Microcontroller Interface",
    description:
      "Built a button-driven embedded interface with real-time 7-segment LED display output. Implemented multiplexing to drive a multi-digit display while handling multiple button inputs via interrupt-driven programming. Developed state machine logic for input sequences and explored ATmega328P architecture internals, strengthening skills in low-level hardware-software integration and timing constraints.",
    type: "video",
    src: "/vidArduino.mp4",
    poster: "/project-electronics.jpg",
  },
  {
    title: "Signal Analysis",
    description:
      "Investigated digital baseband signalling using the Emona Telecoms-Trainer 101 — analysing bandwidth limitation, noise, and inter-symbol interference across NRZ-L, RZ, Bipolar RZ, and Manchester coding schemes via eye diagram analysis. Applied the Shannon-Hartley theorem to correlate theoretical capacity with measured data, and configured VCOs, tunable low-pass filters, and comparator circuits to simulate real-world channel impairments.",
    type: "image",
    src: "/ComsReport.jpg",
    alt: "Electronics Prototype",
  },
];

function Media({
  item,
  className,
  canAutoplay = true,
}: {
  item: CarouselItem;
  className?: string;
  canAutoplay?: boolean;
}) {
  const classes = `h-full w-full ${
    item.type === "video" ? "object-contain bg-black" : "object-cover"
  } ${className ?? ""}`;

  if (item.type === "video") {
    const clipStart = item.clipStart ?? 0;
    const clipEnd = item.clipEnd ?? 0;
    return (
      <video
        src={item.src}
        className={classes}
        muted
        loop={!clipEnd}
        autoPlay={canAutoplay}
        controls={!canAutoplay}
        playsInline
        preload="metadata"
        poster={item.poster}
        onLoadedMetadata={(event) => {
          if (clipStart > 0) {
            event.currentTarget.currentTime = clipStart;
          }
        }}
        onTimeUpdate={(event) => {
          if (!clipEnd) return;
          const video = event.currentTarget;
          if (video.currentTime >= clipEnd) {
            video.currentTime = clipStart;
            video.play();
          }
        }}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt ?? item.title}
      width={320}
      height={320}
      className={classes}
      priority
    />
  );
}

export default function ElectronicsCarousel() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [canAutoplay] = useState(() => {
    if (typeof window === "undefined") return true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverNone = window.matchMedia("(hover: none)").matches;
    const touch = navigator.maxTouchPoints > 0;
    return !(reduce || hoverNone || touch);
  });
  const touchStart = useRef<number | null>(null);
  const touchMove = useRef<number | null>(null);

  const prevIndex = (index - 1 + ITEMS.length) % ITEMS.length;
  const nextIndex = (index + 1) % ITEMS.length;
  const fadeClass = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hide-then-show animation
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 20);
    return () => clearTimeout(timer);
  }, [index]);

  const shift = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setIndex((current) => (current - 1 + ITEMS.length) % ITEMS.length);
    } else {
      setIndex((current) => (current + 1) % ITEMS.length);
    }
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        shift("prev");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        shift("next");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section
      className="w-full px-6 py-12"
      onTouchStart={(event) => {
        touchStart.current = event.targetTouches[0].clientX;
      }}
      onTouchMove={(event) => {
        touchMove.current = event.targetTouches[0].clientX;
      }}
      onTouchEnd={() => {
        if (touchStart.current === null || touchMove.current === null) return;
        const distance = touchStart.current - touchMove.current;
        if (distance > 50) {
          shift("next");
        } else if (distance < -50) {
          shift("prev");
        }
        touchStart.current = null;
        touchMove.current = null;
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between md:gap-12">
        <button
          type="button"
          onClick={() => shift("prev")}
          aria-label="Previous item"
          className="group relative hidden h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 transition-all duration-300 hover:scale-105 hover:shadow-sm md:flex"
        >
          <Media
            item={ITEMS[prevIndex]}
            className="opacity-80 grayscale transition-all group-hover:grayscale-0"
            canAutoplay={canAutoplay}
          />
        </button>
        <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:gap-16">
          <div
            className={`relative h-[360px] w-[280px] shrink-0 overflow-hidden rounded-xl border-2 border-neutral-200 bg-neutral-100 shadow-lg transition-all duration-500 ease-out sm:h-[440px] sm:w-[320px] md:h-[520px] md:w-[380px] ${fadeClass}`}
          >
            <Media
              item={ITEMS[index]}
              className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                isVisible ? "scale-100" : "scale-[1.03]"
              }`}
              canAutoplay={canAutoplay}
            />
          </div>
          <div
            className={`max-w-sm text-center transition-all duration-500 ease-out md:max-w-md md:text-left ${fadeClass}`}
          >
            <h3 className="text-xl font-semibold">{ITEMS[index].title}</h3>
            <p className="mt-2 text-sm text-neutral-700">{ITEMS[index].description}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-neutral-400">
              Use left/right keys or swipe
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => shift("next")}
          aria-label="Next item"
          className="group relative hidden h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 transition-all duration-300 hover:scale-105 hover:shadow-sm md:flex"
        >
          <Media
            item={ITEMS[nextIndex]}
            className="opacity-80 grayscale transition-all group-hover:grayscale-0"
            canAutoplay={canAutoplay}
          />
        </button>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
        <button
          type="button"
          onClick={() => shift("prev")}
          aria-label="Previous item"
          className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 active:bg-red-50"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => shift("next")}
          aria-label="Next item"
          className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 active:bg-red-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
