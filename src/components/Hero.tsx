"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-12 h-72 w-72 rounded-full bg-[#4d082a]/15 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-slate-200/70 blur-[90px]" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-10 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:pb-16 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Engineering Portfolio
          </p>
          <h1 className="font-display mt-4 max-w-2xl text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            I build things across hardware, software, and AI.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600 sm:text-xl">
            From circuits to code to intelligent systems — I follow curiosity wherever it leads.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            I love the moment when a sketch becomes a prototype and the prototype becomes a system. I&apos;m here to
            connect engineering rigor with playful exploration.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#4d082a]" />
            Currently exploring: tactile interfaces + realtime signal analysis.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative z-10 flex items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[40px] bg-[#4d082a]/15 blur-2xl" />
            <div className="relative h-[280px] w-[240px] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_60px_-40px_rgba(15,23,42,0.6)] sm:h-[320px] sm:w-[270px]">
              <Image
                src="/meAvatar.png"
                alt="Clara Forwood"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 70vw"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
