import { RSVP_STATUS_LABELS, WEDDING } from "@/lib/constants";
import InviteLinkActions from "./InviteLinkActions";

export type HouseholdWithGuests = {
  id: string;
  code: string;
  displayName: string;
  group: string | null;
  isActive: boolean;
  rsvpStatus: string | null;
  guests: Array<{ id: string; fullName: string }>;
};

/** Personal link that identifies the family and opens its RSVP form. */
function inviteLink(code: string): string {
  return `https://www.${WEDDING.domain}/c/${code}`;
}

export default function GuestsTable({ households }: { households: HouseholdWithGuests[] }) {
  return (
    <div className="admin-panel">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Família</th>
            <th>Grupo</th>
            <th>Convidados</th>
            <th>Confirmação</th>
            <th>Link pessoal</th>
          </tr>
        </thead>
        <tbody>
          {households.map((household) => (
            <tr key={household.id}>
              <td>{household.displayName}</td>
              <td>{household.group ?? "—"}</td>
              <td>
                {household.guests.map((guest) => (
                  <div key={guest.id}>{guest.fullName}</div>
                ))}
              </td>
              <td>
                {household.rsvpStatus ? (
                  <span
                    className={`admin-badge ${
                      household.rsvpStatus === "declined" ? "admin-badge--declined" : "admin-badge--confirmed"
                    }`}
                  >
                    {RSVP_STATUS_LABELS[household.rsvpStatus] ?? household.rsvpStatus}
                  </span>
                ) : (
                  <span className="admin-badge admin-badge--pending">Pendente</span>
                )}
              </td>
              <td>
                {household.isActive ? (
                  <InviteLinkActions link={inviteLink(household.code)} familyName={household.displayName} />
                ) : (
                  <span className="admin-badge admin-badge--declined">Inativo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
