import { PAYMENT_STATUS_LABELS } from "@/lib/constants";

export type GiftContributionRow = {
  id: string;
  giftTitle: string;
  householdName: string | null;
  giverName: string | null;
  amountCents: number;
  paymentStatus: string;
  providerStatus: string | null;
  paymentMethod: string | null;
  createdAt: string;
};

const STATUS_BADGE: Record<string, string> = {
  approved: "admin-badge--approved",
  pending: "admin-badge--pending",
  manual_review: "admin-badge--pending",
  rejected: "admin-badge--declined",
  cancelled: "admin-badge--declined",
  refunded: "admin-badge--declined",
};

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function GiftsTable({ rows }: { rows: GiftContributionRow[] }) {
  const total = rows
    .filter((row) => row.paymentStatus === "approved")
    .reduce((sum, row) => sum + row.amountCents, 0);

  return (
    <div className="admin-panel">
      <p style={{ marginBottom: "var(--space-4)", color: "var(--color-ink-soft)" }}>
        Total aprovado: <strong>{formatCents(total)}</strong>
      </p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Presente</th>
            <th>Família</th>
            <th>De</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Meio</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.giftTitle}</td>
              <td>{row.householdName ?? "—"}</td>
              <td>{row.giverName ?? "—"}</td>
              <td>{formatCents(row.amountCents)}</td>
              <td>
                <span className={`admin-badge ${STATUS_BADGE[row.paymentStatus] ?? ""}`}>
                  {PAYMENT_STATUS_LABELS[row.paymentStatus] ?? row.paymentStatus}
                </span>
                {row.providerStatus && row.providerStatus !== row.paymentStatus && (
                  <small style={{ display: "block", marginTop: ".25rem", color: "var(--color-ink-faint)" }}>
                    Mercado Pago: {row.providerStatus}
                  </small>
                )}
              </td>
              <td>{row.paymentMethod ?? "—"}</td>
              <td>{new Date(row.createdAt).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
