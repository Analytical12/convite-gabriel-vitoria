import { footerCopy } from "@/lib/copy";
import MonogramImage from "./MonogramImage";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <p className={styles.names}>{footerCopy.names}</p>
      <p className={styles.date}>{footerCopy.date}</p>
      <p className={styles.closing}>{footerCopy.closing}</p>
      <MonogramImage
        src="/assets/monogram-gv.webp"
        alt=""
        width={32}
        height={32}
        className={styles.monogram}
      />
    </footer>
  );
}
