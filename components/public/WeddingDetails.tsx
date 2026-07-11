import { bigDayCopy, countdownCopy } from "@/lib/copy";
import Reveal from "./Reveal";
import Countdown from "./Countdown";
import styles from "./WeddingDetails.module.css";
import Image from "next/image";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";

export default function WeddingDetails() {
  const mapsQuery = encodeURIComponent(`${bigDayCopy.venueName}, ${bigDayCopy.address}`);

  return (
    <section id="grande-dia" className={`section ${styles.section}`}>
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">{bigDayCopy.eyebrow}</p>
          <h2>{bigDayCopy.title}</h2>
        </Reveal>

        <div className={styles.invitePage}>
          <Reveal delay={0.05}>
            <div className={styles.venueImage}>
              <Image src={PUBLIC_EXPERIENCE.images.venue} alt="Imagem demonstrativa do local" fill sizes="(max-width: 700px) 72vw, 360px" className={styles.photo} />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className={styles.details}>
              <p className={styles.date}>{bigDayCopy.date}</p>
              <div className={styles.timeGrid}>
                <div><span>{bigDayCopy.arrivalLabel}</span><strong>{bigDayCopy.arrivalTime}</strong></div>
                <div><span>{bigDayCopy.ceremonyLabel}</span><strong>{bigDayCopy.ceremonyTime}</strong></div>
              </div>
              <p className={styles.venue}>{bigDayCopy.venueName}</p>
              <p className={styles.address}>{bigDayCopy.address}</p>
              <a className="btn btn--outline" href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noreferrer">Ver no mapa</a>
            </div>
          </Reveal>
        </div>

        <div className={styles.countdownWrap}>
          <Reveal delay={0.15}>
            <span className={styles.divider} aria-hidden="true">◇</span>
            <p className="eyebrow">{countdownCopy.eyebrow}</p>
            <h3>{countdownCopy.title}</h3>
            <Countdown />
            <span className={styles.divider} aria-hidden="true">◇</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
