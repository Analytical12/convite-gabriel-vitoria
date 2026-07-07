import { scheduleCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import styles from "./ScheduleSection.module.css";

export default function ScheduleSection() {
  return (
    <section id="programacao" className="section section--tinted">
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">{scheduleCopy.eyebrow}</p>
          <h2>{scheduleCopy.title}</h2>
        </Reveal>

        <ul className={styles.list}>
          {scheduleCopy.items.map((item, index) => (
            <Reveal as="li" key={item.label} delay={0.05 * (index + 1)}>
              <div className={styles.item}>
                <span className={styles.time}>{item.time}</span>
                <span className={styles.label}>{item.label}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
