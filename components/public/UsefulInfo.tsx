import { usefulInfoCopy } from "@/lib/copy";
import { WEDDING } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./UsefulInfo.module.css";

export default function UsefulInfo() {
  return (
    <section id="informacoes" className={`section section--paper-texture ${styles.section}`}>
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">{usefulInfoCopy.eyebrow}</p>
          <h2>{usefulInfoCopy.title}</h2>
        </Reveal>

        <div className={styles.grid}>
        <Reveal delay={0.05}>
          <article className={`${styles.item} ${styles.dressItem}`}>
            <span className={styles.number}>01</span>
            <p className={styles.label}>{usefulInfoCopy.dressCode.label}</p>
            <p className={styles.value}>{usefulInfoCopy.dressCode.value}</p>
            <p className={styles.note}>{usefulInfoCopy.dressCode.note}</p>
            <div className={styles.reservedNotes}>
              <p>{usefulInfoCopy.dressCode.reserved}</p>
              <p>{usefulInfoCopy.dressCode.bridesmaids}</p>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.1}>
          <article className={styles.item}>
            <span className={styles.number}>02</span>
            <p className={styles.label}>{usefulInfoCopy.invitation.label}</p>
            <p className={styles.note}>{usefulInfoCopy.invitation.note}</p>
          </article>
        </Reveal>

        <Reveal delay={0.15}>
          <article className={styles.item}>
            <span className={styles.number}>03</span>
            <p className={styles.label}>{usefulInfoCopy.parking.label}</p>
            <p className={styles.note}>{usefulInfoCopy.parking.note}</p>
          </article>
        </Reveal>

        <Reveal delay={0.2}>
          <article className={styles.item}>
            <span className={styles.number}>04</span>
            <p className={styles.label}>{usefulInfoCopy.timing.label}</p>
            <p className={styles.note}>{usefulInfoCopy.timing.note}</p>
          </article>
        </Reveal>

        <Reveal delay={0.25}>
          <article className={`${styles.item} ${styles.contactItem}`}>
            <span className={styles.number}>05</span>
            <p className={styles.label}>{usefulInfoCopy.contact.label}</p>
            <p className={styles.note}>
              Em caso de dúvidas, entre em contato pelo WhatsApp:{" "}
              <a href={WEDDING.whatsappHref} target="_blank" rel="noreferrer">
                {WEDDING.whatsapp}
              </a>
              .
            </p>
          </article>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
