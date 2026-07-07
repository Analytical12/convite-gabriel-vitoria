"use client";

import { useState } from "react";
import { giftsCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import styles from "./GiftsSection.module.css";

export type Gift = {
  id: string;
  title: string;
  description: string | null;
  suggestedAmountCents: number;
  allowCustomAmount: boolean;
};

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function GiftsSection({ gifts }: { gifts: Gift[] }) {
  const [activeGiftId, setActiveGiftId] = useState<string | null>(null);

  return (
    <section id="presentes" className="section section--tinted">
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">{giftsCopy.eyebrow}</p>
          <h2>{giftsCopy.title}</h2>
          <p className="prose" style={{ marginTop: "var(--space-4)" }}>
            {giftsCopy.intro}
          </p>
        </Reveal>

        <div className={styles.grid}>
          {gifts.map((gift, index) => (
            <Reveal key={gift.id} delay={0.04 * (index + 1)}>
              <GiftCard
                gift={gift}
                isActive={activeGiftId === gift.id}
                onToggle={() => setActiveGiftId((current) => (current === gift.id ? null : gift.id))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiftCard({
  gift,
  isActive,
  onToggle,
}: {
  gift: Gift;
  isActive: boolean;
  onToggle: () => void;
}) {
  const [amountOption, setAmountOption] = useState<"suggested" | "custom">("suggested");
  const [customAmount, setCustomAmount] = useState("");
  const [giverName, setGiverName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "config_missing">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleContribute() {
    setStatus("loading");
    setErrorMessage(null);

    const amountCents =
      amountOption === "suggested"
        ? gift.suggestedAmountCents
        : Math.round(Number(customAmount.replace(",", ".")) * 100);

    if (!amountCents || amountCents < 500) {
      setStatus("error");
      setErrorMessage("Informe um valor válido.");
      return;
    }

    try {
      const response = await fetch("/api/gifts/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftId: gift.id, amountCents, giverName, message }),
      });

      if (response.status === 503) {
        setStatus("config_missing");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(giftsCopy.errorGeneric);
        return;
      }

      const data = (await response.json()) as { initPoint: string };
      window.location.assign(data.initPoint);
    } catch {
      setStatus("error");
      setErrorMessage(giftsCopy.errorGeneric);
    }
  }

  return (
    <div className={`card ${styles.card}`}>
      <p className={styles.giftTitle}>{gift.title}</p>
      {gift.description && <p className={styles.giftDescription}>{gift.description}</p>}
      <p className={styles.suggestedAmount}>{formatCents(gift.suggestedAmountCents)}</p>

      {!isActive ? (
        <button type="button" className="btn btn--outline" onClick={onToggle}>
          {giftsCopy.submitLabel}
        </button>
      ) : (
        <div className={styles.form}>
          <div className={styles.amountOptions}>
            <label className={styles.amountOption}>
              <input
                type="radio"
                name={`amount-${gift.id}`}
                checked={amountOption === "suggested"}
                onChange={() => setAmountOption("suggested")}
              />
              {formatCents(gift.suggestedAmountCents)}
            </label>
            {gift.allowCustomAmount && (
              <label className={styles.amountOption}>
                <input
                  type="radio"
                  name={`amount-${gift.id}`}
                  checked={amountOption === "custom"}
                  onChange={() => setAmountOption("custom")}
                />
                {giftsCopy.customAmountLabel}
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="R$"
                  className={styles.customAmountInput}
                  value={customAmount}
                  onFocus={() => setAmountOption("custom")}
                  onChange={(event) => setCustomAmount(event.target.value)}
                />
              </label>
            )}
          </div>

          <div className="field">
            <label htmlFor={`giver-${gift.id}`}>{giftsCopy.giverNameLabel}</label>
            <input
              id={`giver-${gift.id}`}
              type="text"
              value={giverName}
              onChange={(event) => setGiverName(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor={`message-${gift.id}`}>{giftsCopy.messageLabel}</label>
            <textarea
              id={`message-${gift.id}`}
              rows={2}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>

          {status === "config_missing" && <p className="error-text">{giftsCopy.configMissing}</p>}
          {status === "error" && errorMessage && <p className="error-text">{errorMessage}</p>}

          <div className={styles.actions}>
            <button type="button" className="btn btn--outline" onClick={onToggle}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleContribute}
              disabled={status === "loading"}
            >
              {status === "loading" ? giftsCopy.submitLoadingLabel : giftsCopy.submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
