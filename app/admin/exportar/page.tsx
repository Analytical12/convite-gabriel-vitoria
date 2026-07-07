export default function AdminExportPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", marginBottom: "var(--space-6)" }}>
        Exportar
      </h1>
      <div className="admin-panel">
        <p style={{ color: "var(--color-ink-soft)", marginBottom: "var(--space-5)" }}>
          Gera uma planilha .xlsx com 7 abas: Familias, Convidados, RSVP, Restricoes, Presentes, Pagamentos e
          Recados.
        </p>
        <a href="/api/admin/export" className="btn btn--primary">
          Baixar planilha (.xlsx)
        </a>
      </div>
    </div>
  );
}
