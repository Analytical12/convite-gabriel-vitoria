import Image from "next/image";
import { footerCopy } from "@/lib/copy";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <p className={styles.names}>{footerCopy.names}</p>
      <p className={styles.date}>{footerCopy.date}</p>
      <p className={styles.closing}>{footerCopy.closing}</p>
      <Image
        src="/assets/monogram-gv.webp"
        alt=""
        width={32}
        height={32}
        className={styles.monogram}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </footer>
  );
}
