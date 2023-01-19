"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

import { FirebaseContext } from "../app/firebase-provider";
import { font } from "./font";
import { GoBackHome } from "./go-back-home";
import { getLastLogin } from "./utils";
import { DisplayError } from "./display-error";

export function SignIn() {
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { user, auth, signOut } = useContext(FirebaseContext);

  const [lastLogin, setLastLogin] = useState("");
  useEffect(() => {
    const v = getLastLogin();
    if (v) {
      setLastLogin(v);
    }
  }, []);

  return (
    <div>
      <h2 className={font.className}>Sign up/in</h2>
      {user && (
        <Link href="/">
          Already signed in as <b>{user.email}</b>
        </Link>
      )}
      {user && (
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
        >
          Sign out
        </button>
      )}
      {!user && (
        <div>
          <button
            data-testid="auth-google"
            onClick={() => {
              if (auth) {
                const provider = new GoogleAuthProvider();
                if (lastLogin) {
                  provider.setCustomParameters({
                    login_hint: lastLogin,
                  });
                }
                signInWithRedirect(auth, provider).catch((err) => {
                  if (err instanceof Error) {
                    setError(err);
                  } else {
                    throw err;
                  }
                });
              }
            }}
          >
            Sign in with Google
          </button>
          {lastLogin && (
            <p>
              Last time you signed in, it was with <b>{lastLogin}</b>
            </p>
          )}
          <p>
            It&apos;s <b>optional</b>.<br />
            If you don&apos;t sign in, you won&apos;t be able to keep your list
            if you ever reset your browser or switch to another browser.
          </p>
        </div>
      )}

      {error && (
        <DisplayError
          error={error}
          title="Unable to sign in"
          closeError={() => setError(null)}
        />
      )}

      <GoBackHome />
    </div>
  );
}
