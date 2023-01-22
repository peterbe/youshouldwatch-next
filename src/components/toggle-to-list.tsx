import { useContext } from "react";

import { FirebaseContext } from "../app/firebase-provider";
import type { SearchResult } from "../types";
import { triggerParty } from "./party";

export function ToggleToList({ result }: { result: SearchResult }) {
  const { list, addToList, removeFromList } = useContext(FirebaseContext);
  const onListAlready = new Set(list.map((r) => r.result.id)).has(result.id);

  return (
    <button
      data-testid="display-toggle"
      onClick={(event) => {
        if (onListAlready) {
          removeFromList(result);
        } else {
          addToList(result).then(() => {
            triggerParty(event.target as HTMLElement);
          });
        }
      }}
    >
      {onListAlready ? "Remove from your list" : "Add to my list"}
    </button>
  );
}
