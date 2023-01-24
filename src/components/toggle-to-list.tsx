import { useContext } from "react";

import { FirebaseContext } from "../app/firebase-provider";
import type { SearchResult } from "../types";
import { triggerParty } from "./party";

export function ToggleToList({
  result,
  isArchive,
}: {
  result: SearchResult;
  isArchive?: boolean;
}) {
  const { list, user, addToList, removeFromList } = useContext(FirebaseContext);
  const onListAlready = new Set(list.map((r) => r.result.id)).has(result.id);

  let text = "";
  if (onListAlready && user) {
    text = "Check off";
  } else if (onListAlready) {
    text = "Remove from my list";
  } else if (isArchive) {
    text = "Add back to my list";
  } else {
    text = "Add to my list";
  }
  return (
    <button
      data-testid="display-toggle"
      onClick={(event) => {
        if (onListAlready) {
          removeFromList(result).then(() => {
            triggerParty(event.target as HTMLElement);
          });
        } else {
          addToList(result).then(() => {
            triggerParty(event.target as HTMLElement);
          });
        }
      }}
    >
      {text}
    </button>
  );
}
