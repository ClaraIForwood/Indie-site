"use client";

import type { ReactNode } from "react";
import { Component, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CircuitBoard,
  Cpu,
  NotebookPen,
  Sparkles,
  Wrench,
  LineChart,
  BookOpen,
  Lightbulb,
  FileText,
  Layers,
  CheckCircle2,
  Compass,
  DraftingCompass,
  Radio,
} from "lucide-react";
import { ElectronicsCanvas, ElectronicsCarousel } from "./ClientSections";

// Brand accent — the dark red from "Clara Forwood" in the nav
const ACCENT = "#4d082a";
// Lighter tint of the same hue, readable on dark (slate-950) backgrounds
const ACCENT_LIGHT = "#c2526e";

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Avoid crashing the page if the 3D model or notebook extract fails.
    console.error("Electronics canvas failed to render", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function CanvasErrorFallback() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-slate-900/70" />
      <div className="absolute bottom-6 left-6 right-6 z-10 rounded-2xl border border-slate-700 bg-slate-900/85 p-4 text-center backdrop-blur-sm">
        <p className="mb-1 text-xs uppercase tracking-[0.18em]" style={{ color: ACCENT_LIGHT }}>
          Error 404
        </p>
        <p className="text-sm leading-7 text-slate-200">
          Notebook extract / 3D model failed to load.
        </p>
      </div>
    </div>
  );
}

const timeline = [
  {
    year: "Year 1",
    title: "The spark",
    text: "I came into engineering because I was curious about how things worked. Very quickly, the degree became more than equations and lab sheets — it became a way of thinking in systems, trade-offs, and structure.",
    icon: DraftingCompass,
  },
  {
    year: "Year 2",
    title: "The grind",
    text: "Labs, problem sheets, and real technical setbacks made me more resilient. I learned that persistence isn't separate from engineering — it is part of the craft. Signal analysis and embedded systems pushed me hardest.",
    icon: Cpu,
  },
  {
    year: "Industrial Placement",
    title: "Sandwich year at AIRBUS",
    text: "My placement year with AIRBUS showed me how large systems are built, tested, and verified in practice. It grounded the degree in real-world engineering discipline and sharpened how I approached constraints, process, and reliability.",
    icon: Radio,
  },
  {
    year: "Final Year",
    title: "My own kind of engineer",
    text: "Final year brought everything together. I wrote my dissertation on AI in finance and applied the same systems thinking, modelling, and rigor I developed throughout the degree.",
    icon: Lightbulb,
  },
];

const timelineContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

const timelineItem = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -24 : 24,
    y: 8,
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const timelineLine = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.9 } },
};

const pillars = {
  Core: {
    title: "Foundational theory",
    icon: BookOpen,
    color: "wine",
    details:
      "Mathematics, signals, modelling — the underlying principles that taught me complex systems are only manageable when you truly understand the fundamentals beneath them.",
    focus: ["Mathematical reasoning", "Signals and systems"],
    skill: "Analytical confidence",
  },
  Applied: {
    title: "Hands-on engineering",
    icon: Wrench,
    color: "blue",
    details:
      "Labs, PCB design, soldering, oscilloscope testing — this is where theory became something tangible. I learned to move from an idea that should work to something that actually does.",
    focus: ["Testing and debugging", "Design under constraints"],
    skill: "Practical execution",
  },
  Systems: {
    title: "Systems thinking",
    icon: Cpu,
    color: "emerald",
    details:
      "Control, computation, and interconnected behaviour taught me to stop seeing components in isolation — and start seeing feedback loops, dependencies, and architecture instead.",
    focus: ["Interconnected design", "Hardware + software thinking"],
    skill: "Multidisciplinary judgement",
  },
} as const;

type PillarKey = keyof typeof pillars;

const colorClasses = {
  wine: {
    bg: "bg-[#4d082a]",
    soft: "bg-rose-50",
    text: "text-[#4d082a]",
    border: "border-rose-300",
    ring: "ring-rose-200",
  },
  blue: {
    bg: "bg-blue-600",
    soft: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    ring: "ring-blue-200",
  },
  emerald: {
    bg: "bg-emerald-500",
    soft: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    ring: "ring-emerald-200",
  },
} as const;

const notebookCards = [
  {
    label: "Observation",
    title: "I'm at my best when engineering becomes expressive",
    text: "The degree helped me realise I don't just enjoy solving technical problems — I enjoy shaping them into systems, tools, and experiences people can connect with.",
  },
  {
    label: "Reflection",
    title: "The process mattered as much as the result",
    text: "A lot of growth came from debugging, revisiting assumptions, and trying again. Engineering gave me patience and a much higher tolerance for complexity.",
  },
  {
    label: "Build Log",
    title: "I became more multidisciplinary over time",
    text: "What began as a circuits degree gradually expanded into software, data, AI, and independent creative-technical projects far beyond the lecture theatre.",
  },
];

const lessons = [
  "How to break difficult technical problems into solvable parts",
  "How to stay calm when the first version inevitably fails",
  "How to move between maths, code, hardware, and design thinking",
  "How to communicate technical work clearly and precisely",
];

const projectPhases = {
  sketch: {
    label: "The brief",
    content: (
      <div className="p-8 text-center">
        <Layers className="mx-auto mb-4 h-20 w-20 text-slate-300" />
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Initialising concept...</p>
        <p className="mt-4 max-w-xs mx-auto text-sm text-slate-500">
          Design and implement an IR audio transmission system — modulator, carrier frequency, receiver PCB — all from scratch.
        </p>
      </div>
    ),
  },
  final: {
    label: "The result",
    content: (
      <div className="p-8 text-center">
        <div
          className="flex h-40 w-40 mx-auto rotate-3 scale-110 items-center justify-center rounded-3xl shadow-2xl"
          style={{ backgroundColor: ACCENT }}
        >
          <Radio className="h-20 w-20 text-white opacity-30" />
        </div>
        <p className="mt-8 text-sm font-black text-slate-900">
          43 kHz carrier · Phase-locked loop · Clean audio at 10 cm
        </p>
        <p className="mt-2 text-xs text-slate-500">IR Telecoms System — Year 3 lab project</p>
      </div>
    ),
  },
};

type PhaseKey = keyof typeof projectPhases;

export default function ElectronicsPageClient() {
  const [activePillar, setActivePillar] = useState<PillarKey>("Core");
  const [projectPhase, setProjectPhase] = useState<PhaseKey>("sketch");
  const [canvasFailed, setCanvasFailed] = useState(false);

  const active = useMemo(() => pillars[activePillar], [activePillar]);
  const ActiveIcon = active.icon;
  const currentColor = colorClasses[active.color];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 pb-28 pt-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial glows using the brand red */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at top left, rgba(77,8,42,0.35), transparent 28%), radial-gradient(circle at bottom right, rgba(77,8,42,0.15), transparent 24%)`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.2em]">
                <span className="rounded-full px-3 py-1 text-white" style={{ backgroundColor: ACCENT }}>
                  BEng Electrical &amp; Electronic
                </span>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Personal Archive</span>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Lab Notes + Story</span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
              >
                Engineering with{" "}
                <span style={{ color: ACCENT_LIGHT }}>intent</span>
                , and becoming more myself through it.
              </motion.h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                This isn&apos;t just a list of modules. It&apos;s a personal record of how studying Electrical and Electronic Engineering at Exeter shaped the way I think, solve problems, and build things.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/in/clara-forwood-5272ba268/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-7 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1"
                  style={{
                    backgroundColor: ACCENT,
                    boxShadow: `0 10px 30px rgba(77,8,42,0.35)`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6b0f3a")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                >
                  Connect on LinkedIn <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/#contact"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-white transition-all hover:bg-slate-800"
                >
                  <FileText className="h-4 w-4" /> Get in touch
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {([
                  ["Focus", "Systems, software, analysis, hardware design"],
                  ["Dissertation", "The role of AI in finance"],
                ] as const).map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-100">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-D canvas card */}
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border-4 border-slate-800 bg-slate-900 shadow-2xl">
                <div className="relative aspect-[0.95/1] flex items-center justify-center p-8">
                  <CanvasErrorBoundary fallback={<CanvasErrorFallback />}>
                    <>
                      <div className="h-full w-full">
                        <ElectronicsCanvas className="h-full w-full" onError={() => setCanvasFailed(true)} />
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 z-10 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 backdrop-blur-sm">
                        {canvasFailed ? (
                          <>
                            <p
                              className="mb-1 text-xs uppercase tracking-[0.18em]"
                              style={{ color: ACCENT_LIGHT }}
                            >
                              Error 404
                            </p>
                            <p className="text-sm leading-7 text-slate-200">
                              Notebook extract / 3D model failed to load.
                            </p>
                          </>
                        ) : (
                          <>
                            <p
                              className="mb-1 text-xs uppercase tracking-[0.18em]"
                              style={{ color: ACCENT_LIGHT }}
                            >
                              Notebook Extract
                            </p>
                            <p className="text-sm leading-7 text-slate-200">
                              I started this degree because I liked understanding how things worked. I&apos;m leaving it with something more valuable: a way of thinking.
                            </p>
                          </>
                        )}
                      </div>
                    </>
                  </CanvasErrorBoundary>
                </div>
              </div>
              <div
                className="absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-25 blur-3xl"
                style={{ backgroundColor: ACCENT }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Anatomy of my degree</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            I didn&apos;t just collect modules. I built a toolkit of mental models, technical instincts, and ways of working. Click through the pillars that shaped me most.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4">
            {(Object.entries(pillars) as [PillarKey, (typeof pillars)[PillarKey]][]).map(([key, value]) => {
              const PillarIcon = value.icon;
              const colors = colorClasses[value.color];
              const isActive = activePillar === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePillar(key)}
                  className={`flex items-center gap-4 rounded-[1.5rem] border-2 p-5 text-left transition-all ${
                    isActive
                      ? `${colors.border} bg-white shadow-xl ring-4 ${colors.ring} translate-x-2`
                      : "border-transparent bg-slate-100 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className={`rounded-xl p-3 text-white ${colors.bg}`}>
                    <PillarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{key}</h3>
                    <p className="text-sm text-slate-500">{value.title}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative flex min-h-[360px] items-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="relative z-10">
              <div className={`mb-6 inline-flex rounded-xl p-3 text-white ${currentColor.bg}`}>
                <ActiveIcon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-black text-slate-900">{active.title}</h3>
              <p className="mt-4 max-w-2xl text-xl italic leading-9 text-slate-600">&ldquo;{active.details}&rdquo;</p>
              <div className="mt-8 grid gap-4 border-t border-slate-100 pt-8 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Key focus</h4>
                  <ul className="space-y-1 text-sm font-medium text-slate-700">
                    {active.focus.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Skill gained</h4>
                  <p className={`text-sm font-bold ${currentColor.text}`}>{active.skill}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="overflow-hidden bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <h2
            className="mb-16 text-center text-4xl font-black tracking-tight"
            style={{ color: ACCENT_LIGHT }}
          >
            The journey
          </h2>
          <motion.div
            className="relative space-y-16"
            variants={timelineContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div
              className="absolute bottom-0 left-8 top-0 w-px -translate-x-1/2 bg-slate-800 md:left-1/2"
              variants={timelineLine}
              style={{ transformOrigin: "top" }}
            />
            {timeline.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={item.year}
                  custom={idx}
                  variants={timelineItem}
                  className={`relative flex items-center gap-12 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div
                    className="absolute left-0 z-20 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl outline outline-8 outline-slate-950 md:static"
                    style={{
                      backgroundColor: ACCENT,
                      boxShadow: `0 8px 24px rgba(77,8,42,0.45)`,
                    }}
                  >
                    <ItemIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 pl-20 md:w-1/2 md:pl-0">
                    <div
                      className="group rounded-[1.75rem] border border-slate-800 bg-slate-900 p-8 transition-all"
                      style={{ ["--hover-border" as string]: `${ACCENT}80` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = `${ACCENT}80`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "")
                      }
                    >
                      <span
                        className="mb-2 block text-xl font-black"
                        style={{ color: ACCENT_LIGHT }}
                      >
                        {item.year}
                      </span>
                      <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                      <p className="mt-3 leading-8 text-slate-400">{item.text}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── What I learned + Project showcase ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.98fr]">
          {/* Left — skills */}
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-stone-500" />
              <h2 className="text-2xl font-semibold tracking-tight">What I actually learned</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: CircuitBoard,
                  title: "Electronics & systems",
                  note: "Signals, circuits, and interconnected behaviour taught me to think in structure rather than surface detail.",
                  tag: "systems thinking",
                },
                {
                  icon: Cpu,
                  title: "Embedded computing",
                  note: "Code made engineering feel alive. I loved the moment theory became something interactive, testable, and real.",
                  tag: "technical depth",
                },
                {
                  icon: LineChart,
                  title: "Analysis & modelling",
                  note: "Mathematical modelling sharpened how I deal with uncertainty, evidence, and decisions under complexity.",
                  tag: "analytical mindset",
                },
                {
                  icon: Wrench,
                  title: "Design & build",
                  note: "The most memorable work was practical: iterating, debugging, testing, and shaping rough ideas into functioning outcomes.",
                  tag: "hands-on",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <Icon className="h-5 w-5 text-stone-600" />
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">{item.note}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Core takeaways</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {lessons.map((item) => (
                  <div key={item} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — project showcase */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Sketch to reality</h2>
            <p className="mb-3 mt-6 text-lg font-medium text-slate-600">
              Project:{" "}
              <span className="italic" style={{ color: ACCENT }}>
                IR Audio Telecoms System
              </span>
            </p>
            <p className="max-w-xl leading-8 text-slate-600">
              Designed and built the complete modulation and demodulation subsystems for a wireless IR audio transmitter — from reading the CD74HC7046 datasheet to a soldered, oscilloscope-verified receiver PCB.
            </p>

            <div className="mb-8 mt-8 flex w-fit gap-2 rounded-xl bg-slate-100 p-1">
              {(Object.keys(projectPhases) as PhaseKey[]).map((phase) => (
                <button
                  key={phase}
                  onClick={() => setProjectPhase(phase)}
                  className={`rounded-lg px-6 py-2 font-bold capitalize transition-all ${
                    projectPhase === phase
                      ? "bg-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  style={
                    projectPhase === phase
                      ? { color: phase === "sketch" ? ACCENT : "#2563eb" }
                      : undefined
                  }
                >
                  {projectPhases[phase].label}
                </button>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="space-y-4">
                {[
                  "43 kHz carrier via phase-locked loop",
                  "Receiver PCB designed in Ultiboard",
                  "Validated with oscilloscope + FFT analysis",
                  "Clear audio transmission at 10 cm range",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-slate-300 bg-slate-50">
                <motion.div
                  key={projectPhase}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {projectPhases[projectPhase].content}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Notebook reflections ── */}
      <section className="mx-auto max-w-7xl px-6 pb-8 md:px-10">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 pb-7 shadow-sm md:p-8 md:pb-9">
          <div className="mb-6 flex items-center gap-3">
            <NotebookPen className="h-5 w-5 text-stone-500" />
            <h2 className="text-2xl font-semibold tracking-tight">Notebook reflections</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {notebookCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[1.75rem] border border-stone-300 bg-[linear-gradient(180deg,#fefce8_0%,#fafaf9_100%)] p-5 shadow-sm"
                style={{ rotate: "-0.5deg" }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700">{card.label}</p>
                <h3 className="mt-3 text-lg font-semibold text-stone-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-700">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects carousel ── */}
      <section className="bg-stone-50 pb-4">
        <div className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
          <div className="mb-2 flex items-center gap-3">
            <Compass className="h-5 w-5 text-stone-500" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Lab projects</h2>
          </div>
          <p className="mb-2 text-sm text-slate-500">A selection of the hands-on work from across the degree.</p>
        </div>
        <ElectronicsCarousel />
      </section>

      {/* ── Footer CTA ── */}
      <footer className="bg-slate-950 pb-12 pt-24 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
          <div
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl"
            style={{ backgroundColor: ACCENT }}
          >
            <Lightbulb className="h-10 w-10" />
          </div>
          <h2 className="mb-6 text-4xl font-black">This degree became the foundation for everything else I like to build.</h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-400">
            The way I now approach software, AI, technical experiments, and independent projects all comes back to this training: understand the system, identify constraints, test ideas quickly, and keep refining until it works.
          </p>

          <div className="mx-auto mb-20 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
            <a
              href="/crash-site"
              className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all hover:bg-slate-800"
            >
              <ArrowRight className="h-5 w-5" style={{ color: ACCENT_LIGHT }} />
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Next up</p>
                <p className="font-bold">See my indie game project</p>
              </div>
            </a>
            <Link
              href="/#contact"
              className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all hover:bg-slate-800"
            >
              <FileText className="h-5 w-5" style={{ color: ACCENT_LIGHT }} />
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Get in touch</p>
                <p className="font-bold">Contact or collaborate</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-900 pt-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 md:flex-row">
            <p>Clara Forwood — BEng Electrical &amp; Electronic Engineering</p>
            <p>University of Exeter · Class of 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}



