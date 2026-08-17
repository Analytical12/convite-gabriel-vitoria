import Image from "next/image";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./GallerySection.module.css";

const captions = ["O nosso sim", "Entre encontros", "O nosso lugar", "Um novo capítulo"];
const alternativeTexts = [
  "Detalhe da aliança de noivado de Vitória",
  "Fotografia demonstrativa da galeria do casamento",
  "Fotografia demonstrativa da galeria do casamento",
  "Fotografia demonstrativa da galeria do casamento",
];

export default function GallerySection() {
  return (
    <section id="momentos" className={`section paper-texture ${styles.section}`}>
      <div className="container section--centered">
        <Reveal>
          <p className="eyebrow">Memórias</p>
          <h2>Alguns capítulos da nossa história</h2>
          <p className={styles.placeholderNote}>Momentos que guardamos com carinho.</p>
        </Reveal>

        <div className={styles.gallery}>
          {PUBLIC_EXPERIENCE.images.gallery.map((src, index) => (
            <Reveal key={`${src}-${index}`} delay={0.04 * index}>
              <figure className={`${styles.figure} ${styles[`figure${index + 1}`]}`}>
                <div className={`${styles.imageWrap} gallery-slot--${index + 1}`}>
                  <Image
                    src={src}
                    alt={alternativeTexts[index] ?? "Fotografia da galeria do casamento"}
                    fill
                    sizes="(max-width: 700px) 46vw, 280px"
                    className={`${styles.image} gallery-image-color`}
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
