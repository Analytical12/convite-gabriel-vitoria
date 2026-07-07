import { welcomeCopy } from "@/lib/copy";
import Reveal from "./Reveal";

export default function WelcomeSection() {
  return (
    <section className="section container section--centered">
      <Reveal>
        <p className="eyebrow">{welcomeCopy.eyebrow}</p>
        <h2>{welcomeCopy.title}</h2>
        <p className="prose" style={{ marginTop: "var(--space-4)" }}>
          {welcomeCopy.body}
        </p>
      </Reveal>
    </section>
  );
}
