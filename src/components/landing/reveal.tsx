"use client";

import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ y: reducedMotion ? 0 : 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
