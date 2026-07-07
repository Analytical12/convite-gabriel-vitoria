"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import styles from "./CloudReveal.module.css";

/**
 * The "tecido/nuvem" layer the brief asks for: a soft, blurred veil that
 * sits over the very top of the in-flow content and drifts away as the
 * guest makes their first scroll, right after the envelope overlay
 * disappears. Built from CSS blur/gradients on purpose — no stock cloud
 * art, keeps it light and avoids the wrong (cartoon-sky) reading of
 * "cloud".
 */
export default function CloudReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <motion.div className={styles.veil} style={{ opacity, y }}>
        <span className={`${styles.blob} ${styles.blobLavender}`} />
        <span className={`${styles.blob} ${styles.blobBlush}`} />
        <span className={`${styles.blob} ${styles.blobChampagne}`} />
      </motion.div>
    </div>
  );
}
