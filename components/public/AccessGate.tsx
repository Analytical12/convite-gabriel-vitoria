"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { accessGateCopy } from "@/lib/copy";
import { WEDDING } from "@/lib/constants";
import { motionDurations, motionEasing } from "@/lib/design-tokens";
import styles from "./AccessGate.module.css";

export default function AccessGate({ initialNotice }: { initialNotice?: string }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(initialNotice ?? null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/access/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          response.status === 404 || response.status === 401
            ? accessGateCopy.errorInvalid
            : accessGateCopy.errorGeneric
        );
        return;
      }

      window.location.assign("/convite");
    } catch {
      setStatus("error");
      setErrorMessage(accessGateCopy.errorGeneric);
    }
  }

  return (
    <main className={`${styles.wrap} paper-texture`}>
      <motion.div
        className={`${styles.panel} paper-surface`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionDurations.slow, ease: motionEasing.standard }}
      >
        <Image
          src="/assets/monogram-gv.webp"
          alt=""
          width={56}
          height={56}
          className={styles.monogram}
          priority
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <p className={styles.eyebrow}>{accessGateCopy.eyebrow}</p>
        <h1 className={styles.title}>{accessGateCopy.title}</h1>
        <p className={styles.intro}>{accessGateCopy.intro}</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="field">
            <label htmlFor="access-code">{accessGateCopy.codeLabel}</label>
            <input
              id="access-code"
              name="code"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder={accessGateCopy.codePlaceholder}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
              aria-invalid={status === "error"}
              aria-describedby={errorMessage ? "access-code-error" : undefined}
            />
          </div>

          {errorMessage && (
            <p id="access-code-error" className="error-text" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="btn btn--primary" disabled={status === "loading" || !code.trim()}>
            {status === "loading" ? accessGateCopy.submitLoadingLabel : accessGateCopy.submitLabel}
          </button>
        </form>

        <p className={styles.help}>
          {accessGateCopy.helpText}{" "}
          <a href={WEDDING.whatsappHref} target="_blank" rel="noreferrer">
            {WEDDING.whatsapp}
          </a>
        </p>
      </motion.div>
    </main>
  );
}
