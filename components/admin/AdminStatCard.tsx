export default function AdminStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-card__label">{label}</p>
      <p className="admin-stat-card__value">{value}</p>
    </div>
  );
}
