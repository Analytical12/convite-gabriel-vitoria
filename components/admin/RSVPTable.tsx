"use client";

import { useState } from "react";
import { RSVP_STATUS_LABELS } from "@/lib/constants";
import RSVPEditModal from "./RSVPEditModal";

export type RsvpGuestOption = {
  id: string;
  fullName: string;
  ageGroup: string;
};

export type RsvpRow = {
  id: string;
  householdId: string;
  householdCode: string;
  householdName: string;
  status: string;
  dietaryRestrictions: string | null;
  message: string | null;
  submittedAt: string;
  editedByAdmin: boolean;
  guests: RsvpGuestOption[];
  attendance: Record<string, boolean>;
};

const STATUS_BADGE: Record<string, string> = {
  confirmed: "admin-badge--confirmed",
  declined: "admin-badge--declined",
  partial: "admin-badge--pending",
};

export default function RSVPTable({ rows: initialRows }: { rows: RsvpRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const editingRow = rows.find((row) => row.id === editingRowId) ?? null;

  return (
    <div className="admin-panel">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Família</th>
            <th>Status</th>
            <th>Convidados</th>
            <th>Restrição alimentar</th>
            <th>Mensagem</th>
            <th>Enviado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.householdName}</td>
              <td>
                <span className={`admin-badge ${STATUS_BADGE[row.status] ?? ""}`}>
                  {RSVP_STATUS_LABELS[row.status] ?? row.status}
                </span>
                {row.editedByAdmin && (
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-ink-faint)", marginTop: 4 }}>
                    editado pelo admin
                  </div>
                )}
              </td>
              <td>
                {row.guests.map((guest) => (
                  <div key={guest.id}>
                    {guest.fullName} — {row.attendance[guest.id] ? "vai" : "não vai"}
                  </div>
                ))}
              </td>
              <td>{row.dietaryRestrictions || "—"}</td>
              <td>{row.message || "—"}</td>
              <td>{new Date(row.submittedAt).toLocaleDateString("pt-BR")}</td>
              <td>
                <button
                  type="button"
                  className="admin-table-action"
                  onClick={() => setEditingRowId(row.id)}
                >
                  Editar RSVP
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRow && (
        <RSVPEditModal
          row={editingRow}
          onClose={() => setEditingRowId(null)}
          onSaved={(updated) => {
            setRows((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
            setEditingRowId(null);
          }}
        />
      )}
    </div>
  );
}
