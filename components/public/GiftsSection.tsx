"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { giftsCopy } from "@/lib/copy";
import { MIN_GIFT_AMOUNT_CENTS } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./GiftsSection.module.css";

export type Gift = {
  id: string;
  title: string;
  description: string | null;
  suggestedAmountCents: number;
  allowCustomAmount: boolean;
  giftType: "suggested" | "free";
};

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseBrlToCents(value: string): number {
  const normalized = value.trim().replace(/[^\d,.-]/g, "");
  const decimal = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : normalized;
  return Math.round(Number(decimal) * 100);
}

type PaymentReturn = "success" | "pending" | "failure" | null;

export default function GiftsSection({ gifts }: { gifts: Gift[] }) {
  const [activeGiftId, setActiveGiftId] = useState<string | null>(null);
  const [showGifts, setShowGifts] = useState(false);
  const [paymentReturn, setPaymentReturn] = useState<PaymentReturn>(null);

  useEffect(() => {
    // intentionally client-only: reads the Mercado Pago return query param
    // once on mount, same pattern as Countdown's initial setTimeLeft()
    const value = new URLSearchParams(window.location.search).get("presente");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value === "sucesso") setPaymentReturn("success");
    if (value === "pendente") setPaymentReturn("pending");
    if (value === "falha") setPaymentReturn("failure");
  }, []);

  return (
    <section id="presentes" className={`section section--tinted ${styles.section}`}>
      <div className="container section--centered">
        {paymentReturn && <PaymentReturnNotice status={paymentReturn} />}
        <Reveal>
          <p className="eyebrow">{giftsCopy.eyebrow}</p>
          <h2>{giftsCopy.title}</h2>
          <p className="prose" style={{ marginTop: "var(--space-4)" }}>
            {giftsCopy.intro}
          </p>
        </Reveal>

        <button
          type="button"
          className={`btn btn--outline ${styles.revealButton}`}
          onClick={() => setShowGifts((open) => !open)}
          aria-expanded={showGifts}
        >
          {showGifts ? giftsCopy.hideLabel : giftsCopy.revealLabel}
        </button>
        <AnimatePresence initial={false}>
          {showGifts && (
            <motion.div
              className={styles.grid}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {gifts.map((gift) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  isActive={activeGiftId === gift.id}
                  onToggle={() =>
                    setActiveGiftId((current) => (current === gift.id ? null : gift.id))
                  }
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PaymentReturnNotice({ status }: { status: Exclude<PaymentReturn, null> }) {
  const content = {
    success: {
      title: "Pagamento enviado",
      body: "Recebemos o retorno do Mercado Pago. A confirmação final será atualizada automaticamente após a validação do pagamento.",
    },
    pending: {
      title: "Pagamento em processamento",
      body: "Seu pagamento está pendente. Assim que o Mercado Pago confirmar, o presente será atualizado automaticamente.",
    },
    failure: {
      title: "Pagamento não concluído",
      body: "Nada foi cobrado por esta tentativa. Você pode escolher o presente novamente quando quiser.",
    },
  }[status];

  return (
    <div className={`${styles.returnNotice} ${styles[`returnNotice_${status}`]}`} role="status">
      <strong>{content.title}</strong>
      <span>{content.body}</span>
    </div>
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
  const isFreeContribution = gift.giftType === "free";
  const [amountOption, setAmountOption] = useState<"suggested" | "custom">(
    isFreeContribution ? "custom" : "suggested"
  );
  const [customAmount, setCustomAmount] = useState("");
  const [giverName, setGiverName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "config_missing">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleContribute() {
    setStatus("loading");
    setErrorMessage(null);

    const amountCents =
      amountOption === "suggested" ? gift.suggestedAmountCents : parseBrlToCents(customAmount);

    if (!amountCents || amountCents < MIN_GIFT_AMOUNT_CENTS) {
      setStatus("error");
      setErrorMessage(`O valor mínimo é ${formatCents(MIN_GIFT_AMOUNT_CENTS)}.`);
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
    <div className={`card ${styles.card} ${isFreeContribution ? styles.freeCard : ""}`}>
      {isFreeContribution && <span className={styles.freeBadge}>Você escolhe o valor</span>}
      <p className={styles.giftTitle}>{gift.title}</p>
      {gift.description && <p className={styles.giftDescription}>{gift.description}</p>}
      <p className={styles.suggestedAmount}>
        {isFreeContribution
          ? `A partir de ${formatCents(MIN_GIFT_AMOUNT_CENTS)}`
          : formatCents(gift.suggestedAmountCents)}
      </p>

      {!isActive ? (
        <button type="button" className="btn btn--outline" onClick={onToggle}>
          {giftsCopy.submitLabel}
        </button>
      ) : (
        <div className={styles.form}>
          <div className={styles.amountOptions}>
            {!isFreeContribution && (
              <label className={styles.amountOption}>
                <input
                  type="radio"
                  name={`amount-${gift.id}`}
                  checked={amountOption === "suggested"}
                  onChange={() => setAmountOption("suggested")}
                />
                {formatCents(gift.suggestedAmountCents)}
              </label>
            )}
            {(isFreeContribution || gift.allowCustomAmount) && (
              <label
                className={`${styles.amountOption} ${isFreeContribution ? styles.freeAmountOption : ""}`}
              >
                {!isFreeContribution && (
                  <input
                    type="radio"
                    name={`amount-${gift.id}`}
                    checked={amountOption === "custom"}
                    onChange={() => setAmountOption("custom")}
                  />
                )}
                <span>{isFreeContribution ? giftsCopy.freeAmountLabel : giftsCopy.customAmountLabel}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="R$ 0,00"
                  aria-label={giftsCopy.freeAmountLabel}
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
