"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface R2Row {
  name: string;
  r2: number;
  baseline?: boolean;
  best?: boolean;
}

const ROWS: R2Row[] = [
  { name: "MLP", r2: 0.0098, best: true },
  { name: "LSTM", r2: 0.0073 },
  { name: "Historical Mean", r2: -0.0021, baseline: true },
  { name: "Transformer", r2: -0.0119 },
  { name: "XGBoost", r2: -0.0625 },
  { name: "Ridge Regression", r2: -0.0667 },
  { name: "Persistence Baseline", r2: -1.5611, baseline: true },
];

const CLAMP_NEGATIVE = -0.12;
const MAX_POSITIVE = 0.0098;
const RANGE = Math.abs(CLAMP_NEGATIVE) + MAX_POSITIVE;

function barWidth(r2: number, containerPct: number): number {
  const clamped = Math.max(r2, CLAMP_NEGATIVE);
  return (Math.abs(clamped) / RANGE) * containerPct;
}

export default function R2Chart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const zeroPct = (Math.abs(CLAMP_NEGATIVE) / RANGE) * 100;

  return (
    <div ref={ref} className="mt-6 space-y-2.5">
      {/* axis labels */}
      <div className="relative flex text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <span className="absolute left-[28px]">← worse</span>
        <span className="absolute right-0">better →</span>
        <span
          className="absolute -translate-x-1/2"
          style={{ left: `calc(${zeroPct}% + 28px)` }}
        >
          R² = 0
        </span>
      </div>

      {ROWS.map(({ name, r2, baseline, best }) => {
        const isPositive = r2 > 0;
        const isClamped = r2 < CLAMP_NEGATIVE;
        const displayValue = isClamped ? `${r2.toFixed(4)} (clamped)` : (r2 >= 0 ? `+${r2.toFixed(4)}` : r2.toFixed(4));
        const labelColor = best
          ? "text-emerald-700 font-semibold"
          : baseline
          ? "text-slate-400"
          : "text-slate-700";
        const barColor = isPositive
          ? best
            ? "bg-emerald-500"
            : "bg-emerald-400"
          : baseline
          ? "bg-slate-300"
          : "bg-rose-400";

        return (
          <div key={name} className="flex items-center gap-2">
            {/* name label — fixed 28-char wide column */}
            <span className={`w-36 shrink-0 text-xs text-right pr-2 ${labelColor}`}>{name}</span>

            {/* bar track */}
            <div className="relative flex-1 h-5 rounded-sm overflow-hidden bg-slate-100">
              {/* zero-line */}
              <div
                className="absolute top-0 bottom-0 w-px bg-slate-400 z-10"
                style={{ left: `${zeroPct}%` }}
              />

              {/* bar */}
              {isPositive ? (
                <motion.div
                  className={`absolute top-0 bottom-0 ${barColor} rounded-r-sm`}
                  style={{ left: `${zeroPct}%` }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${barWidth(r2, 100 - zeroPct)}%` } : { width: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                />
              ) : (
                <motion.div
                  className={`absolute top-0 bottom-0 ${barColor} rounded-l-sm`}
                  initial={{ width: 0, right: `${100 - zeroPct}%` }}
                  animate={
                    inView
                      ? { width: `${barWidth(r2, zeroPct)}%`, right: `${100 - zeroPct}%` }
                      : { width: 0, right: `${100 - zeroPct}%` }
                  }
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                />
              )}
            </div>

            {/* value */}
            <span
              className={`w-28 shrink-0 text-right font-mono text-[11px] ${
                isPositive ? "text-emerald-600 font-semibold" : baseline ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {displayValue}
            </span>
          </div>
        );
      })}

      <p className="pt-2 text-[11px] text-slate-400 leading-5">
        Persistence baseline R² = −1.56 clamped to chart scale for readability · green = beats no-information baseline · all models within ±0.01 of zero
      </p>
    </div>
  );
}
