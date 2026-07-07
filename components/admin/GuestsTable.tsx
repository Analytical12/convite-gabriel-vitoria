import { AGE_GROUP_LABELS } from "@/lib/constants";

export type HouseholdWithGuests = {
  id: string;
  code: string;
  displayName: string;
  type: string;
  maxInvited: number;
  isActive: boolean;
  guests: Array<{ id: string; fullName: string; ageGroup: string }>;
};

export default function GuestsTable({ households }: { households: HouseholdWithGuests[] }) {
  return (
    <div className="admin-panel">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Família / Convidado</th>
            <th>Tipo</th>
            <th>Convidados</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {households.map((household) => (
            <tr key={household.id}>
              <td>{household.code}</td>
              <td>{household.displayName}</td>
              <td>{household.type === "family" ? "Família" : "Individual"}</td>
              <td>
                {household.guests.map((guest) => (
                  <div key={guest.id}>
                    {guest.fullName}{" "}
                    <span style={{ color: "var(--color-ink-faint)", fontSize: "var(--fs-xs)" }}>
                      ({AGE_GROUP_LABELS[guest.ageGroup] ?? guest.ageGroup})
                    </span>
                  </div>
                ))}
              </td>
              <td>
                <span
                  className={`admin-badge ${household.isActive ? "admin-badge--confirmed" : "admin-badge--declined"}`}
                >
                  {household.isActive ? "Ativo" : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
