import Image from "next/image";
import { footerCopy } from "@/lib/copy";
import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import MonogramImage from "./MonogramImage";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`container paper-texture ${styles.footer}`}>
      <div className="closing-photo-frame">
        <Image
          src={PUBLIC_EXPERIENCE.images.closing}
          alt="Fotografia demonstrativa de encerramento"
          fill
          sizes="(max-width: 760px) 100vw, 960px"
          className="closing-photo"
        />
      </div>
      <MonogramImage
        src="/assets/monogram-gv.webp"
        alt=""
        width={54}
        height={54}
        className={styles.monogram}
      />
      <p className={styles.prelude}>{footerCopy.prelude}</p>
      <p className={styles.names}>{footerCopy.names}</p>
      <p className={styles.date}>{footerCopy.date}</p>
      <p className={styles.closing}>{footerCopy.closing}</p>
    </footer>
  );
}
