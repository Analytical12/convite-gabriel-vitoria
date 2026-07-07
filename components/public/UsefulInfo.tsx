import { usefulInfoCopy } from "@/lib/copy";
import { WEDDING } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./UsefulInfo.module.css";

export default function UsefulInfo() {
  return (
    <section id="informacoes" className="section container section--centered">
      <Reveal>
        <p className="eyebrow">{usefulInfoCopy.eyebrow}</p>
        <h2>{usefulInfoCopy.title}</h2>
      </Reveal>

      <div className={styles.grid}>
        <Reveal delay={0.05}>
          <div className={`card ${styles.item}`}>
            <p className={styles.label}>{usefulInfoCopy.dressCode.label}</p>
            <p className={styles.value}>{usefulInfoCopy.dressCode.value}</p>
            <p className={styles.note}>{usefulInfoCopy.dressCode.note}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className={`card ${styles.item}`}>
            <p className={styles.label}>{usefulInfoCopy.parking.label}</p>
            <p className={styles.note} style={{ marginTop: "var(--space-4)" }}>
              {usefulInfoCopy.parking.note}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className={`card ${styles.item}`}>
            <p className={styles.label}>{usefulInfoCopy.contact.label}</p>
            <p className={styles.note} style={{ marginTop: "var(--space-4)" }}>
              Em caso de dúvidas, entre em contato pelo WhatsApp:{" "}
              <a href={WEDDING.whatsappHref} target="_blank" rel="noreferrer">
                {WEDDING.whatsapp}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
