"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MARKER_PCT = 18;

const TAKEAWAYS = [
  {
    n: "01",
    title: "A thin, unconfirmed directional edge",
    body: "XGBoost's 3.6 pp edge above chance is not statistically significant (McNemar's χ² = 2.34, p = 0.126) — real and consistent across seeds, but indistinguishable from the majority baseline by this test.",
  },
  {
    n: "02",
    title: "Magnitude remains noise",
    body: "All regression models converge near R² ≈ 0. Predicting how much the market will move is essentially equivalent to guessing — consistent with the semi-strong form of EMH.",
  },
  {
    n: "03",
    title: "Deep learning offers no decisive edge",
    body: "LSTM and Transformer match but do not beat XGBoost in classification. The directional signal is thin enough that architectural complexity adds no useful inductive bias.",
  },
];

export default function EMHSpectrum() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref}>
      {/* spectrum track — extra bottom padding to give the callout below space */}
      <div className="relative mt-8 pb-32">
        {/* gradient track */}
        <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500" />

        {/* end labels sit just below the track */}
        <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.14em]">
          <span className="text-emerald-700">Fully Random</span>
          <span className="text-rose-600">Fully Predictable</span>
        </div>
        <div className="mt-0.5 flex justify-between text-[10px] text-slate-500">
          <span>EMH holds perfectly</span>
          <span>EMH broken</span>
        </div>

        {/* marker: circle ON the track, callout flowing downward */}
        <motion.div
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${MARKER_PCT}%`, transform: "translateX(-50%)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* dot: -mt-1 centres the 20px dot on the 12px (h-3) track */}
          <div className="-mt-1 h-5 w-5 rounded-full border-2 border-[#4d082a] bg-white shadow ring-2 ring-[#4d082a]/20" />
          {/* connector line going down */}
          <div className="w-0.5 h-8 bg-[#4d082a]" />
          {/* callout box below */}
          <div className="rounded-xl border border-[#4d082a]/30 bg-white px-4 py-3 shadow-md text-center whitespace-nowrap">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4d082a]">This dissertation</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">Semi-Strong EMH</p>
            <p className="text-[11px] text-slate-500 mt-0.5">thin direction edge &middot; magnitude unpredictable</p>
          </div>
        </motion.div>
      </div>

      {/* takeaway cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {TAKEAWAYS.map(({ n, title, body }, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xl font-bold tracking-widest text-[#4d082a]/70">{n}</p>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
