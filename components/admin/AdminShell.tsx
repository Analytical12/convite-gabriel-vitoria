"use client";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/convidados", label: "Convidados" },
  { href: "/admin/rsvp", label: "RSVP" },
  { href: "/admin/presentes", label: "Presentes" },
  { href: "/admin/recados", label: "Recados" },
  { href: "/admin/exportar", label: "Exportar" },
];

export default function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-nav">
          <p className="admin-nav__brand">Gabriel &amp; Vitória</p>
          <nav aria-label="Navegação administrativa">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="admin-nav__link"
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <p style={{ marginTop: "var(--space-8)", fontSize: "var(--fs-xs)", color: "var(--color-ink-faint)" }}>
            {userEmail}
          </p>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="admin-nav__link"
              style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer" }}
            >
              Sair
            </button>
          </form>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
