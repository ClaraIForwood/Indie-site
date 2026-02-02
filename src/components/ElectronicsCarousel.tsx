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
      "Designed and implemented the modulation and demodulation subsystems for a wireless audio transmission system using infrared technology, originally conceived as a baby monitoring solution. Taking ownership of the entire receiver PCB from design through to soldering, I engineered a frequency modulation circuit using the CD74HC7046 phase-locked loop chip, achieving a 43kHz carrier frequency optimized for the IR diode's operational range. Through comprehensive circuit analysis and iterative testing, I calculated precise component values to handle human voice frequencies (50Hz-17kHz) and designed integrated low-pass filters to ensure clean signal recovery. The system successfully transmitted clear, discernible audio at the specified 10cm range. I independently validated both subsystems through oscilloscope analysis before integration, demonstrating strong analytical skills in comparing theoretical calculations against experimental results. This project showcased my ability to translate datasheets into functional circuits, debug complex signal processing chains, and deliver reliable hardware solutions within specified constraints. Developed using Multisim and Ultiboard for PCB design.",
    type: "image",
    src: "/project-electronics.jpg",
    alt: "Telecoms Project",
  },
  {
    title: "Arduino Microcontroller Interface",
    description:
      "Developed a button-driven interface system with real-time 7-segment LED display output as part of an embedded systems course. Implemented multiplexing techniques to efficiently control the multi-digit display while managing multiple button inputs through interrupt-driven programming. The project required careful handling of hardware interrupts to ensure responsive button detection and state machine logic to manage display states and user input sequences. Working independently, I gained hands-on experience with C++ programming for microcontrollers, exploring the ATmega328P architecture and Arduino framework internals. This project strengthened my understanding of low-level hardware-software integration, timing constraints in embedded systems, and efficient resource management in microcontroller applications. The implementation demonstrated practical skills in circuit prototyping, digital I/O control, and real-time embedded programming essential for IoT and embedded systems development.",
    type: "video",
    src: "/vidArduino.mp4",
    poster: "/project-electronics.jpg",
  },
  {
    title: "Signal Analysis",
    description:
      "Conducted experimental analysis of digital baseband signalling systems using the Emona Telecoms-Trainer 101 platform. Working independently, I systematically investigated bandwidth limitation, noise, and inter-symbol interference effects on signal integrity across multiple line coding schemes (NRZ-L, RZ, Bipolar RZ, Manchester). Performed signal quality assessment through eye diagram analysis, identifying maximum sustainable bit rates and optimal threshold detection parameters for signal recovery. Demonstrated proficiency in oscilloscope operation, FFT spectral analysis, and comparative evaluation of encoding methods. Applied Shannon-Hartley theorem principles to correlate theoretical channel capacity predictions with measured experimental data. The project involved configuring voltage-controlled oscillators, tuneable low-pass filters, and comparator circuits to simulate real-world communication channel impairments, strengthening my understanding of fundamental telecommunications principles and the practical trade-offs between data rate, bandwidth, and noise immunity in digital systems.",
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
  const [canAutoplay, setCanAutoplay] = useState(true);
  const touchStart = useRef<number | null>(null);
  const touchMove = useRef<number | null>(null);

  const prevIndex = (index - 1 + ITEMS.length) % ITEMS.length;
  const nextIndex = (index + 1) % ITEMS.length;
  const fadeClass = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 20);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverNone = window.matchMedia("(hover: none)").matches;
    const touch = navigator.maxTouchPoints > 0;
    setCanAutoplay(!(reduce || hoverNone || touch));
  }, []);

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

  const shift = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setIndex((current) => (current - 1 + ITEMS.length) % ITEMS.length);
    } else {
      setIndex((current) => (current + 1) % ITEMS.length);
    }
  };

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
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
        <button
          type="button"
          onClick={() => shift("prev")}
          aria-label="Previous item"
          className="group relative hidden h-28 w-28 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 transition-all duration-300 hover:scale-105 hover:shadow-sm md:flex"
        >
          <Media
            item={ITEMS[prevIndex]}
            className="opacity-80 grayscale transition-all group-hover:grayscale-0"
            canAutoplay={canAutoplay}
          />
        </button>
        <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:gap-14">
          <div
            className={`relative h-[360px] w-[260px] shrink-0 overflow-hidden rounded-xl border-2 border-neutral-200 bg-neutral-100 shadow-lg transition-all duration-500 ease-out sm:h-[440px] sm:w-[300px] md:h-[550px] md:w-[350px] ${fadeClass}`}
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
            className={`max-w-xs text-center transition-all duration-500 ease-out md:text-left ${fadeClass}`}
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
          className="group relative hidden h-28 w-28 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 transition-all duration-300 hover:scale-105 hover:shadow-sm md:flex"
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
