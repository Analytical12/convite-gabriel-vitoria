"use client";

import { useState } from "react";

/** Copy button + WhatsApp share for a family's personal invitation link. */
export default function InviteLinkActions({ link, familyName }: { link: string; familyName: string }) {
  const [copied, setCopied] = useState(false);

  const whatsappText =
    `Olá! Com muito carinho, este é o convite do casamento de Gabriel & Vitória para ${familyName}. ` +
    `Pelo link você vê todos os detalhes e confirma a presença: ${link}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked (e.g. non-secure context): the link stays selectable on screen
    }
  }

  return (
    <div className="admin-invite-link">
      <code>{link.replace(/^https:\/\//, "")}</code>
      <div className="admin-invite-link__actions">
        <button type="button" className="admin-table-action" onClick={handleCopy}>
          {copied ? "Copiado!" : "Copiar"}
        </button>
        <a
          className="admin-table-action"
          href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
