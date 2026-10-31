import Image from "next/image";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./GallerySection.module.css";

export default function GallerySection() {
  return (
    <section id="momentos" className={`section paper-texture ${styles.section}`}>
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">Memórias</p>
          <h2>Alguns capítulos da nossa história</h2>
          <p className={styles.placeholderNote}>Momentos que guardamos com carinho.</p>
        </Reveal>

        {/* Figures are the grid items (Reveal sits inside) so the frame
            rhythm — colors, arches, offsets — can be set with nth-child. */}
        <div className={styles.gallery}>
          {PUBLIC_EXPERIENCE.images.gallery.map((photo, index) => (
            <figure key={photo.src} className={styles.figure}>
              <Reveal delay={0.04 * (index % 5)}>
                <div className={styles.imageWrap}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 760px) 46vw, 210px"
                    className={styles.image}
                  />
                </div>
              </Reveal>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
