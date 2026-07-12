"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { rsvpCopy } from "@/lib/copy";
import { AGE_GROUP_LABELS, PUBLIC_EXPERIENCE, RSVP_STATUS_LABELS, WEDDING } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./RSVPForm.module.css";

export type RSVPGuest = {
  id: string;
  fullName: string;
  ageGroup: string;
};

export type ExistingRsvp = {
  status: string;
  dietaryRestrictions: string | null;
  message: string | null;
};

type Props = {
  householdName: string;
  guests: RSVPGuest[];
  existingSubmission: ExistingRsvp | null;
  deadlinePassed: boolean;
};

export default function RSVPForm({ householdName, guests, existingSubmission, deadlinePassed }: Props) {
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(guests.map((guest) => [guest.id, true]))
  );
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const alreadySubmitted = Boolean(existingSubmission) || status === "success";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guests: guests.map((guest) => ({ guestId: guest.id, willAttend: attendance[guest.id] ?? false })),
          dietaryRestrictions: dietary,
          message,
        }),
      });

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(rsvpCopy.errorGeneric);
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(rsvpCopy.errorGeneric);
    }
  }

  return (
    <section id="rsvp" className={`section paper-texture ${styles.section}`}>
      <div className="container section--centered">
      <Reveal>
        <div className={styles.photoHeader}>
          <Image src={PUBLIC_EXPERIENCE.images.rsvp} alt="Fotografia demonstrativa do casal" fill sizes="(max-width: 700px) 88vw, 620px" className={styles.photo} />
        </div>
        <p className="eyebrow">{rsvpCopy.eyebrow}</p>
        <h2>{rsvpCopy.title}</h2>
        <p className="prose" style={{ marginTop: "var(--space-4)" }}>
          {rsvpCopy.intro}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className={`card paper-surface ${styles.panel}`}>
          {alreadySubmitted ? (
            <div className={styles.confirmed}>
              <p className={styles.confirmedTitle}>
                {status === "success" ? rsvpCopy.successTitle : rsvpCopy.alreadySubmittedTitle}
              </p>
              <p className={styles.confirmedBody}>
                {status === "success" ? rsvpCopy.successBody : rsvpCopy.alreadySubmittedBody}
              </p>
              {existingSubmission && (
                <p className={styles.confirmedStatus}>
                  Status: {RSVP_STATUS_LABELS[existingSubmission.status] ?? existingSubmission.status}
                </p>
              )}
            </div>
          ) : deadlinePassed ? (
            <p className={styles.deadlineNote}>{rsvpCopy.deadlinePassedNote}</p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className={styles.householdName}>{householdName}</p>
              <p className={styles.guestListLabel}>{rsvpCopy.guestListLabel}</p>

              <ul className={styles.guestList}>
                {guests.map((guest) => (
                  <li key={guest.id} className={styles.guestItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={attendance[guest.id] ?? false}
                        onChange={(event) =>
                          setAttendance((prev) => ({ ...prev, [guest.id]: event.target.checked }))
                        }
                      />
                      <span>{guest.fullName}</span>
                      <span className={styles.ageGroup}>{AGE_GROUP_LABELS[guest.ageGroup] ?? ""}</span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="field">
                <label htmlFor="rsvp-dietary">{rsvpCopy.dietaryLabel}</label>
                <textarea
                  id="rsvp-dietary"
                  rows={2}
                  placeholder={rsvpCopy.dietaryPlaceholder}
                  value={dietary}
                  onChange={(event) => setDietary(event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="rsvp-message">{rsvpCopy.messageLabel}</label>
                <textarea
                  id="rsvp-message"
                  rows={3}
                  placeholder={rsvpCopy.messagePlaceholder}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>

              {errorMessage && (
                <p className="error-text" role="alert">
                  {errorMessage}
                </p>
              )}

              <button type="submit" className="btn btn--primary" disabled={status === "loading"}>
                {status === "loading" ? rsvpCopy.submitLoadingLabel : rsvpCopy.submitLabel}
              </button>
            </form>
          )}
        </div>
      </Reveal>

      <p className={styles.deadlineFootnote}>
        Prazo de confirmação: {WEDDING.rsvpDeadlineDisplay}
      </p>
      </div>
    </section>
  );
}
