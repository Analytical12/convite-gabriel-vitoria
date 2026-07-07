import { heroCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import styles from "./HeroInvite.module.css";

export default function HeroInvite() {
  return (
    <section id="topo" className={`container ${styles.hero}`}>
      <Reveal>
        <h1 className={styles.names}>{heroCopy.names}</h1>
        <p className={styles.date}>{heroCopy.date}</p>
        <p className={styles.location}>{heroCopy.location}</p>
        <hr className="hairline hairline--center" />
        <p className={styles.intro}>{heroCopy.intro}</p>
      </Reveal>
    </section>
  );
}
