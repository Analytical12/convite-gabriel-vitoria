"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { headerCopy, heroCopy } from "@/lib/copy";
import { motionDurations, motionEasing } from "@/lib/design-tokens";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import MonogramImage from "./MonogramImage";
import styles from "./Header.module.css";

const links = headerCopy.links.filter(
  (link) => PUBLIC_EXPERIENCE.showRsvp || link.href !== "#rsvp"
);
const cta = PUBLIC_EXPERIENCE.showRsvp
  ? { href: "#rsvp", label: headerCopy.cta }
  : { href: "#recado", label: headerCopy.messageCta };

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionDurations.base, ease: motionEasing.standard }}
      >
        <a href="#topo" className={styles.brand} aria-label="Voltar ao início">
          <MonogramImage
            src="/assets/monogram-vg.webp"
            alt=""
            width={40}
            height={36}
            className={styles.brandMark}
          />
          <span>{heroCopy.names}</span>
        </a>

        <nav aria-label="Navegação principal" className={styles.nav}>
          <ul className={styles.nav}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={cta.href} className={`btn btn--outline ${styles.cta}`}>
          {cta.label}
        </a>

        <button
          type="button"
          className={styles.menuButton}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          aria-hidden={menuOpen}
          tabIndex={menuOpen ? -1 : 0}
          onClick={() => setMenuOpen(true)}
          style={menuOpen ? { visibility: "hidden" } : undefined}
        >
          <span className={styles.menuIcon}>
            <span />
            <span />
          </span>
        </button>
      </motion.header>

      {/* Portaled to <body> — a position:fixed panel nested inside the sticky
          header gets contained by the header's own box instead of the
          viewport, so it must render outside that subtree. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className={styles.mobilePanel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: motionDurations.fast }}
              >
                <div className={styles.mobilePanelTop}>
                  <button
                    type="button"
                    className={styles.menuButton}
                    aria-label="Fechar menu"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={`${styles.menuIcon} ${styles.menuIconClose}`}>
                      <span />
                      <span />
                    </span>
                  </button>
                </div>
                <ul className={styles.mobileNav}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} onClick={() => setMenuOpen(false)}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={cta.href}
                  className={`btn btn--primary ${styles.mobileCta}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {cta.label}
                </a>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
