"use client";

import { motion } from "motion/react";
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
  return (
    <Component
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: motionDurations.base, ease: motionEasing.standard, delay }}
    >
      {children}
    </Component>
  );
}
