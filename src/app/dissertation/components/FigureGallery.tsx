"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Figure {
  src: string;
  caption: string;
  description: string;
}

const FIGURES: Figure[] = [
  {
    src: "/dissertation/figures/model_comparison_bar.svg",
    caption: "Model Comparison — Balanced Accuracy",
    description: "All five models vs baselines. XGBoost leads at 53.6%; deep learning does not outperform the tabular benchmark.",
  },
  {
    src: "/dissertation/figures/roc_curves_all_models.svg",
    caption: "ROC Curves — All Models",
    description: "AUC scores cluster just above the random diagonal (0.5). The Transformer's high recall drives its curve shape.",
  },
  {
    src: "/dissertation/figures/confusion_matrices_all_models.svg",
    caption: "Confusion Matrices — All Models",
    description: "The Transformer's matrix reveals near-total recall of 'up' days — a class-imbalance failure mode.",
  },
  {
    src: "/dissertation/figures/xgboost_feature_importance.svg",
    caption: "XGBoost Feature Importance (Gain)",
    description: "Bollinger Band positions and moving-average ratios dominate — consistent with mean-reversion microstructure.",
  },
  {
    src: "/dissertation/figures/yearly_balanced_accuracy.svg",
    caption: "Yearly Balanced Accuracy — XGBoost",
    description: "The directional edge is not concentrated in one year; XGBoost maintains its advantage across the 2019–2021 test period.",
  },
  {
    src: "/dissertation/figures/training_curves.svg",
    caption: "Training Curves — Deep Learning Models",
    description: "Validation loss stabilises early; early stopping prevents overfitting. LSTM and Transformer converge similarly.",
  },
  {
    src: "/dissertation/figures/regression_training_curves.svg",
    caption: "Training Curves — Regression Models",
    description: "Regression loss curves converge near the historical mean baseline, confirming that magnitude prediction is intractable.",
  },
];

export default function FigureGallery() {
  const [active, setActive] = useState<Figure | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* scrollable strip */}
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
        {FIGURES.map((fig) => (
          <button
            key={fig.src}
            onClick={() => setActive(fig)}
            className="group relative shrink-0 w-64 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2526e]"
          >
            <div className="relative h-44 w-full bg-white">
              <Image
                src={fig.src}
                alt={fig.caption}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="p-4 text-left">
              <p className="text-xs font-semibold text-white leading-tight">{fig.caption}</p>
              <p className="mt-1 text-[11px] text-slate-500 leading-4 line-clamp-2">{fig.description}</p>
            </div>
            {/* hover overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#c2526e]/50 transition-colors" />
            <div className="absolute top-2 right-2 rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              expand
            </div>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-600">
        {FIGURES.length} figures from the dissertation · click any to expand · generated with matplotlib + seaborn
      </p>

      {/* lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl border border-slate-700 bg-white overflow-hidden shadow-2xl"
            >
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={active.src}
                  alt={active.caption}
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              </div>
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <p className="text-sm font-semibold text-slate-900">{active.caption}</p>
                <p className="mt-1 text-sm text-slate-600 leading-6">{active.description}</p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 rounded-full bg-slate-900/70 p-1.5 text-white hover:bg-slate-700 transition-colors"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
