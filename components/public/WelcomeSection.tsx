import Image from "next/image";
import { welcomeCopy } from "@/lib/copy";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./WelcomeSection.module.css";

export default function WelcomeSection() {
  return (
    <section className={`section container paper-texture ${styles.section}`}>
      <Reveal>
        <div className={styles.medallion}>
          <Image
            src={PUBLIC_EXPERIENCE.images.portrait}
            alt="Fotografia demonstrativa do casal"
            fill
            sizes="(max-width: 700px) 72vw, 360px"
            className={styles.photo}
          />
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <div className={styles.letter}>
          <p className="eyebrow">{welcomeCopy.eyebrow}</p>
          <h2>{welcomeCopy.title}</h2>
          {welcomeCopy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className={styles.signature}>{welcomeCopy.signature}</p>
        </div>
      </Reveal>
    </section>
  );
}
