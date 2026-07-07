export type MessageRow = {
  id: string;
  householdName: string | null;
  authorName: string | null;
  message: string;
  createdAt: string;
};

export default function MessagesTable({ rows }: { rows: MessageRow[] }) {
  return (
    <div className="admin-panel">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Família</th>
            <th>Assinado por</th>
            <th>Mensagem</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.householdName ?? "—"}</td>
              <td>{row.authorName ?? "—"}</td>
              <td>{row.message}</td>
              <td>{new Date(row.createdAt).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
