"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ModelRange {
  name: string;
  color: string;
  min: number;
  max: number;
  mean: number;
  std: string;
}

const DATA: ModelRange[] = [
  { name: "Transformer", color: "#6366f1", min: 0.503, max: 0.514, mean: 0.508, std: "±0.004" },
  { name: "MLP",         color: "#c2526e", min: 0.490, max: 0.519, mean: 0.506, std: "±0.010" },
  { name: "LSTM",        color: "#4d082a", min: 0.4939, max: 0.519, mean: 0.5099, std: "±0.010" },
];

const AXIS_MIN = 0.46;
const AXIS_MAX = 0.54;
const RANGE = AXIS_MAX - AXIS_MIN;

function toPct(v: number) {
  return ((v - AXIS_MIN) / RANGE) * 100;
}

export default function SeedDotPlot() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="mt-8">
      <div className="relative pl-28 pr-6">

        {/* axis tick labels */}
        <div className="relative h-5 mb-3">
          {[0.46, 0.48, 0.50, 0.52, 0.54].map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 text-[10px] text-slate-400"
              style={{ left: `${toPct(t)}%` }}
            >
              {t.toFixed(2)}
            </span>
          ))}
        </div>

        {/* rows */}
        <div className="space-y-7">
          {DATA.map(({ name, color, min, max, mean, std }, ri) => {
            const minPct  = toPct(min);
            const maxPct  = toPct(max);
            const meanPct = toPct(mean);
            const barWidthPct = maxPct - minPct;

            return (
              <div key={name} className="relative flex items-center h-8">
                {/* model label */}
                <span className="absolute -left-28 w-24 text-right text-xs font-semibold text-slate-700 leading-tight">
                  {name}
                  <span className="block text-[10px] font-normal text-slate-400">{std}</span>
                </span>

                {/* full-width light track */}
                <div className="relative w-full h-1 rounded-full bg-slate-100">

                  {/* 50% dashed baseline */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-px h-6 border-l border-dashed border-slate-300"
                    style={{ left: `${toPct(0.5)}%` }}
                  />

                  {/* coloured range bar min→max */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full"
                    style={{
                      left: `${minPct}%`,
                      backgroundColor: color,
                      opacity: 0.35,
                    }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${barWidthPct}%` } : { width: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + ri * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* min cap */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-0.5 rounded-full"
                    style={{ left: `${minPct}%`, backgroundColor: color, opacity: 0.5 }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + ri * 0.1 }}
                  />

                  {/* max cap */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-0.5 rounded-full"
                    style={{ left: `${maxPct}%`, backgroundColor: color, opacity: 0.5 }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + ri * 0.1 }}
                  />

                  {/* mean circle */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow"
                    style={{ left: `${meanPct}%`, backgroundColor: color }}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + ri * 0.1, type: "spring", stiffness: 320 }}
                  />

                  {/* min/mean/max value labels */}
                  <motion.span
                    className="absolute top-5 -translate-x-1/2 text-[10px] text-slate-400"
                    style={{ left: `${minPct}%` }}
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.45 + ri * 0.1 }}
                  >
                    {min.toFixed(3)}
                  </motion.span>
                  <motion.span
                    className="absolute -top-5 -translate-x-1/2 text-[10px] font-bold"
                    style={{ left: `${meanPct}%`, color }}
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.45 + ri * 0.1 }}
                  >
                    {mean.toFixed(3)}
                  </motion.span>
                  <motion.span
                    className="absolute top-5 -translate-x-1/2 text-[10px] text-slate-400"
                    style={{ left: `${maxPct}%` }}
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.45 + ri * 0.1 }}
                  >
                    {max.toFixed(3)}
                  </motion.span>
                </div>
              </div>
            );
          })}
        </div>

        {/* x-axis baseline */}
        <div className="mt-10 h-px w-full bg-slate-200" />

        {/* 50% label */}
        <span
          className="absolute mt-1 text-[10px] text-slate-400 -translate-x-1/2"
          style={{ left: `calc(${toPct(0.5)}% + 28px)`, top: "100%" }}
        >
          50% chance
        </span>
      </div>

      {/* legend */}
      <div className="mt-12 flex flex-wrap items-center gap-5 text-[11px]">
        {DATA.map(({ name, color }) => (
          <span key={name} className="flex items-center gap-2 text-slate-600">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </span>
        ))}
        <span className="text-slate-400">bar = seed range &middot; circle = mean &middot; seeds: 42, 123, 7, 2024, 99</span>
      </div>
    </div>
  );
}
