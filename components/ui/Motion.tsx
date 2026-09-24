"use client";

import { animate, motion, MotionConfig, useMotionValue, useTransform } from "framer-motion";
import { useEffect, type ReactNode } from "react";

/** App-wide motion settings: respects the visitor's "reduce motion" preference. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fades and lifts content in once as it scrolls into view. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A number that glides smoothly to its new value. Pass `format` to display ₹, % etc. */
export function AnimatedNumber({ value, format, className }: { value: number | null; format: (v: number | null) => string; className?: string }) {
  const mv = useMotionValue(value ?? 0);
  const text = useTransform(mv, (v) => format(v));
  useEffect(() => {
    if (value === null || !Number.isFinite(value)) return;
    const controls = animate(mv, value, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, mv]);
  if (value === null || !Number.isFinite(value)) return <span className={className}>{format(null)}</span>;
  return <motion.span className={className}>{text}</motion.span>;
}
