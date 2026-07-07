"use client";

import { useMemo, useState } from "react";
import { AGE_GROUP_LABELS, RSVP_STATUS_LABELS } from "@/lib/constants";
import { deriveRsvpStatus, rsvpStatusValues, type RsvpStatus } from "@/lib/validators/rsvp";
import type { RsvpRow } from "./RSVPTable";

type Props = {
  row: RsvpRow;
  onClose: () => void;
  onSaved: (updated: RsvpRow) => void;
};

export default function RSVPEditModal({ row, onClose, onSaved }: Props) {
  const [attendance, setAttendance] = useState<Record<string, boolean>>(row.attendance);
  const [dietary, setDietary] = useState(row.dietaryRestrictions ?? "");
  const [message, setMessage] = useState(row.message ?? "");
  const [status, setStatus] = useState<RsvpStatus>(() => deriveRsvpStatus(toGuestStatuses(row.attendance)));
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const guestStatuses = useMemo(
    () => row.guests.map((guest) => ({ guestId: guest.id, willAttend: attendance[guest.id] ?? false })),
    [row.guests, attendance]
  );

  const derivedStatus = useMemo(() => deriveRsvpStatus(guestStatuses), [guestStatuses]);
  const statusMismatch = status !== derivedStatus;
  const singleGuest = row.guests.length <= 1;

  function toggleGuest(guestId: string, willAttend: boolean) {
    const next = { ...attendance, [guestId]: willAttend };
    setAttendance(next);
    setStatus(deriveRsvpStatus(row.guests.map((guest) => ({ willAttend: next[guest.id] ?? false }))));
  }

  function applyStatusShortcut(nextStatus: RsvpStatus) {
    setStatus(nextStatus);
    if (nextStatus === "confirmed") {
      setAttendance(Object.fromEntries(row.guests.map((guest) => [guest.id, true])));
    } else if (nextStatus === "declined") {
      setAttendance(Object.fromEntries(row.guests.map((guest) => [guest.id, false])));
    }
    // "partial" is left as-is — the admin adjusts individual checkboxes to
    // create the mixed combination themselves.
  }

  async function handleSave() {
    if (statusMismatch) return;

    setSaveState("saving");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/rsvp/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdId: row.householdId,
          status,
          dietaryRestrictions: dietary,
          message,
          guestStatuses,
        }),
      });

      if (!response.ok) {
        setSaveState("error");
        setErrorMessage(
          response.status === 401
            ? "Sua sessão expirou. Faça login novamente."
            : "Não foi possível salvar agora. Tente novamente."
        );
        return;
      }

      setSaveState("success");
      onSaved({
        ...row,
        status,
        dietaryRestrictions: dietary || null,
        message: message || null,
        editedByAdmin: true,
        attendance,
      });
    } catch {
      setSaveState("error");
      setErrorMessage("Não foi possível salvar agora. Tente novamente.");
    }
  }

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="rsvp-edit-title">
      <div className="admin-modal">
        <div className="admin-modal__header">
          <p id="rsvp-edit-title" className="admin-modal__title">
            Editar RSVP — {row.householdName}
          </p>
          <p className="admin-modal__meta">
            Código {row.householdCode || "—"} · Última atualização{" "}
            {new Date(row.submittedAt).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="admin-field">
          <label htmlFor="rsvp-status">Status geral</label>
          <select
            id="rsvp-status"
            value={status}
            onChange={(event) => applyStatusShortcut(event.target.value as RsvpStatus)}
          >
            {rsvpStatusValues
              .filter((value) => value !== "partial" || !singleGuest)
              .map((value) => (
                <option key={value} value={value}>
                  {RSVP_STATUS_LABELS[value] ?? value}
                </option>
              ))}
          </select>
        </div>

        <ul className="admin-guest-list">
          {row.guests.map((guest) => (
            <li key={guest.id}>
              <label>
                <input
                  type="checkbox"
                  checked={attendance[guest.id] ?? false}
                  onChange={(event) => toggleGuest(guest.id, event.target.checked)}
                />
                <span>{guest.fullName}</span>
                <span className="admin-guest-age">{AGE_GROUP_LABELS[guest.ageGroup] ?? guest.ageGroup}</span>
              </label>
            </li>
          ))}
        </ul>

        {statusMismatch && (
          <p className="admin-error-text">
            O status &quot;{RSVP_STATUS_LABELS[status] ?? status}&quot; não corresponde às presenças marcadas.
            Esperado: &quot;{RSVP_STATUS_LABELS[derivedStatus] ?? derivedStatus}&quot;.
          </p>
        )}

        <div className="admin-field">
          <label htmlFor="rsvp-dietary">Restrição alimentar</label>
          <textarea
            id="rsvp-dietary"
            rows={2}
            value={dietary}
            onChange={(event) => setDietary(event.target.value)}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="rsvp-message">Mensagem</label>
          <textarea
            id="rsvp-message"
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>

        {saveState === "error" && errorMessage && <p className="admin-error-text">{errorMessage}</p>}
        {saveState === "success" && <p className="admin-success-text">Alteração salva.</p>}

        <div className="admin-modal__footer">
          <button type="button" className="admin-table-action" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="admin-table-action"
            onClick={handleSave}
            disabled={saveState === "saving" || statusMismatch}
          >
            {saveState === "saving" ? "Salvando..." : "Salvar alteração"}
          </button>
        </div>
      </div>
    </div>
  );
}

function toGuestStatuses(attendance: Record<string, boolean>) {
  return Object.values(attendance).map((willAttend) => ({ willAttend }));
}
