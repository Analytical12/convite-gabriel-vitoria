import { PUBLIC_EXPERIENCE } from "@/lib/constants";
import Reveal from "./Reveal";
import styles from "./LodgingSection.module.css";

export default function LodgingSection() {
  if (!PUBLIC_EXPERIENCE.showLodging) return null;

  return (
    <section className={`section container section--centered ${styles.section}`}>
      <Reveal>
        <p className="eyebrow">Para quem vem de longe</p>
        <h2>Onde ficar</h2>
        <p className="prose">Reuniremos aqui algumas sugestões de hospedagem próximas ao local.</p>
      </Reveal>
      <div className={styles.placeholder}>
        <span>Hotel a definir</span>
        <p>Endereço e distância do local serão inseridos aqui.</p>
        <button type="button" className="btn btn--outline" disabled>Visitar site</button>
      </div>
    </section>
  );
}
