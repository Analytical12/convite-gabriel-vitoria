"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { motionDurations, motionEasing } from "@/lib/design-tokens";
import { heroCopy, verseCopy } from "@/lib/copy";
import styles from "./InvitationEnvelope.module.css";

type Props = {
  revealed: boolean;
  onFlapOpened: () => void;
  onContinue: () => void;
};

export default function InvitationEnvelope({ revealed, onFlapOpened, onContinue }: Props) {
  const [flapOpen, setFlapOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  function handleOpenClick() {
    setFlapOpen(true);
    if (prefersReducedMotion) {
      // skip the fold animation entirely, jump straight to the reveal
      onFlapOpened();
    }
  }

  return (
    <motion.div
      className={styles.overlay}
      exit={{ opacity: 0 }}
      transition={{ duration: motionDurations.slow, ease: motionEasing.standard }}
    >
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="envelope"
            className={styles.scene}
            exit={{ opacity: 0, transition: { duration: motionDurations.fast } }}
          >
            <div className={styles.envelopeWrap}>
              <div className={styles.body}>
                <div className={styles.bodyShade} aria-hidden="true" />
                <motion.div
                  className={styles.flap}
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateX: flapOpen ? -178 : 0 }}
                  transition={{ duration: motionDurations.envelope, ease: motionEasing.standard }}
                  onAnimationComplete={() => {
                    if (flapOpen) onFlapOpened();
                  }}
                />
                <div className={styles.seal}>
                  <Image
                    src="/assets/monogram-gv-seal.webp"
                    alt=""
                    width={38}
                    height={38}
                    className={styles.sealImage}
                    priority
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className={`btn btn--primary ${styles.openButton}`}
                onClick={handleOpenClick}
                disabled={flapOpen}
                aria-label={heroCopy.openAriaLabel}
              >
                {heroCopy.openLabel}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDurations.slow, ease: motionEasing.soft }}
          >
            <Image
              src="/assets/monogram-gv.webp"
              alt=""
              width={46}
              height={46}
              className={styles.cardMonogram}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <p className={styles.cardNames}>{heroCopy.names}</p>
            <p className={styles.cardDate}>{heroCopy.date}</p>
            <p className={styles.cardLocation}>{heroCopy.location}</p>
            <hr className="hairline hairline--center" />
            <p className={styles.cardVerse}>&ldquo;{verseCopy.text}&rdquo;</p>
            <span className={styles.cardVerseRef}>{verseCopy.reference}</span>

            <button type="button" className={styles.continueHint} onClick={onContinue}>
              <span>Continuar</span>
              <span className={styles.chevron} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
