"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface CounterStatProps {
  from: number;
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function CounterStat({
  from,
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.4,
  className = "",
}: CounterStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || hasAnimated.current || !ref.current) return;
    hasAnimated.current = true;
    const el = ref.current;

    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        el.textContent = prefix + v.toFixed(decimals) + suffix;
      },
    });

    return () => controls.stop();
  }, [inView, from, to, decimals, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </span>
  );
}
