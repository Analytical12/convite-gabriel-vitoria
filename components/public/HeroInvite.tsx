import { heroCopy, verseCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import styles from "./HeroInvite.module.css";

export default function HeroInvite() {
  return (
    <section id="topo" className={`${styles.hero} paper-texture`}>
      <Reveal>
        <div className={styles.paper}>
          <span className={styles.ornament} aria-hidden="true">✦</span>
          <p className={styles.prelude}>O nosso convite</p>
          <h1 className={styles.names}>{heroCopy.names}</h1>
          <p className={styles.date}>{heroCopy.date}</p>
          <p className={styles.location}>{heroCopy.location}</p>
          <hr className="hairline hairline--center" />
          <blockquote className={styles.verse}>“{verseCopy.text}”</blockquote>
          <cite>{verseCopy.reference}</cite>
        </div>
      </Reveal>
    </section>
  );
}
