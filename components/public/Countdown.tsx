"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WEDDING } from "@/lib/constants";
import { countdownCopy } from "@/lib/copy";
import styles from "./Countdown.module.css";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const diff = new Date(WEDDING.weddingDateISO).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // intentionally client-only: starts null (matches SSR markup, avoids a
    // hydration mismatch) and fills in the real value once mounted
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isPast = timeLeft && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const units: Array<{ key: keyof TimeLeft; label: string }> = [
    { key: "days", label: countdownCopy.days },
    { key: "hours", label: countdownCopy.hours },
    { key: "minutes", label: countdownCopy.minutes },
    { key: "seconds", label: countdownCopy.seconds },
  ];

  return (
    <div className={styles.wrap} role="timer" aria-live="off">
      {isPast ? (
        <p className={styles.pastLabel}>{countdownCopy.pastLabel}</p>
      ) : (
        <div className={styles.grid}>
          {units.map((unit) => (
            <div key={unit.key} className={styles.unit}>
              <div className={styles.valueWrap}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={timeLeft ? timeLeft[unit.key] : "-"}
                    className={styles.value}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {timeLeft ? String(timeLeft[unit.key]).padStart(2, "0") : "--"}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className={styles.label}>{unit.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
