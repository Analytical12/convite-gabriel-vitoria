import { scheduleCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import styles from "./ScheduleSection.module.css";

export default function ScheduleSection() {
  return (
    <section id="programacao" className={`section section--tinted ${styles.section}`}>
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">{scheduleCopy.eyebrow}</p>
          <h2>{scheduleCopy.title}</h2>
          <p className={styles.intro}>{scheduleCopy.intro}</p>
        </Reveal>

        <ul className={styles.list}>
          {scheduleCopy.items.map((item, index) => (
            <Reveal as="li" key={item.label} delay={0.05 * (index + 1)}>
              <div className={styles.item}>
                <span className={styles.icon}><ScheduleIcon type={item.icon} /></span>
                <span className={styles.time}>{item.time}</span>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.note}>{item.note}</span>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.28}>
          <p className={styles.closing}>{scheduleCopy.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}

function ScheduleIcon({ type }: { type: string }) {
  if (type === "rings") return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="18" cy="27" r="10"/><circle cx="30" cy="27" r="10"/><path d="m25 14 5-6 5 6-5 5Z"/></svg>;
  if (type === "glasses") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 8h12l-2 14a7 7 0 0 1-7 6h0a7 7 0 0 1-7-6L4 8h6Zm16 0h12l2 14a7 7 0 0 1-7 6h0a7 7 0 0 1-7-6L24 8h2ZM13 28v10m-5 2h10m15-12v10m-5 2h10"/></svg>;
  if (type === "farewell") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 29c7-1 9-7 10-14 4 4 7 9 6 16m16-2c-7-1-9-7-10-14-4 4-7 9-6 16M11 35c8-3 18-3 26 0M17 40h14"/></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40h32M12 40V18l12-9 12 9v22M18 40V27h12v13M8 18h32"/></svg>;
}
