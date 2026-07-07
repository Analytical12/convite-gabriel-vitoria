"use client";

import { useActionState } from "react";
import { adminCopy } from "@/lib/copy";
import { requestMagicLink, type MagicLinkState } from "./actions";
import "@/styles/public.css";
import styles from "./login.module.css";

const initialState: MagicLinkState = { status: "idle", message: "" };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(requestMagicLink, initialState);

  return (
    <main className={styles.wrap}>
      <div className={styles.panel}>
        <h1 className={styles.title}>{adminCopy.loginTitle}</h1>

        {state.status === "sent" ? (
          <>
            <p className={styles.intro}>{adminCopy.loginSentTitle}</p>
            <p className={styles.sent}>{adminCopy.loginSentBody}</p>
          </>
        ) : (
          <>
            <p className={styles.intro}>{adminCopy.loginIntro}</p>
            <form action={formAction} className={styles.form}>
              <div className="field">
                <label htmlFor="login-email">{adminCopy.loginEmailLabel}</label>
                <input id="login-email" name="email" type="email" required autoComplete="email" />
              </div>
              {state.status === "error" && (
                <p className="error-text" role="alert">
                  {state.message}
                </p>
              )}
              <button type="submit" className="btn btn--primary" disabled={isPending}>
                {isPending ? "Enviando..." : adminCopy.loginSubmitLabel}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
