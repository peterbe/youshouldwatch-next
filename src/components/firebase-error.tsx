"use client";

import { useContext } from "react";
import { FirebaseContext } from "../app/firebase-provider";
import { DisplayError } from "./display-error";

export function PossibleFirebaseError() {
  const { firebaseError, resetFirebaseError } = useContext(FirebaseContext);

  if (!firebaseError) {
    return null;
  }
  return (
    <DisplayError
      error={firebaseError}
      closeError={() => {
        resetFirebaseError();
      }}
    />
  );
}
