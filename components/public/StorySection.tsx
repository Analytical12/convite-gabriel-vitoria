import { storyCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import styles from "./StorySection.module.css";

export default function StorySection() {
  return (
    <section id="historia" className="section container section--centered">
      <Reveal>
        <p className="eyebrow">{storyCopy.eyebrow}</p>
        <h2>{storyCopy.title}</h2>
      </Reveal>

      <div className={styles.wrap} style={{ textAlign: "left" }}>
        {storyCopy.paragraphs.map((paragraph, index) => (
          <Reveal key={paragraph.slice(0, 24)} delay={0.05 * (index + 1)}>
            <p className={styles.paragraph}>{paragraph}</p>
          </Reveal>
        ))}
        <Reveal delay={0.05 * (storyCopy.paragraphs.length + 1)}>
          <p className={styles.signature}>{storyCopy.signature}</p>
        </Reveal>
      </div>
    </section>
  );
}
