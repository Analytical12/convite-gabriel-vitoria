import Image from "next/image";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./GallerySection.module.css";

const captions = ["Entre encontros", "Nos detalhes", "O nosso lugar", "Um novo capítulo"];

export default function GallerySection() {
  return (
    <section id="momentos" className={`section ${styles.section}`}>
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">Memórias</p>
          <h2>Alguns capítulos da nossa história</h2>
          <p className={styles.placeholderNote}>Imagens demonstrativas — em breve, nossos momentos.</p>
        </Reveal>

        <div className={styles.gallery}>
          {PUBLIC_EXPERIENCE.images.gallery.map((src, index) => (
            <Reveal key={`${src}-${index}`} delay={0.04 * index}>
              <figure className={`${styles.figure} ${styles[`figure${index + 1}`]}`}>
                <div className={styles.imageWrap}>
                  <Image
                    src={src}
                    alt="Fotografia demonstrativa da galeria do casamento"
                    fill
                    sizes="(max-width: 700px) 46vw, 280px"
                    className={styles.image}
                  />
                </div>
                <figcaption>{captions[index]}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
