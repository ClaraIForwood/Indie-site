"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModelData {
  name: string;
  type: string;
  task: string;
  arch: string;
  role: string;
  bestCls: boolean;
  bestReg: boolean;
  cls: { acc: number; auc: number; prec: number; recall: number; f1: number };
  reg: { rmse: number; mae: number; r2: number };
  // approximate confusion matrix (N=565, ~328 positive / ~237 negative)
  cm: { tp: number; fp: number; fn: number; tn: number };
  insight: string;
  pathology?: string;
}

const MODELS: ModelData[] = [
  {
    name: "XGBoost",
    type: "Ensemble Tree",
    task: "Both",
    arch: "max_depth 6 · train-only imputation · gain-based splits",
    role: "State-of-the-art tabular benchmark",
    bestCls: true,
    bestReg: false,
    cls: { acc: 0.536, auc: 0.545, prec: 0.616, recall: 0.518, f1: 0.563 },
    reg: { rmse: 0.0159, mae: 0.0094, r2: -0.0625 },
    cm: { tp: 170, fp: 106, fn: 158, tn: 131 },
    insight: "Best classifier overall. Gain-based feature splits pick up Bollinger Band and moving-average mean-reversion signals that gradient boosting handles naturally on tabular data. Its edge over the majority baseline is not statistically significant (McNemar χ² = 2.34, p = 0.126).",
  },
  {
    name: "Transformer",
    type: "Attention",
    task: "Both",
    arch: "1 encoder layer · d_model 32 · 2 heads · seq len 20",
    role: "Self-attention over time steps",
    bestCls: false,
    bestReg: false,
    cls: { acc: 0.516, auc: 0.526, prec: 0.588, recall: 0.985, f1: 0.737 },
    reg: { rmse: 0.0155, mae: 0.0092, r2: -0.0119 },
    cm: { tp: 323, fp: 226, fn: 5, tn: 11 },
    insight: "High F1 is misleading — 98.5% recall means the model predicts 'up' for almost every observation, leaving only 11 true negatives out of 237 actual down days.",
    pathology: "Class-imbalance collapse: predicts 'up' unconditionally",
  },
  {
    name: "MLP",
    type: "Neural Net",
    task: "Both",
    arch: "128 → 64 → 1 · ReLU · Dropout 0.5 · BCEWithLogits / MSE",
    role: "Tabular deep learning reference",
    bestCls: false,
    bestReg: true,
    cls: { acc: 0.519, auc: 0.504, prec: 0.594, recall: 0.735, f1: 0.657 },
    reg: { rmse: 0.0153, mae: 0.0092, r2: 0.0098 },
    cm: { tp: 241, fp: 165, fn: 87, tn: 72 },
    insight: "Best regressor by a thin R² margin (+0.0098 vs historical mean). Dropout regularisation avoids the Transformer's recall collapse, but the MLP still leans toward predicting 'up'.",
  },
  {
    name: "Logistic Regression",
    type: "Linear",
    task: "Classification",
    arch: "Median imputation · standardisation · L2 regularisation",
    role: "Interpretable linear baseline",
    bestCls: false,
    bestReg: false,
    cls: { acc: 0.497, auc: 0.498, prec: 0.571, recall: 0.183, f1: 0.277 },
    reg: { rmse: 0.0159, mae: 0.0096, r2: -0.0667 },
    cm: { tp: 60, fp: 45, fn: 268, tn: 192 },
    insight: "Opposite failure mode to the Transformer — extremely conservative, predicting 'down' most of the time. Significantly worse than the majority baseline (McNemar χ² = 12.23, p = 0.0005), driven by very low recall (18.3%), not a superior error pattern.",
  },
  {
    name: "LSTM",
    type: "Recurrent",
    task: "Both",
    arch: "1 layer · hidden 32 · seq 20 · Dropout 0.5 · grad clip",
    role: "Temporal sequence modelling",
    bestCls: false,
    bestReg: false,
    cls: { acc: 0.484, auc: 0.507, prec: 0.565, recall: 0.488, f1: 0.524 },
    reg: { rmse: 0.0153, mae: 0.0092, r2: 0.0073 },
    cm: { tp: 160, fp: 123, fn: 168, tn: 114 },
    insight: "Most balanced confusion matrix of the deep learning models, but falls below the majority baseline in balanced accuracy. Significant vs XGBoost via McNemar (χ² = 4.0, p = 0.046) — in favour of XGBoost.",
  },
];

function MiniCM({ tp, fp, fn, tn }: { tp: number; fp: number; fn: number; tn: number }) {
  const total = tp + fp + fn + tn;
  const cells = [
    { label: "TP", value: tp, color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { label: "FN", value: fn, color: "bg-rose-100 text-rose-700 border-rose-200" },
    { label: "FP", value: fp, color: "bg-rose-100 text-rose-700 border-rose-200" },
    { label: "TN", value: tn, color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  ];

  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Confusion Matrix (N={total})
      </p>
      <div className="inline-grid grid-cols-2 gap-1">
        {cells.map(({ label, value, color }) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center rounded-lg border px-4 py-2 ${color}`}
            style={{ opacity: 0.4 + (value / total) * 1.2 }}
          >
            <span className="text-[10px] font-bold">{label}</span>
            <span className="text-lg font-bold leading-tight">{value}</span>
            <span className="text-[10px] opacity-70">{((value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-3 text-[10px] text-slate-400">
        <span>← Actual</span>
        <span>↑ Predicted</span>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  a,
  b,
  fmt = (v: number) => v.toFixed(4),
  higherBetter = true,
}: {
  label: string;
  a: number;
  b: number;
  fmt?: (v: number) => string;
  higherBetter?: boolean;
}) {
  const aWins = higherBetter ? a > b : a < b;
  const bWins = higherBetter ? b > a : b < a;
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <span className="w-24 shrink-0 text-xs text-slate-500">{label}</span>
      <span className={`flex-1 text-right font-mono text-xs ${aWins ? "font-bold text-[#4d082a]" : "text-slate-600"}`}>
        {fmt(a)} {aWins && "↑"}
      </span>
      <span className="w-4 text-center text-slate-300 text-xs">vs</span>
      <span className={`flex-1 text-left font-mono text-xs ${bWins ? "font-bold text-[#4d082a]" : "text-slate-600"}`}>
        {bWins && "↑ "}{fmt(b)}
      </span>
    </div>
  );
}

export default function ModelExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string[]>([]);

  const selectedModel = MODELS.find((m) => m.name === selected) ?? null;
  const compareMode = pinned.length === 2;
  const modelA = compareMode ? MODELS.find((m) => m.name === pinned[0])! : null;
  const modelB = compareMode ? MODELS.find((m) => m.name === pinned[1])! : null;

  function togglePin(name: string) {
    if (pinned.includes(name)) {
      setPinned(pinned.filter((p) => p !== name));
    } else if (pinned.length < 2) {
      setPinned([...pinned, name]);
    } else {
      setPinned([pinned[1], name]);
    }
  }

  return (
    <div>
      <p className="mb-1 text-xs text-slate-500">
        Click a card to inspect · pin two cards to compare
      </p>

      {/* model card grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODELS.map((m) => {
          const isSelected = selected === m.name;
          const isPinned = pinned.includes(m.name);
          const featured = m.bestCls || m.bestReg;

          return (
            <div
              key={m.name}
              onClick={() => setSelected(isSelected ? null : m.name)}
              className={`relative rounded-2xl border p-5 cursor-pointer transition-all select-none ${
                isSelected
                  ? "border-[#4d082a] shadow-[0_0_0_3px_rgba(77,8,42,0.12)]"
                  : featured
                  ? "border-[#4d082a]/30 hover:border-[#4d082a]/60"
                  : "border-slate-200 hover:border-slate-300"
              } bg-white`}
            >
              {/* pin button */}
              <button
                onClick={(e) => { e.stopPropagation(); togglePin(m.name); }}
                title={isPinned ? "Unpin" : "Pin to compare"}
                className={`absolute top-3 right-3 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                  isPinned
                    ? "border-[#4d082a] bg-[#4d082a] text-white"
                    : "border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600"
                }`}
              >
                {isPinned ? "pinned" : "pin"}
              </button>

              <div className="pr-12">
                <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">{m.type}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">{m.task}</span>
                  {m.bestCls && (
                    <span className="rounded-full bg-[#4d082a] px-2.5 py-0.5 text-[10px] font-semibold text-white">Best Cls</span>
                  )}
                  {m.bestReg && (
                    <span className="rounded-full bg-[#4d082a] px-2.5 py-0.5 text-[10px] font-semibold text-white">Best Reg</span>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-500 leading-5">{m.arch}</p>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>
                    <p className="text-[10px] text-slate-400">Bal. Acc</p>
                    <p className="font-mono text-sm font-semibold text-slate-800">{m.cls.acc.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">R²</p>
                    <p className={`font-mono text-sm font-semibold ${m.reg.r2 > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                      {m.reg.r2 >= 0 ? "+" : ""}{m.reg.r2.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* compare strip */}
      {pinned.length > 0 && !compareMode && (
        <p className="mt-3 text-xs text-slate-500">
          {pinned[0]} pinned · pin one more model to compare
        </p>
      )}
      {compareMode && (
        <button
          onClick={() => setPinned([])}
          className="mt-3 text-xs font-semibold text-[#4d082a] hover:underline"
        >
          Clear comparison ×
        </button>
      )}

      {/* detail panel */}
      <AnimatePresence>
        {selectedModel && !compareMode && (
          <motion.div
            key={selectedModel.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-slate-900">{selectedModel.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedModel.role}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="shrink-0 rounded-full border border-slate-200 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedModel.pathology && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-600">Failure Mode</p>
                <p className="mt-1 text-xs text-rose-700">{selectedModel.pathology}</p>
              </div>
            )}

            <p className="mt-4 text-sm leading-6 text-slate-600">{selectedModel.insight}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* classification metrics */}
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Classification</p>
                {[
                  { label: "Bal. Acc", value: selectedModel.cls.acc.toFixed(3) },
                  { label: "AUC-ROC", value: selectedModel.cls.auc.toFixed(3) },
                  { label: "Precision", value: selectedModel.cls.prec.toFixed(3) },
                  { label: "Recall", value: selectedModel.cls.recall.toFixed(3) },
                  { label: "F1", value: selectedModel.cls.f1.toFixed(3) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-slate-200 py-1.5 last:border-0">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>

              {/* regression metrics */}
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Regression</p>
                {[
                  { label: "RMSE", value: selectedModel.reg.rmse.toFixed(4) },
                  { label: "MAE", value: selectedModel.reg.mae.toFixed(4) },
                  { label: "R²", value: (selectedModel.reg.r2 >= 0 ? "+" : "") + selectedModel.reg.r2.toFixed(4) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-slate-200 py-1.5 last:border-0">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className={`font-mono text-xs font-semibold ${
                      label === "R²" && selectedModel.reg.r2 > 0 ? "text-emerald-600" : "text-slate-800"
                    }`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* confusion matrix */}
              <MiniCM {...selectedModel.cm} />
            </div>
          </motion.div>
        )}

        {/* comparison panel */}
        {compareMode && modelA && modelB && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900">{modelA.name}</span>
                <span className="text-slate-400 text-sm">vs</span>
                <span className="font-semibold text-slate-900">{modelB.name}</span>
              </div>
              <button onClick={() => setPinned([])} className="text-xs font-semibold text-slate-400 hover:text-slate-700">
                clear ×
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Classification</p>
              <MetricRow label="Bal. Acc" a={modelA.cls.acc} b={modelB.cls.acc} fmt={(v) => v.toFixed(3)} />
              <MetricRow label="AUC-ROC" a={modelA.cls.auc} b={modelB.cls.auc} fmt={(v) => v.toFixed(3)} />
              <MetricRow label="Precision" a={modelA.cls.prec} b={modelB.cls.prec} fmt={(v) => v.toFixed(3)} />
              <MetricRow label="Recall" a={modelA.cls.recall} b={modelB.cls.recall} fmt={(v) => v.toFixed(3)} />
              <MetricRow label="F1" a={modelA.cls.f1} b={modelB.cls.f1} fmt={(v) => v.toFixed(3)} />

              <p className="mb-3 mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Regression</p>
              <MetricRow label="RMSE" a={modelA.reg.rmse} b={modelB.reg.rmse} fmt={(v) => v.toFixed(4)} higherBetter={false} />
              <MetricRow label="MAE" a={modelA.reg.mae} b={modelB.reg.mae} fmt={(v) => v.toFixed(4)} higherBetter={false} />
              <MetricRow label="R²" a={modelA.reg.r2} b={modelB.reg.r2} fmt={(v) => (v >= 0 ? "+" : "") + v.toFixed(4)} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-700">{modelA.name} — confusion matrix</p>
                <MiniCM {...modelA.cm} />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-700">{modelB.name} — confusion matrix</p>
                <MiniCM {...modelB.cm} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
