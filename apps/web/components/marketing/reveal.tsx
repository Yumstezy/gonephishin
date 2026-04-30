"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Subtle fade-up reveal on first scroll into view. Used on every section
 * heading and key block to give the page Apple's "settling into place"
 * feel. Once-only, ~600ms, with a tiny easing.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
