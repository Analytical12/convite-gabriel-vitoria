"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionDurations, motionEasing } from "@/lib/design-tokens";

export default function Reveal({
  children,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "li";
}) {
  const Component = motion[as];
  const prefersReducedMotion = useReducedMotion();

  return (
    <Component
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: prefersReducedMotion ? 0 : motionDurations.base,
        ease: motionEasing.standard,
        delay: prefersReducedMotion ? 0 : delay,
      }}
    >
      {children}
    </Component>
  );
}
