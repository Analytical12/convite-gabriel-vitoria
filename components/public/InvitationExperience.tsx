"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import InvitationEnvelope from "./InvitationEnvelope";
import Header from "./Header";

type Phase = "closed" | "revealed" | "done";

export default function InvitationExperience({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("closed");

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealed") return;

    const advance = () => setPhase("done");
    window.addEventListener("wheel", advance, { passive: true, once: true });
    window.addEventListener("touchmove", advance, { passive: true, once: true });

    return () => {
      window.removeEventListener("wheel", advance);
      window.removeEventListener("touchmove", advance);
    };
  }, [phase]);

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <InvitationEnvelope
            revealed={phase === "revealed"}
            onFlapOpened={() => setPhase("revealed")}
            onContinue={() => setPhase("done")}
          />
        )}
      </AnimatePresence>
      {phase === "done" && <Header />}
      {children}
    </>
  );
}
