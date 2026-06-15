"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CounterStat from "./components/CounterStat";
import FigureGallery from "./components/FigureGallery";
import R2Chart from "./components/R2Chart";
import ModelExplorer from "./components/ModelExplorer";
import EMHSpectrum from "./components/EMHSpectrum";
import SeedDotPlot from "./components/SeedDotPlot";

/* ── data ──────────────────────────────────────────────────────────────── */

type ClsRow = { name: string; acc: string; auc: string; prec: string; recall: string; f1: string; best?: boolean; baseline?: boolean };
type RegRow = { name: string; rmse: string; mae: string; r2: string; best?: boolean; baseline?: boolean };

const CLASSIFICATION: ClsRow[] = [
  { name: "XGBoost", acc: "0.536", auc: "0.545", prec: "0.616", recall: "0.518", f1: "0.563", best: true },
  { name: "Transformer", acc: "0.516", auc: "0.526", prec: "0.588", recall: "0.985", f1: "0.737" },
  { name: "MLP", acc: "0.509", auc: "0.504", prec: "0.594", recall: "0.735", f1: "0.657" },
  { name: "Logistic Regression", acc: "0.497", auc: "0.498", prec: "0.571", recall: "0.183", f1: "0.277" },
  { name: "LSTM", acc: "0.484", auc: "0.507", prec: "0.565", recall: "0.488", f1: "0.524" },
  { name: "Majority Baseline", acc: "0.500", auc: "—", prec: "0.581", recall: "1.000", f1: "0.735", baseline: true },
  { name: "Persistence Baseline", acc: "0.469", auc: "—", prec: "0.555", recall: "0.555", f1: "0.555", baseline: true },
];

const REGRESSION: RegRow[] = [
  { name: "MLP", rmse: "0.0153", mae: "0.0092", r2: "+0.0098", best: true },
  { name: "LSTM", rmse: "0.0153", mae: "0.0092", r2: "+0.0073" },
  { name: "Historical Mean", rmse: "0.0154", mae: "0.0093", r2: "−0.0021", baseline: true },
  { name: "Transformer", rmse: "0.0155", mae: "0.0092", r2: "−0.0119" },
  { name: "XGBoost", rmse: "0.0159", mae: "0.0094", r2: "−0.0625" },
  { name: "Ridge Regression", rmse: "0.0159", mae: "0.0096", r2: "−0.0667" },
  { name: "Persistence Baseline", rmse: "0.0246", mae: "0.0143", r2: "−1.5611", baseline: true },
];

const FEATURES = [
  { cat: "Returns & Momentum", count: 7, examples: "1d/log returns, lagged Δ (t−1 to t−10)" },
  { cat: "Lagged Prices", count: 5, examples: "Close[t−1] through Close[t−5]" },
  { cat: "Trend / SMA", count: 8, examples: "SMA 5/10/20/50d · price-to-MA ratios" },
  { cat: "Volatility", count: 3, examples: "Rolling return σ over 5, 10, 20 days" },
  { cat: "Volume", count: 6, examples: "Volume Δ, rolling means, vol/MA ratios" },
  { cat: "Technical Indicators", count: 8, examples: "RSI-14 · MACD + signal · Bollinger Bands" },
  { cat: "Intraday Spreads", count: 4, examples: "H−L range · O−C · H−close · L−close" },
];

/* ── shared animation props ─────────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

/* ── component ──────────────────────────────────────────────────────────── */

export default function DissertationContent() {
  const [tab, setTab] = useState<"cls" | "reg">("cls");

  return (
    <main id="main-content">

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 pb-20 pt-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#4d082a]/25 blur-[120px]" />
          <div className="absolute right-0 top-8 h-72 w-72 rounded-full bg-[#4d082a]/10 blur-[90px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              ECM3175 &middot; University of Exeter &middot; 2025&ndash;26
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-5xl">
              Stock Market Direction Prediction
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Benchmarking LSTM, Transformer, XGBoost, MLP, and Logistic Regression on 23 years of daily equity data &mdash; can feature-engineered machine learning beat chance on the S&amp;P&nbsp;500?
            </p>
          </motion.div>

          {/* animated stat chips */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              { from: 0, to: 23, suffix: "", label: "Years of Data", decimals: 0 },
              { from: 0, to: 70, suffix: "k+", label: "Daily Observations", decimals: 0 },
              { from: 0, to: 54, suffix: "", label: "Engineered Features", decimals: 0 },
              { from: 0, to: 5, suffix: "", label: "ML Architectures", decimals: 0 },
            ].map(({ from, to, suffix, label, decimals }, i) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-[#c2526e]">
                  <CounterStat from={from} to={to} decimals={decimals} suffix={suffix} duration={1.1 + i * 0.1} />
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* credential strip */}
          <motion.div
            className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-5 backdrop-blur-sm sm:flex-row sm:gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image src="/UoELogo.png" alt="University of Exeter" width={200} height={72} className="h-auto w-28 shrink-0 object-contain opacity-80 sm:w-44" />
            <div className="h-px w-full bg-slate-800 sm:h-10 sm:w-px" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Programme</p>
              <p className="mt-1 text-base font-semibold text-white">Electrical and Electronic Engineering BEng (Hons)</p>
            </div>
            <div className="h-px w-full bg-slate-800 sm:h-10 sm:w-px" />
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Module</p>
              <p className="mt-1 text-base font-semibold text-white">ECM3175 &mdash; Dissertation</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. RESEARCH QUESTION ──────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">

            <motion.div {...fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Research Question</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Can standard ML models beat chance on daily price direction?
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Daily equity markets are famously noisy. This dissertation asks whether supervised learning pipelines trained on price-derived features alone can extract a statistically significant directional signal from S&amp;P 500 (SPY) next-day returns.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                The study uses a{" "}
                <span className="font-semibold text-slate-900">dual-task design</span> &mdash; identical features and splits feed both a binary direction classifier and a continuous return regressor, enabling direct comparison of the two paradigms on the same data.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Fat-tail analysis confirms the data is non-Gaussian: extreme returns are{" "}
                <span className="font-semibold text-slate-900">6&times; to 5,000&times;</span> more frequent than a Gaussian model predicts, motivating loss functions and model choices that are robust to heavy tails.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col gap-5 lg:mt-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* animated top-line callout */}
              <div className="rounded-2xl border border-[#4d082a]/30 bg-white p-6 shadow-[0_20px_40px_-30px_rgba(77,8,42,0.25)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4d082a]">Top-line Result</p>
                <p className="mt-3 text-5xl font-bold text-slate-900">
                  <CounterStat from={50.0} to={53.6} decimals={1} suffix="%" duration={1.5} />
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Balanced accuracy &middot; XGBoost classifier</p>

                {/* vs-chance bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>50.0% chance</span>
                    <span>53.6% XGBoost</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1/2 rounded-l-full bg-slate-300" />
                    <motion.div
                      className="absolute top-0 h-full rounded-r-full bg-[#4d082a]"
                      style={{ left: "50%" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: "7.2%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">+3.6 pp above chance &middot; McNemar &chi;&sup2; = 4.83, p &lt; 0.05</p>
                </div>
              </div>

              {/* data split */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Chronological Data Split</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Train", range: "2010 – 2016", rows: "1,760 rows", pct: "58%", dot: "bg-slate-600" },
                    { label: "Validation", range: "2017 – 2018", rows: "502 rows", pct: "17%", dot: "bg-[#c2526e]" },
                    { label: "Test", range: "2019 – 2021", rows: "565 rows", pct: "19%", dot: "bg-[#4d082a]" },
                  ].map(({ label, range, rows, pct, dot }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                      <span className="w-20 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">{label}</span>
                      <span className="flex-1 text-sm text-slate-600">{range}</span>
                      <span className="text-xs text-slate-400">{rows}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${label === "Test" ? "bg-[#4d082a] text-white" : "bg-slate-100 text-slate-500"}`}>{pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURE ENGINEERING ───────────────────────────────── */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Feature Engineering</p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">54 features, zero look-ahead bias.</h2>
              <p className="mt-2 text-sm text-slate-500 sm:mt-0 sm:text-right">Computed for 16 equity symbols</p>
            </div>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              All features are constructed with strict chronological ordering across seven categories spanning price, momentum, volatility, and volume. Cross-asset context features from QQQ, IWM, EEM, and USO augment the core SPY signal.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {FEATURES.map(({ cat, count, examples }) => (
              <div key={cat} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{cat}</p>
                  <span className="shrink-0 rounded-full bg-[#4d082a]/30 px-2.5 py-0.5 text-xs font-bold text-[#c2526e]">{count}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{examples}</p>
              </div>
            ))}
          </motion.div>

          {/* fat tail callout */}
          <motion.div
            className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Data Characteristic</p>
            <p className="mt-3 text-lg font-semibold text-white">Heavy-tailed return distribution</p>
            <p className="mt-2 text-base leading-7 text-slate-400">
              SPY daily returns are emphatically non-Gaussian. Empirical tail probabilities far exceed Gaussian predictions &mdash; a key motivation for choosing robust model architectures and evaluation metrics.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              {[
                { threshold: "|r| > 2σ", factor: "2.3×" },
                { threshold: "|r| > 3σ", factor: "6.0×" },
                { threshold: "|r| > 4σ", factor: "48×" },
                { threshold: "|r| > 5σ", factor: "5,368×" },
              ].map(({ threshold, factor }) => (
                <div key={threshold} className="rounded-xl border border-slate-800 bg-slate-950/60 px-5 py-3 text-center">
                  <p className="text-xs text-slate-500">{threshold}</p>
                  <p className="mt-1 text-xl font-bold text-[#c2526e]">{factor}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">vs. Gaussian</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. MODEL EXPLORER ─────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Methodology</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Five architectures, one benchmark.</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              All deep learning models share the same training infrastructure: Adam optimiser with ReduceLROnPlateau decay, early stopping at patience&nbsp;15, and gradient clipping at max&nbsp;norm&nbsp;1.0.
            </p>
          </motion.div>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ModelExplorer />
          </motion.div>
        </div>
      </section>

      {/* ── 5. RESULTS ────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Empirical Results</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Test-set performance.</h2>
            <p className="mt-3 max-w-xl text-lg leading-8 text-slate-600">
              Evaluated on held-out data from 2019&ndash;01&ndash;01 to 2021&ndash;12&ndash;31 (565 trading days), unseen during training or hyperparameter selection.
            </p>
          </motion.div>

          {/* tab switcher */}
          <div className="mt-8 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setTab("cls")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "cls" ? "bg-[#4d082a] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Classification
            </button>
            <button
              onClick={() => setTab("reg")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "reg" ? "bg-[#4d082a] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Regression
            </button>
          </div>

          {/* classification table */}
          {tab === "cls" && (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Model</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Bal. Acc &uarr;</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">AUC-ROC &uarr;</th>
                    <th className="hidden px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:table-cell">Precision</th>
                    <th className="hidden px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:table-cell">Recall</th>
                    <th className="hidden px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:table-cell">F1</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASSIFICATION.map(({ name, acc, auc, prec, recall, f1, best, baseline }) => (
                    <tr key={name} className={`border-b border-slate-100 last:border-0 ${best ? "bg-[#4d082a]/[0.035]" : baseline ? "bg-slate-50/60" : ""}`}>
                      <td className={`px-6 py-4 font-medium ${best ? "text-[#4d082a]" : baseline ? "text-slate-400" : "text-slate-900"}`}>
                        <span className="flex items-center gap-2">
                          {best && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d082a]" />}
                          {name}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-right font-mono ${best ? "font-bold text-[#4d082a]" : baseline ? "text-slate-400" : "text-slate-700"}`}>{acc}</td>
                      <td className={`px-4 py-4 text-right font-mono ${baseline ? "text-slate-400" : "text-slate-600"}`}>{auc}</td>
                      <td className={`hidden px-4 py-4 text-right font-mono sm:table-cell ${baseline ? "text-slate-400" : "text-slate-600"}`}>{prec}</td>
                      <td className={`hidden px-4 py-4 text-right font-mono sm:table-cell ${baseline ? "text-slate-400" : "text-slate-600"}`}>{recall}</td>
                      <td className={`hidden px-4 py-4 text-right font-mono md:table-cell ${baseline ? "text-slate-400" : "text-slate-600"}`}>{f1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-slate-100 px-6 py-3">
                <p className="text-xs text-slate-400">
                  Test split: 2019&ndash;01&ndash;01 to 2021&ndash;12&ndash;31 &middot; 565 observations &middot; greyed rows = baselines
                </p>
              </div>
            </div>
          )}

          {/* regression table + R² chart */}
          {tab === "reg" && (
            <div className="mt-6 space-y-6">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Model</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">RMSE &darr;</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">MAE &darr;</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">R&sup2; &uarr;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REGRESSION.map(({ name, rmse, mae, r2, best, baseline }) => (
                      <tr key={name} className={`border-b border-slate-100 last:border-0 ${best ? "bg-[#4d082a]/[0.035]" : baseline ? "bg-slate-50/60" : ""}`}>
                        <td className={`px-6 py-4 font-medium ${best ? "text-[#4d082a]" : baseline ? "text-slate-400" : "text-slate-900"}`}>
                          <span className="flex items-center gap-2">
                            {best && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d082a]" />}
                            {name}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-right font-mono ${best ? "font-bold text-[#4d082a]" : baseline ? "text-slate-400" : "text-slate-700"}`}>{rmse}</td>
                        <td className={`px-4 py-4 text-right font-mono ${baseline ? "text-slate-400" : "text-slate-600"}`}>{mae}</td>
                        <td className={`px-4 py-4 text-right font-mono font-semibold ${r2.startsWith("+") ? "text-emerald-600" : baseline ? "text-slate-400" : "text-slate-600"}`}>{r2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-slate-100 px-6 py-3">
                  <p className="text-xs text-slate-400">
                    Predicting continuous next-day SPY return &middot; positive R&sup2; highlighted in green &middot; greyed rows = baselines
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">R&sup2; at a glance</p>
                <p className="mt-1 text-xs text-slate-500">All models cluster within &plusmn;0.01 of zero &mdash; predicting the magnitude of next-day returns is essentially intractable.</p>
                <R2Chart />
              </div>
            </div>
          )}

          {/* figure gallery */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Proof of Work</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Outputs from the dissertation.</h3>
            <p className="mt-2 text-base text-slate-600">
              All figures generated with matplotlib and seaborn during model training and evaluation &mdash; click any to expand.
            </p>
            <FigureGallery />
          </motion.div>
        </div>
      </section>

      {/* ── 6. EMH SPECTRUM ───────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Academic Contribution</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Where do these results sit on the Efficient Market Hypothesis?
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              The semi-strong form of EMH holds that only truly non-public information can generate alpha. Our results suggest the reality lies just past that boundary &mdash; directional signal is detectable, but the magnitude of future moves is not.
            </p>
            <EMHSpectrum />
          </motion.div>
        </div>
      </section>

      {/* ── 7. KEY FINDINGS ───────────────────────────────────────── */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Conclusions</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Six key findings.</h2>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              { n: "01", title: "Modest but measurable edge", body: "XGBoost achieves 53.6% balanced accuracy — a statistically significant 3.6 pp above random chance, consistent across seeds and confirmed by McNemar’s test." },
              { n: "02", title: "Magnitude is essentially unpredictable", body: "All regression models converge near R² ≈ 0, barely clearing the historical-mean baseline. The absolute size of next-day moves is dominated by noise." },
              { n: "03", title: "Direction beats magnitude", body: "Classifiers outperform their regression counterparts on identical data — binary directional structure is detectable even when continuous magnitude is not." },
              { n: "04", title: "No decisive deep-learning advantage", body: "LSTM and Transformer match but do not consistently beat XGBoost in classification. In regression, MLP edges out by a slim R² margin of 0.0025." },
              { n: "05", title: "Transformer over-predicts ‘up’", body: "Recall of 98.5% signals class-imbalance overfitting — the model learns to predict ‘up’ unconditionally rather than discovering genuine directional signal." },
              { n: "06", title: "Semi-strong EMH broadly supported", body: "Directional edges are real but thin. Bollinger Band positions and moving-average ratios dominate feature importance, consistent with mean-reversion microstructure." },
            ].map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
                <p className="text-xl font-bold tracking-widest text-[#4d082a]/70">{n}</p>
                <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-400">{body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 8. REPRODUCIBILITY + SEED DOT PLOT ────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Reproducibility</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Stable across random seeds.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              All deep learning models were evaluated across five random seeds (42, 123, 7, 2024, 99). Balanced accuracy remains tight, confirming results are not driven by lucky weight initialisations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SeedDotPlot />
          </motion.div>

          <motion.div
            className="mt-10 rounded-xl border border-slate-200 bg-white px-5 py-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Statistical Significance &middot; McNemar&apos;s Test (&alpha; = 0.05)
            </p>
            <ul className="mt-3 space-y-1.5 text-xs leading-5 text-slate-600">
              <li><span className="font-semibold text-slate-800">Logistic Reg. vs Majority</span> &mdash; significant (&chi;&sup2; = 12.23, p = 0.0005)</li>
              <li><span className="font-semibold text-slate-800">LSTM vs Majority</span> &mdash; significant (&chi;&sup2; = 9.96, p = 0.0016)</li>
              <li><span className="font-semibold text-slate-800">LSTM vs XGBoost</span> &mdash; significant (&chi;&sup2; = 4.0, p = 0.046)</li>
              <li className="text-slate-400">MLP vs Majority &mdash; not significant (p = 0.267)</li>
              <li className="text-slate-400">Transformer vs Majority &mdash; not significant (p = 0.211)</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── 9. TECH STACK + FEATURE IMPORTANCE ────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Technical Stack</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Built with.</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {["Python 3", "PyTorch 2.1", "XGBoost 3.2", "scikit-learn", "pandas", "NumPy", "SciPy", "statsmodels", "seaborn", "matplotlib", "CUDA", "Jupyter"].map((tech) => (
                  <span key={tech} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Top Predictive Features &middot; XGBoost Gain
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {[
                    { name: "MA 5-day average", gain: "0.0194", pct: 100 },
                    { name: "10-day return sum", gain: "0.0183", pct: 94 },
                    { name: "Bollinger Band mid-20", gain: "0.0180", pct: 93 },
                    { name: "Bollinger Band lower", gain: "0.0176", pct: 91 },
                    { name: "MA 20-day average", gain: "0.0172", pct: 89 },
                  ].map(({ name, gain, pct }, i) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 text-xs text-slate-700">{name}</span>
                      <div className="flex-1 rounded-full bg-slate-200 h-1.5 overflow-hidden">
                        <motion.div
                          className="h-1.5 rounded-full bg-[#4d082a]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right font-mono text-xs text-slate-400">{gain}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-slate-400">
                  Mean-reversion signals (Bollinger Bands, MA ratios) dominate &mdash; consistent with known equity microstructure.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 10. REFLECTION + CTA ──────────────────────────────────── */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="grid gap-12 lg:grid-cols-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            {/* reflection */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Reflection</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">What I&apos;d do differently.</h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-slate-400">
                <p>
                  <span className="font-semibold text-white">What worked:</span>{" "}
                  XGBoost&apos;s robustness on tabular data confirmed the literature &mdash; gradient boosted trees genuinely suit engineered financial features better than recurrent or attention architectures in the low-data regime.
                </p>
                <p>
                  <span className="font-semibold text-white">What I&apos;d fix:</span>{" "}
                  The Transformer&apos;s recall collapse was avoidable. Weighted cross-entropy or focal loss tuned during validation would likely have corrected this; I identified it post-hoc. Next time: monitor per-class metrics during training, not just aggregate loss.
                </p>
                <p>
                  <span className="font-semibold text-white">What&apos;s next:</span>{" "}
                  Alternative data (sentiment, options flow, macro regime indicators), longer historical windows, and live backtesting through the LEAN engine to measure real-world slippage against the theoretical edge.
                </p>
              </div>
            </div>

            {/* CTA cards */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Source Code</p>
                <div className="mt-4 rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm text-slate-300 overflow-x-auto">
                  <span className="text-[#c2526e]">$</span>{" "}
                  <span className="text-slate-400">git clone </span>
                  <span className="text-white">https://github.com/ClaraIForwood/MyDiss</span>
                </div>
                <a
                  href="https://github.com/ClaraIForwood/MyDiss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.23 3.438 9.67 8.205 11.23.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56C20.565 21.956 24 17.51 24 12.29 24 5.78 18.627.5 12 .5z" />
                  </svg>
                  View on GitHub
                </a>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Get in touch</p>
                <p className="mt-3 text-sm text-slate-400 leading-6">
                  Interested in the methodology, results, or potential applications? I&apos;m open to conversations about ML in finance, quantitative research, and software engineering roles.
                </p>
                <a
                  href="/#contact"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4d082a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3a061f] transition-colors"
                >
                  Contact me
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
