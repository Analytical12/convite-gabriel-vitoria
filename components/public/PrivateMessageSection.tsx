"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import styles from "./PrivateMessageSection.module.css";

export default function PrivateMessageSection() {
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, message }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={`section container section--centered paper-texture ${styles.section}`}>
      <Reveal>
        <p className="eyebrow">Recado</p>
        <h2>Deixe um recado</h2>
        <p className="prose" style={{ marginTop: "var(--space-4)" }}>
          Se quiser deixar uma mensagem especial para nós, este espaço é reservado somente para o casal.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className={`${styles.card} paper-surface`}>
          {status === "success" ? (
            <p className={styles.success}>Recado enviado. Obrigado por compartilhar este carinho com a gente.</p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="message-author">Seu nome (opcional)</label>
                <input
                  id="message-author"
                  type="text"
                  value={authorName}
                  onChange={(event) => setAuthorName(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="message-body">Sua mensagem</label>
                <textarea
                  id="message-body"
                  rows={3}
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>
              {status === "error" && (
                <p className="error-text" role="alert">
                  Não foi possível enviar agora. Tente novamente em instantes.
                </p>
              )}
              <button type="submit" className="btn btn--primary" disabled={status === "loading"}>
                {status === "loading" ? "Enviando..." : "Enviar recado"}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
