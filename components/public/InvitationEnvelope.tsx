"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { motionDurations, motionEasing } from "@/lib/design-tokens";
import { heroCopy } from "@/lib/copy";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import styles from "./InvitationEnvelope.module.css";
import artworkStyles from "./InvitationArtwork.module.css";

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
      style={{ backgroundImage: `linear-gradient(180deg, rgba(38,35,34,.34), rgba(38,35,34,.62)), url(${PUBLIC_EXPERIENCE.images.hero})` }}
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
            <div className={styles.introCopy}>
              <p>{heroCopy.eyebrow}</p>
              <h1>{heroCopy.names}</h1>
            </div>
            <div className={styles.envelopeWrap}>
              <button
                type="button"
                className={`${styles.body} ${flapOpen ? styles.bodyOpening : ""} paper-surface`}
                onClick={handleOpenClick}
                disabled={flapOpen}
                aria-label={heroCopy.openAriaLabel}
              >
                <span className={styles.bodyShade} aria-hidden="true" />
                <motion.span
                  className={styles.flap}
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateX: flapOpen ? -178 : 0 }}
                  transition={{ duration: motionDurations.envelope, ease: motionEasing.standard }}
                  onAnimationComplete={() => {
                    if (flapOpen) onFlapOpened();
                  }}
                />
                <span className={styles.seal}>
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
                </span>
                <span className={styles.touchHint} aria-hidden="true">
                  <span className={styles.touchIcon} />
                  <span>{heroCopy.openLabel}</span>
                </span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className={`${styles.card} ${artworkStyles.card}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDurations.slow, ease: motionEasing.soft }}
          >
            <Image
              src={PUBLIC_EXPERIENCE.images.invitationCard}
              alt="Convite de casamento de Gabriel e Vitória, em 06 de dezembro de 2026, na Bonjour Pâtisserie"
              width={2015}
              height={2841}
              className={artworkStyles.image}
              priority
            />
            <button
              type="button"
              className={`${styles.continueHint} ${artworkStyles.continueHint}`}
              onClick={onContinue}
            >
              <span>Continuar</span>
              <span className={styles.chevron} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
