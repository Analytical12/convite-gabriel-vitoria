import { bigDayCopy, countdownCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import Countdown from "./Countdown";
import styles from "./WeddingDetails.module.css";

export default function WeddingDetails() {
  const mapsQuery = encodeURIComponent(`${bigDayCopy.venueName}, ${bigDayCopy.address}`);

  return (
    <section id="grande-dia" className="section section--tinted">
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">{bigDayCopy.eyebrow}</p>
          <h2>{bigDayCopy.title}</h2>
        </Reveal>

        <div className={styles.grid}>
          <Reveal delay={0.05}>
            <div className={`card ${styles.detailCard}`}>
              <p className={styles.venue}>{bigDayCopy.venueName}</p>
              <p className={styles.address}>{bigDayCopy.address}</p>
              <a
                className={styles.mapLink}
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver no mapa
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className={`card ${styles.detailCard}`}>
              <p className={styles.arrivalNote}>{bigDayCopy.arrivalNote}</p>
            </div>
          </Reveal>
        </div>

        <div className={styles.countdownWrap}>
          <Reveal delay={0.15}>
            <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>
              {countdownCopy.eyebrow}
            </p>
            <Countdown />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
