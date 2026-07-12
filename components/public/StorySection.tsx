import Image from "next/image";
import { storyCopy } from "@/lib/copy";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./StorySection.module.css";

export default function StorySection() {
  return (
    <section id="historia" className={`section container paper-texture ${styles.section}`}>
      <Reveal>
        <p className="eyebrow">{storyCopy.eyebrow}</p>
        <h2>{storyCopy.title}</h2>
      </Reveal>

      <div className={styles.editorial}>
        <Reveal delay={0.04}>
          <div className={styles.photoFrame}>
            <Image src={PUBLIC_EXPERIENCE.images.story} alt="Fotografia demonstrativa da história do casal" fill sizes="(max-width: 700px) 86vw, 430px" className={styles.photo} />
          </div>
        </Reveal>
        <div className={styles.wrap}>
          {storyCopy.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.05 * (index + 1)}>
              <p className={styles.paragraph}>{paragraph}</p>
            </Reveal>
          ))}
          <Reveal delay={0.05 * (storyCopy.paragraphs.length + 1)}>
            <p className={styles.signature}>{storyCopy.signature}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
