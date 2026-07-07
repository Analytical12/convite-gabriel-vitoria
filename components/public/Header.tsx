"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { headerCopy, heroCopy } from "@/lib/copy";
import { motionDurations, motionEasing } from "@/lib/design-tokens";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.base, ease: motionEasing.standard }}
    >
      <span className={styles.brand}>{heroCopy.names}</span>

      <nav aria-label="Navegação principal" className={styles.nav}>
        <ul className={styles.nav}>
          {headerCopy.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <a href="#rsvp" className={`btn btn--outline ${styles.cta}`}>
        {headerCopy.cta}
      </a>

      <button
        type="button"
        className={styles.menuButton}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={styles.menuIcon}>
          <span />
          <span />
        </span>
      </button>

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
                <span className={styles.menuIcon}>
                  <span />
                  <span />
                </span>
              </button>
            </div>
            <ul className={styles.mobileNav}>
              {headerCopy.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#rsvp"
              className={`btn btn--primary ${styles.mobileCta}`}
              onClick={() => setMenuOpen(false)}
            >
              {headerCopy.cta}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
