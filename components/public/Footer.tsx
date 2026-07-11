import { footerCopy } from "@/lib/copy";
import MonogramImage from "./MonogramImage";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
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
